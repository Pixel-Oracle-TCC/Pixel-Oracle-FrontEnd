import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from '../../domain/entities/api-error';

export function mapHttpError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return new ApiError(
        'Não foi possível conectar à API. Verifique se o servidor está rodando.',
        'network',
        0,
      );
    }

    if (error.status === 422) {
      const body = error.error as { mensagem?: string; message?: string } | null;
      const msg =
        body?.mensagem ?? body?.message ?? 'Dados do pitch inválidos. Revise o formulário.';
      return new ApiError(msg, 'validation', 422, error.error);
    }

    if (error.status === 502 || error.status === 503) {
      return new ApiError(
        'O serviço de ML está temporariamente indisponível. Tente novamente em instantes.',
        'ml_offline',
        error.status,
        error.error,
      );
    }

    if (error.status === 504) {
      return new ApiError(
        'A análise demorou demais. A primeira chamada pode levar até 3 minutos.',
        'timeout',
        error.status,
      );
    }

    const body = error.error as { mensagem?: string; message?: string } | null;
    return new ApiError(
      body?.mensagem ?? body?.message ?? `Erro na API (${error.status}).`,
      'unknown',
      error.status,
      error.error,
    );
  }

  if (
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name: string }).name === 'TimeoutError') ||
    (error instanceof Error && /timeout/i.test(error.message))
  ) {
    return new ApiError(
      'A análise demorou demais. A primeira chamada pode levar até 3 minutos.',
      'timeout',
    );
  }

  return new ApiError('Ocorreu um erro inesperado ao gerar o relatório.', 'unknown');
}
