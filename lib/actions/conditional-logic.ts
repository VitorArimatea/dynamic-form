import { Question, CompleteForm } from "@/types/form";

export interface ConditionalState {
  [questionId: string]: string | string[];
}

export class ConditionalLogic {
  static shouldShowQuestion(
    question: Question,
    form: CompleteForm,
    answers: ConditionalState
  ): boolean {
    if (!question.subQuestion) return true;

    if (!question.conditionalParentId || !question.conditionalValue)
      return true;

    const parentQuestion = form.questions.find(
      (q) => q.id === question.conditionalParentId
    );

    if (!parentQuestion) return true;

    const parentAnswer = answers[question.conditionalParentId];

    if (!parentAnswer) return false;

    console.log("Checking condition:", {
      questionTitle: question.title,
      parentAnswer,
      expectedValue: question.conditionalValue,
      parentType: parentQuestion.questionType,
    });

    return ConditionalLogic.checkCondition(
      parentAnswer,
      question.conditionalValue,
      parentQuestion.questionType
    );
  }

  static checkCondition(
    actualValue: string | string[],
    expectedValue: string,
    questionType: string
  ): boolean {
    switch (questionType) {
      case "yes_no":
        return actualValue === expectedValue;

      case "single_choice":
        return actualValue === expectedValue;

      case "multiple_choice":
        if (Array.isArray(actualValue)) {
          return actualValue.includes(expectedValue);
        }
        return actualValue === expectedValue;

      default:
        return actualValue === expectedValue;
    }
  }

  static getVisibleQuestions(
    form: CompleteForm,
    answers: ConditionalState
  ): Question[] {
    return form.questions.filter((question) =>
      ConditionalLogic.shouldShowQuestion(question, form, answers)
    );
  }

  static createConditionalQuestion(
    parentQuestionId: string,
    triggerValue: string,
    questionData: Partial<Question>
  ): Partial<Question> {
    return {
      ...questionData,
      subQuestion: true,
      conditionalParentId: parentQuestionId,
      conditionalValue: triggerValue,
    };
  }

  static getChildQuestions(
    parentQuestionId: string,
    form: CompleteForm
  ): Question[] {
    return form.questions.filter(
      (question) => question.conditionalParentId === parentQuestionId
    );
  }
}
