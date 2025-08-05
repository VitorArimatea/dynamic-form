export interface Formulario {
  id: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface Pergunta {
  id: string;
  id_formulario: string;
  titulo: string;
  codigo: string;
  orientacao_resposta: string;
  ordem: number;
  obrigatoria: boolean;
  sub_pergunta: boolean;
  tipo_pergunta: TipoPergunta;
}

export type TipoPergunta =
  | "Sim_Não"
  | "multipla_escolha"
  | "unica_escolha"
  | "texto_livre"
  | "Inteiro"
  | "Numero com duas casas decimais";

export interface OpcoesRespostas {
  id: string;
  id_pergunta: string;
  resposta: string;
  ordem: number;
  resposta_aberta: boolean;
}

export interface OpcoesRespostaPergunta {
  id: string;
  id_pergunta: string;
  id_opcao_resposta: string;
}


