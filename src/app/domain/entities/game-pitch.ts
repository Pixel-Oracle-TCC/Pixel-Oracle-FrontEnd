/**
 * Pitch pré-lançamento — alinhado a PixelOracle-API GamePitch.
 * Sem reviews, vendas ou notas de usuários.
 */
export interface GamePitch {
  titulo: string;
  descricao: string;
  genres: string[];
  price_brl?: number;
  top_k?: number;
}
