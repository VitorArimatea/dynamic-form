import { FormQuestion } from "../hooks/useFormManager";
import { CompleteForm, QuestionType } from "../types/form";

export const STORAGE_KEY = "dynamic-forms-final";

interface StoredForm {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface StoredQuestion {
  id: string;
  formId: string;
  title: string;
  code: string;
  answerGuidance: string;
  order: number;
  required: boolean;
  subQuestion: boolean;
  questionType: string;
  conditionalParentId: string | null;
  conditionalValue: string | null;
}

interface StoredOption {
  id: string;
  questionId: string;
  answer: string;
  order: number;
  openAnswer: boolean;
}

export interface StorageData {
  forms: StoredForm[];
  questions: StoredQuestion[];
  options: StoredOption[];
  answers: any[];
}

export const saveFormToStorage = (
  formData: { title: string; description: string; questions: FormQuestion[] },
  formIdToUpdate?: string
): string | null => {
  try {
    const data = getStorageData();
    const isUpdate = !!formIdToUpdate;
    const formId = isUpdate ? formIdToUpdate : `form-${Date.now()}`;

    if (isUpdate) {
      const formIndex = data.forms.findIndex((f) => f.id === formId);
      if (formIndex === -1)
        throw new Error("Formulário não encontrado para edição.");

      data.forms[formIndex] = {
        ...data.forms[formIndex],
        title: formData.title,
        description: formData.description,
        updatedAt: new Date().toISOString(),
      };

      const oldQuestionIds = data.questions
        .filter((q) => q.formId === formId)
        .map((q) => q.id);
      data.questions = data.questions.filter((q) => q.formId !== formId);
      data.options = data.options.filter(
        (o) => !oldQuestionIds.includes(o.questionId)
      );
    } else {
      const newForm: StoredForm = {
        id: formId,
        title: formData.title,
        description: formData.description,
        order: data.forms.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.forms.push(newForm);
    }

    processAndAddQuestions(data, formData.questions, formId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return formId;
  } catch (error) {
    return null;
  }
};

export const getStorageData = (): StorageData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const defaults: StorageData = {
      forms: [],
      questions: [],
      options: [],
      answers: [],
    };
    if (!stored) return defaults;

    const parsed = JSON.parse(stored);
    return { ...defaults, ...parsed };
  } catch {
    return { forms: [], questions: [], options: [], answers: [] };
  }
};

export const getFormById = (id: string): CompleteForm | null => {
  const data = getStorageData();
  const form = data.forms.find((f) => f.id === id);

  if (!form) return null;

  const questions = data.questions
    .filter((q) => q.formId === id)
    .sort((a, b) => a.order - b.order)
    .map((question) => ({
      ...question,
      questionType: question.questionType as QuestionType,
      conditionalParentId: question.conditionalParentId || undefined,
      conditionalValue: question.conditionalValue || undefined,
      options: data.options
        .filter((o) => o.questionId === question.id)
        .sort((a, b) => a.order - b.order),
    }));

  return {
    ...form,
    createdAt: new Date(form.createdAt),
    updatedAt: new Date(form.updatedAt),
    questions,
  };
};

export const getAllForms = () => {
  const data = getStorageData();
  return data.forms
    .map((form) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

function processAndAddQuestions(
  data: StorageData,
  questions: FormQuestion[],
  formId: string
) {
  const questionIdMap = new Map<string, string>();

  questions.forEach((q, index) => {
    const newQuestionId = `q-${Date.now()}-${index}`;
    questionIdMap.set(q.id, newQuestionId);

    const newQuestion: StoredQuestion = {
      id: newQuestionId,
      formId: formId,
      title: q.title,
      code: q.code || q.title.toLowerCase().replace(/\s+/g, "_"),
      answerGuidance: q.answerGuidance || "",
      order: index + 1,
      required: q.required || false,
      subQuestion: q.subQuestion || false,
      questionType: q.questionType,
      conditionalParentId: null,
      conditionalValue: q.conditionalValue || null,
    };
    data.questions.push(newQuestion);

    if (q.options && q.options.length > 0) {
      q.options.forEach((opt, optIndex) => {
        const newOption: StoredOption = {
          id: `opt-${Date.now()}-${index}-${optIndex}`,
          questionId: newQuestionId,
          answer: opt.answer,
          order: optIndex + 1,
          openAnswer: opt.openAnswer || false,
        };
        data.options.push(newOption);
      });
    }
  });

  questions.forEach((q) => {
    if (q.subQuestion && q.conditionalParentId) {
      const newQuestionId = questionIdMap.get(q.id);
      const newParentId = questionIdMap.get(q.conditionalParentId);

      if (newQuestionId && newParentId) {
        const questionToUpdate = data.questions.find(
          (dq) => dq.id === newQuestionId
        );
        if (questionToUpdate) {
          questionToUpdate.conditionalParentId = newParentId;
        }
      }
    }
  });
}
