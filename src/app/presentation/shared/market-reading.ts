import type { DecisiveFactor, FullReport } from '../../domain/entities/full-report';
import { formatPct, formatPreco } from './format.util';

export interface LeituraMercado {
  encaixe: string;
  atencao: string;
}

export function leituraDeMercado(report: FullReport, precoPitch: number | null): LeituraMercado {
  return {
    encaixe: encaixe(report, precoPitch),
    atencao: atencao(report),
  };
}

function encaixe(report: FullReport, precoPitch: number | null): string {
  const jogos = report.dashboard.jogos_similares;
  const generos = report.jogo.genres.length > 0 ? report.jogo.genres.join(', ') : 'sem gênero informado';
  if (jogos.length === 0) {
    return `“${report.jogo.titulo}” está nos gêneros ${generos}, mas a busca ainda não achou jogos parecidos para situar o pitch nesse recorte.`;
  }

  const nomes = juntar(jogos.map((jogo) => jogo.titulo));
  const precos = jogos.flatMap((jogo) => (jogo.preco_brl == null ? [] : [jogo.preco_brl]));
  const precoPitchTexto = formatPreco(precoPitch);
  const faixaPreco = faixa(precos, (valor) => formatPreco(valor) ?? '', 'a');

  const precoFrase = faixaPreco
    ? precoPitchTexto
      ? `O preço pensado para o pitch é ${precoPitchTexto}; o de tabela dos parecidos vai de ${faixaPreco}.`
      : `O preço de tabela dos parecidos vai de ${faixaPreco}.`
    : '';

  return [`“${report.jogo.titulo}”, nos gêneros ${generos}, cai no mesmo recorte de ${nomes}.`, precoFrase]
    .filter(Boolean)
    .join(' ');
}

function atencao(report: FullReport): string {
  const fatores = report.dashboard.fatores_decisivos;
  const temas = fatores.filter((fator) => fator.tipo !== 'contexto');
  const reduz = maisDistante(temas.filter((fator) => fator.direcao === 'reduz'));
  const aumenta = maisDistante(temas.filter((fator) => fator.direcao === 'aumenta'));
  const horas = fatores
    .filter((fator) => fator.tipo === 'contexto' && !fator.feature.includes('early_access'))
    .sort((a, b) => ordemHoras(a.feature) - ordemHoras(b.feature));
  const acesso = fatores.find((fator) => fator.feature.includes('early_access'));

  if (!reduz && !aumenta && horas.length === 0 && !acesso) {
    return 'Ainda não há fatores calculados para apontar o que cuidar no desenvolvimento.';
  }

  const partes: string[] = [
    'Na hora de desenvolver, o que este recorte mostra é o que faz a review recomendar o jogo.',
  ];
  if (reduz) {
    partes.push(comparacao(reduz, 'puxa a recomendação para baixo'));
  }
  if (aumenta) {
    partes.push(comparacao(aumenta, 'puxa a recomendação para cima'));
  }
  if (horas.length > 0) {
    const frases = horas.map((fator) => fraseHoras(fator));
    partes.push(`Nas horas que a Steam grava na review, ${juntar(frases)}.`);
  }
  if (acesso) {
    partes.push(
      `Quem avaliou no early access recomenda em ${formatPct(acesso.taxa_recomendacao_com)} das reviews desse grupo.`,
    );
  }
  const foco = reduz ? `cuidar de “${titulo(reduz)}”` : 'o que as reviews deste recorte já reclamam';
  partes.push(
    `O ponto de atenção no desenvolvimento é ${foco}, porque é isso que mais separa uma boa review. O recorte dos parecidos não vira previsão de sucesso deste pitch.`,
  );
  return partes.join(' ');
}

function fraseHoras(fator: DecisiveFactor): string {
  const pct = formatPct(fator.taxa_recomendacao_com);
  if (fator.feature.includes('menos_2h')) {
    return `quem jogou menos de 2 horas recomenda em ${pct}`;
  }
  if (fator.feature.includes('2_a_10h')) {
    return `quem jogou de 2 a 10 horas recomenda em ${pct}`;
  }
  if (fator.feature.includes('10_a_50h')) {
    return `quem jogou de 10 a 50 horas recomenda em ${pct}`;
  }
  if (fator.feature.includes('mais_50h')) {
    return `quem passou de 50 horas recomenda em ${pct}`;
  }
  return `${titulo(fator)}: ${pct} recomendam`;
}

function comparacao(fator: DecisiveFactor, efeito: string): string {
  const nome = titulo(fator);
  const com = formatPct(fator.taxa_recomendacao_com);
  if (fator.taxa_recomendacao_sem == null) {
    return `“${nome}” ${efeito}: ${com} recomendam o jogo quando a review cita o ponto.`;
  }
  return `“${nome}” ${efeito}: ${com} recomendam quando a review cita, contra ${formatPct(fator.taxa_recomendacao_sem)} quando não cita.`;
}

function maisDistante(fatores: DecisiveFactor[]): DecisiveFactor | null {
  return [...fatores].sort((a, b) => Math.abs(delta(b)) - Math.abs(delta(a)))[0] ?? null;
}

function delta(fator: DecisiveFactor): number {
  if (fator.taxa_recomendacao_sem == null) {
    return 0;
  }
  return fator.taxa_recomendacao_com - fator.taxa_recomendacao_sem;
}

function titulo(fator: DecisiveFactor): string {
  return fator.rotulo.replace(/^(?:Elogio|Reclamação):\s*/i, '');
}

function ordemHoras(feature: string): number {
  const ordem = ['menos_2h', '2_a_10h', '10_a_50h', 'mais_50h'];
  const indice = ordem.findIndex((nome) => feature.includes(nome));
  return indice === -1 ? ordem.length : indice;
}

function faixa(valores: number[], formatar: (valor: number) => string, conector: 'a' | 'e'): string | null {
  if (valores.length === 0) {
    return null;
  }
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);
  if (minimo === maximo) {
    return formatar(minimo);
  }
  return `${formatar(minimo)} ${conector} ${formatar(maximo)}`;
}

function juntar(itens: string[]): string {
  if (itens.length <= 1) {
    return itens[0] ?? '';
  }
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}
