import type { GamePitch } from '../../domain/entities/game-pitch';

export interface PitchFormValue {
  titulo: string;
  descricao: string;
  genres: string[];
  price_brl: number | null;
}

export function mapFormToGamePitch(form: PitchFormValue): GamePitch {
  const pitch: GamePitch = {
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim(),
    genres: [...form.genres],
  };
  if (form.price_brl !== null && Number.isFinite(form.price_brl) && form.price_brl >= 0) {
    pitch.price_brl = form.price_brl;
  }
  return pitch;
}
