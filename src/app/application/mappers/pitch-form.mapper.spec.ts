import { mapFormToGamePitch } from './pitch-form.mapper';

describe('mapFormToGamePitch', () => {
  it('remove espaços e copia os gêneros', () => {
    const pitch = mapFormToGamePitch({
      titulo: '  Eco do Abismo  ',
      descricao: '  Metroidvania com mapa interligado.  ',
      genres: ['Indie'],
      price_brl: null,
    });

    expect(pitch.titulo).toBe('Eco do Abismo');
    expect(pitch.descricao).toBe('Metroidvania com mapa interligado.');
    expect(pitch.genres).toEqual(['Indie']);
    expect(pitch.price_brl).toBeUndefined();
  });

  it('mantém preço zero e descarta preço inválido', () => {
    expect(
      mapFormToGamePitch({
        titulo: 'Eco',
        descricao: 'Descrição longa o bastante.',
        genres: ['Indie'],
        price_brl: 0,
      }).price_brl,
    ).toBe(0);

    expect(
      mapFormToGamePitch({
        titulo: 'Eco',
        descricao: 'Descrição longa o bastante.',
        genres: ['Indie'],
        price_brl: Number.NaN,
      }).price_brl,
    ).toBeUndefined();
  });
});
