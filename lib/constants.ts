export const QUESTION_TYPES = {
  YES_NO: "yes_no",
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
  FREE_TEXT: "free_text",
  INTEGER: "integer",
  DECIMAL_TWO_PLACES: "decimal_two_places",
} as const;

export const FORM_LIMITS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_QUESTIONS: 50,
  MAX_OPTIONS_PER_QUESTION: 10,
  MIN_QUESTIONS: 1,
} as const;

export const UI_MESSAGES = {
  FORM_SAVED: "Formulário salvo com sucesso!",
  FORM_UPDATED: "Formulário atualizado com sucesso!",
  FORM_DELETED: "Formulário excluído com sucesso!",
  ANSWERS_SUBMITTED: "Respostas enviadas com sucesso!",
  LOADING: "Carregando...",
  ERROR_SAVING: "Erro ao salvar. Tente novamente.",
  ERROR_LOADING: "Erro ao carregar dados.",
  REQUIRED_FIELD: "Este campo é obrigatório",
  FORM_NOT_FOUND: "Formulário não encontrado",
} as const;

export const CONDITIONAL_EXAMPLES = {
  YES_NO: {
    YES: "Sim",
    NO: "Não",
  },
  COMMON_RATINGS: ["Excelente", "Bom", "Regular", "Ruim"],
} as const;

export const APP_CONFIG = {
  DEFAULT_QUESTION_TYPE: QUESTION_TYPES.FREE_TEXT,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_INTERVAL: 30000,
} as const;
