export interface Acao {
  id: number;
  codigo: string;
  descricao: string;
  preco: number;
}

export type Acoes = Array<Acao>;

// Retorno da API de ações
export interface AcoesAPI {
  payload: Acoes;
}
