import { FORM_LIMITS, QUESTION_TYPES } from "../constants";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class FormValidator {
  static validateFormTitle(title: string): ValidationResult {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push("Título é obrigatório");
    }

    if (title.length > FORM_LIMITS.MAX_TITLE_LENGTH) {
      errors.push(
        `Título deve ter no máximo ${FORM_LIMITS.MAX_TITLE_LENGTH} caracteres`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateFormDescription(description: string): ValidationResult {
    const errors: string[] = [];

    if (description.length > FORM_LIMITS.MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `Descrição deve ter no máximo ${FORM_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateQuestionTitle(title: string): ValidationResult {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push("Título da pergunta é obrigatório");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateConditionalSetup(
    parentId: string | undefined,
    conditionalValue: string | undefined,
    isSubQuestion: boolean
  ): ValidationResult {
    const errors: string[] = [];

    if (isSubQuestion) {
      if (!parentId) {
        errors.push("Pergunta pai deve ser selecionada para subperguntas");
      }

      if (!conditionalValue || conditionalValue.trim().length === 0) {
        errors.push("Valor de resposta que ativa deve ser especificado");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateQuestionOptions(
    questionType: string,
    options: Array<{ answer: string }>
  ): ValidationResult {
    const errors: string[] = [];

    if (
      questionType === QUESTION_TYPES.SINGLE_CHOICE ||
      questionType === QUESTION_TYPES.MULTIPLE_CHOICE
    ) {
      if (options.length < 2) {
        errors.push(
          "Perguntas de múltipla escolha devem ter pelo menos 2 opções"
        );
      }

      if (options.length > FORM_LIMITS.MAX_OPTIONS_PER_QUESTION) {
        errors.push(
          `Máximo de ${FORM_LIMITS.MAX_OPTIONS_PER_QUESTION} opções permitidas`
        );
      }

      const emptyOptions = options.filter(
        (opt) => !opt.answer || opt.answer.trim().length === 0
      );
      if (emptyOptions.length > 0) {
        errors.push("Todas as opções devem ter texto");
      }

      const duplicateOptions = options.filter(
        (opt, index) =>
          options.findIndex((o) => o.answer === opt.answer) !== index
      );
      if (duplicateOptions.length > 0) {
        errors.push("Opções não podem ser duplicadas");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCompleteForm(
    title: string,
    description: string,
    questions: Array<{
      title: string;
      questionType: string;
      options: Array<{ answer: string }>;
      subQuestion: boolean;
      conditionalParentId?: string;
      conditionalValue?: string;
    }>
  ): ValidationResult {
    const allErrors: string[] = [];

    const titleValidation = this.validateFormTitle(title);
    const descValidation = this.validateFormDescription(description);

    allErrors.push(...titleValidation.errors);
    allErrors.push(...descValidation.errors);

    if (questions.length < FORM_LIMITS.MIN_QUESTIONS) {
      allErrors.push("Pelo menos uma pergunta é obrigatória");
    }

    if (questions.length > FORM_LIMITS.MAX_QUESTIONS) {
      allErrors.push(
        `Máximo de ${FORM_LIMITS.MAX_QUESTIONS} perguntas permitidas`
      );
    }

    questions.forEach((question, index) => {
      const questionTitleValidation = this.validateQuestionTitle(
        question.title
      );
      const optionsValidation = this.validateQuestionOptions(
        question.questionType,
        question.options
      );
      const conditionalValidation = this.validateConditionalSetup(
        question.conditionalParentId,
        question.conditionalValue,
        question.subQuestion
      );

      questionTitleValidation.errors.forEach((error) =>
        allErrors.push(`Pergunta ${index + 1}: ${error}`)
      );

      optionsValidation.errors.forEach((error) =>
        allErrors.push(`Pergunta ${index + 1}: ${error}`)
      );

      conditionalValidation.errors.forEach((error) =>
        allErrors.push(`Pergunta ${index + 1}: ${error}`)
      );
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}
