
export interface Classificacao {
  id: string;
  codigo: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
}

export interface Modalidade {
  id: string;
  nome: string;
  categoria: string;
  createdAt: string;
  updatedAt: string;
}

export interface TipoMetrica {
  id: string;
  nome: string;
  unidadeMedida: string;
  createdAt: string;
  updatedAt: string;
}


export interface AtletaDetalhado {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  usuarioId: string;
  createdAt: string;
  updatedAt: string;

  classificacoes: Classificacao[]; 
}

export interface ResultadoMetrica {
  id: string;
  tipoMetricaId: string;
  valor: number; // API envia 'number'
  createdAt: string;
  updatedAt: string;
  tipoMetrica: TipoMetrica; // Onde lemos "Tempo", "s"
}

export interface RegistroAvaliacaoCompleto {
  id: string;
  atletaId: string;
  modalidadeId: string;
  tipo: 'PRE_TREINO' | 'POS_TREINO';
  observacoes: string | null;
  dataHora: string;
  createdAt: string;
  updatedAt: string;
  modalidade: Modalidade;
  resultados: ResultadoMetrica[]; 
}


export interface AtletaResumido {
  id: string;
  nomeCompleto: string;
  dataNascimento: string; // API envia string
  createdAt: string;
  updatedAt: string;
  usuarioId: string;
}