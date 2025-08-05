export interface Form {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  formId: string;
  title: string;
  code: string;
  answerGuidance: string;
  order: number;
  required: boolean;
  subQuestion: boolean;
  questionType: QuestionType;
}

export type QuestionType =
  | "yes_no"
  | "multiple_choice"
  | "single_choice"
  | "free_text"
  | "integer"
  | "decimal_two_places";

export interface AnswerOption {
  id: string;
  questionId: string;
  answer: string;
  order: number;
  openAnswer: boolean;
}

export interface QuestionAnswerOption {
  id: string;
  answerOptionId: string;
  questionId: string;
}

export interface UserAnswer {
  id: string;
  formId: string;
  questionId: string;
  answer: string;
  createdAt: Date;
}

export interface QuestionConditionality {
  questionId: string;
  conditionValue: string;
  questionsToShow: string[];
}

export interface CompleteForm extends Form {
  questions: (Question & {
    options: AnswerOption[];
    conditionalities?: QuestionConditionality[];
  })[];
}
