import {
  faturamentoBoxleiter,
  formatPct,
  formatPreco,
  steamUrl,
} from './format.util';

describe('formatadores do dashboard', () => {
  it('formata percentual e trata valor ausente', () => {
    expect(formatPct(0.5)).toBe('50%');
    expect(formatPct(null)).toBe('—');
  });

  it('formata preço em real e omite nulo', () => {
    expect(formatPreco(null)).toBeNull();
    expect(formatPreco(29.9)).toContain('29,90');
  });

  it('não estima faturamento sem reviews ou sem preço', () => {
    expect(faturamentoBoxleiter(null, 10)).toBeNull();
    expect(faturamentoBoxleiter(0, 10)).toBeNull();
    expect(faturamentoBoxleiter(100, 0)).toBeNull();
    expect(faturamentoBoxleiter(10, 20)).toBe(10 * 30 * 20);
  });

  it('monta a URL da Steam só com app id', () => {
    expect(steamUrl(null)).toBeNull();
    expect(steamUrl(367520)).toBe('https://store.steampowered.com/app/367520');
  });
});
