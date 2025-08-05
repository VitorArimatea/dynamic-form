import { v4 as uuidv4 } from "uuid";

import {
  Form,
  Question,
  AnswerOption,
  CompleteForm,
  QuestionType,
  UserAnswer,
} from "@/types/form";

const STORAGE_KEY = "dynamic-forms-data";

const saveToStorage = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const storedData = loadFromStorage();
let forms: Form[] = storedData?.forms
  ? storedData.forms.map((form: any) => ({
      ...form,
      createdAt: new Date(form.createdAt),
      updatedAt: new Date(form.updatedAt),
    }))
  : [];
let questions: Question[] = storedData?.questions || [];
let options: AnswerOption[] = storedData?.options || [];
const answers: UserAnswer[] = storedData?.answers || [];

export const initializeMockData = () => {
  if (forms.length > 0) {
    console.log("Mock data already initialized, skipping...");
    return;
  }

  const formId = uuidv4();
  console.log("Initializing mock data...");

  forms = [
    {
      id: formId,
      title: "Pesquisa de Satisfação do Cliente",
      description: "Formulário para avaliar a satisfação dos nossos clientes",
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const question1Id = uuidv4();
  const question2Id = uuidv4();
  const question3Id = uuidv4();
  const question4Id = uuidv4();
  const question5Id = uuidv4();

  questions = [
    {
      id: question1Id,
      formId: formId,
      title: "Como você avalia nosso serviço?",
      code: "avaliacao_servico",
      answerGuidance: "Selecione uma opção",
      order: 1,
      required: true,
      subQuestion: false,
      questionType: "single_choice",
    },
    {
      id: question2Id,
      formId: formId,
      title: "Você recomendaria nossos serviços?",
      code: "recomendaria",
      answerGuidance: "Responda sim ou não",
      order: 2,
      required: true,
      subQuestion: false,
      questionType: "yes_no",
    },
    {
      id: question3Id,
      formId: formId,
      title: "Por que você gostou dos nossos serviços?",
      code: "motivo_positivo",
      answerGuidance: "Conte-nos o que mais gostou",
      order: 3,
      required: false,
      subQuestion: true,
      questionType: "free_text",
      conditionalParentId: question2Id,
      conditionalValue: "Sim",
    },
    {
      id: question4Id,
      formId: formId,
      title: "Por que você não gostou dos nossos serviços?",
      code: "motivo_negativo",
      answerGuidance: "Conte-nos o que não gostou para melhorarmos",
      order: 4,
      required: false,
      subQuestion: true,
      questionType: "free_text",
      conditionalParentId: question2Id,
      conditionalValue: "Não",
    },
    {
      id: question5Id,
      formId: formId,
      title: "O que você mais gostou no nosso atendimento?",
      code: "atendimento_excelente",
      answerGuidance: "Descreva o que mais se destacou",
      order: 5,
      required: false,
      subQuestion: true,
      questionType: "free_text",
      conditionalParentId: question1Id,
      conditionalValue: "Excelente",
    },
  ];

  options = [
    {
      id: uuidv4(),
      questionId: question1Id,
      answer: "Excelente",
      order: 1,
      openAnswer: false,
    },
    {
      id: uuidv4(),
      questionId: question1Id,
      answer: "Bom",
      order: 2,
      openAnswer: false,
    },
    {
      id: uuidv4(),
      questionId: question1Id,
      answer: "Regular",
      order: 3,
      openAnswer: false,
    },
    {
      id: uuidv4(),
      questionId: question1Id,
      answer: "Ruim",
      order: 4,
      openAnswer: false,
    },
    {
      id: uuidv4(),
      questionId: question2Id,
      answer: "Sim",
      order: 1,
      openAnswer: false,
    },
    {
      id: uuidv4(),
      questionId: question2Id,
      answer: "Não",
      order: 2,
      openAnswer: false,
    },
  ];
};

export const mockDataService = {
  getForms: (): Form[] => {
    const storedData = loadFromStorage();
    if (storedData?.forms) {
      forms.length = 0;
      const formsWithDates = storedData.forms.map((form: any) => ({
        ...form,
        createdAt: new Date(form.createdAt),
        updatedAt: new Date(form.updatedAt),
      }));
      forms.push(...formsWithDates);
    }
    console.log("getForms called. Current forms.length:", forms.length);
    return forms;
  },

  getForm: (id: string): Form | undefined => forms.find((f) => f.id === id),

  createForm: (form: Omit<Form, "id" | "createdAt" | "updatedAt">): Form => {
    const newForm: Form = {
      ...form,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    forms.push(newForm);

    saveToStorage({ forms, questions, options, answers });

    console.log("Form added to forms array. Total forms:", forms.length);
    console.log("Saved to localStorage");

    return newForm;
  },

  updateForm: (id: string, updates: Partial<Form>): Form | undefined => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return undefined;

    forms[index] = {
      ...forms[index],
      ...updates,
      updatedAt: new Date(),
    };

    saveToStorage({ forms, questions, options, answers });
    console.log("Form updated and saved to localStorage");

    return forms[index];
  },

  deleteForm: (id: string): boolean => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return false;

    forms.splice(index, 1);
    questions = questions.filter((q) => q.formId !== id);
    return true;
  },

  getQuestionsByForm: (formId: string): Question[] =>
    questions
      .filter((q) => q.formId === formId)
      .sort((a, b) => a.order - b.order),

  createQuestion: (question: Omit<Question, "id">): Question => {
    const newQuestion: Question = {
      ...question,
      id: uuidv4(),
      conditionalParentId: question.conditionalParentId,
      conditionalValue: question.conditionalValue,
    };
    questions.push(newQuestion);

    saveToStorage({ forms, questions, options, answers });

    return newQuestion;
  },

  updateQuestion: (
    id: string,
    updates: Partial<Question>
  ): Question | undefined => {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return undefined;

    questions[index] = { ...questions[index], ...updates };
    return questions[index];
  },

  deleteQuestion: (id: string): boolean => {
    const index = questions.findIndex((q) => q.id === id);
    if (index === -1) return false;

    questions.splice(index, 1);
    options = options.filter((o) => o.questionId !== id);
    return true;
  },

  getOptionsByQuestion: (questionId: string): AnswerOption[] =>
    options
      .filter((o) => o.questionId === questionId)
      .sort((a, b) => a.order - b.order),

  createOption: (option: Omit<AnswerOption, "id">): AnswerOption => {
    const newOption: AnswerOption = {
      ...option,
      id: uuidv4(),
    };
    options.push(newOption);
    saveToStorage({ forms, questions, options, answers });

    return newOption;
  },

  updateOption: (
    id: string,
    updates: Partial<AnswerOption>
  ): AnswerOption | undefined => {
    const index = options.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    options[index] = { ...options[index], ...updates };
    return options[index];
  },

  deleteOption: (id: string): boolean => {
    const index = options.findIndex((o) => o.id === id);
    if (index === -1) return false;

    options.splice(index, 1);
    return true;
  },

  getCompleteForm: (id: string): CompleteForm | undefined => {
    const storedData = loadFromStorage();
    if (storedData?.forms) {
      forms.length = 0;
      const formsWithDates = storedData.forms.map((form: any) => ({
        ...form,
        createdAt: new Date(form.createdAt),
        updatedAt: new Date(form.updatedAt),
      }));
      forms.push(...formsWithDates);

      if (storedData.questions) {
        questions.length = 0;
        questions.push(...storedData.questions);
      }

      if (storedData.options) {
        options.length = 0;
        options.push(...storedData.options);
      }
    }

    console.log(
      "getCompleteForm - All questions:",
      questions.filter((q) => q.formId === id)
    );
    console.log("getCompleteForm - All options:", options);

    const form = forms.find((f) => f.id === id);
    if (!form) {
      console.error("Form not found:", id);
      return undefined;
    }

    const formQuestions = questions
      .filter((q) => q.formId === id)
      .sort((a, b) => a.order - b.order)
      .map((question) => ({
        ...question,
        options: options
          .filter((o) => o.questionId === question.id)
          .sort((a, b) => a.order - b.order),
      }));

    return {
      ...form,
      questions: formQuestions,
    };
  },

  createAnswer: (answer: Omit<UserAnswer, "id" | "createdAt">): UserAnswer => {
    const newAnswer: UserAnswer = {
      ...answer,
      id: uuidv4(),
      createdAt: new Date(),
    };
    answers.push(newAnswer);
    return newAnswer;
  },

  getAnswersByForm: (formId: string): UserAnswer[] =>
    answers.filter((a) => a.formId === formId),

  getQuestionTypes: (): QuestionType[] => [
    "yes_no",
    "multiple_choice",
    "single_choice",
    "free_text",
    "integer",
    "decimal_two_places",
  ],
};

if (!loadFromStorage() || forms.length === 0) {
  initializeMockData();
  saveToStorage({ forms, questions, options, answers });
}
