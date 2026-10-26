export function formatPct(value: number | null | undefined, digits = 0): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }
  return `${(value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatWilson(low: number, high: number): string {
  const a = (low * 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  const b = (high * 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  return `${a}–${b}%`;
}

export function formatHoras(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} h`;
}

export function formatPreco(value: number | null): string | null {
  if (value == null) {
    return null;
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Donos ≈ reviews × 30, o multiplicador que a base antiga do projeto gravava. */
export const MULTIPLICADOR_BOXLEITER = 30;

export function faturamentoBoxleiter(reviews: number | null, preco: number | null): number | null {
  if (reviews == null || preco == null || reviews <= 0 || preco <= 0) {
    return null;
  }
  return reviews * MULTIPLICADOR_BOXLEITER * preco;
}

export function formatFaturamento(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `cerca de R$ ${escala(abs / 1_000_000_000)} ${abs >= 2_000_000_000 ? 'bilhões' : 'bilhão'}`;
  }
  if (abs >= 1_000_000) {
    return `cerca de R$ ${escala(abs / 1_000_000)} ${abs >= 2_000_000 ? 'milhões' : 'milhão'}`;
  }
  if (abs >= 1_000) {
    return `cerca de R$ ${Math.round(abs / 1_000).toLocaleString('pt-BR')} mil`;
  }
  return formatPreco(value) ?? '—';
}

function escala(value: number): string {
  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10;
  return rounded.toLocaleString('pt-BR', { maximumFractionDigits: value >= 10 ? 0 : 1 });
}

export function formatIdioma(value: string | null): string | null {
  if (!value) {
    return null;
  }
  const map: Record<string, string> = {
    english: 'inglês',
    portuguese: 'português',
    brazilian: 'português',
    spanish: 'espanhol',
  };
  return map[value.toLowerCase()] ?? value;
}

export function steamUrl(appId: number | null): string | null {
  return appId ? `https://store.steampowered.com/app/${appId}` : null;
}
