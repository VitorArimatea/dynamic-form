"use server";

import { revalidatePath } from "next/cache";
import { mockDataService } from "../mock-data";
import { QuestionType, AnswerOption } from "@/types/form";

export interface FormData {
  title: string;
  description: string;
  questions: {
    title: string;
    code: string;
    answerGuidance: string;
    required: boolean;
    subQuestion: boolean;
    questionType: QuestionType;
    options: AnswerOption[];
    conditionalParentId?: string;
    conditionalValue?: string;
  }[];
}

export async function createForm(formData: FormData) {
  try {
    const newForm = mockDataService.createForm({
      title: formData.title.trim(),
      description: formData.description?.trim() || "",
      order: 1,
    });

    console.log("Form created:", newForm.id);

    let order = 1;
    for (const questionData of formData.questions) {
      if (!questionData.title?.trim()) continue;

      const newQuestion = mockDataService.createQuestion({
        formId: newForm.id,
        title: questionData.title,
        code:
          questionData.code ||
          questionData.title.toLowerCase().replace(/\s+/g, "_"),
        answerGuidance: questionData.answerGuidance || "",
        order: order++,
        required: questionData.required || false,
        subQuestion: questionData.subQuestion || false,
        questionType: questionData.questionType,
        conditionalParentId: questionData.conditionalParentId,
        conditionalValue: questionData.conditionalValue,
      });

      if (questionData.options && questionData.options.length > 0) {
        for (const option of questionData.options) {
          mockDataService.createOption({
            questionId: newQuestion.id,
            answer: option.answer,
            order: option.order,
            openAnswer: option.openAnswer || false,
          });
        }
      }
    }

    revalidatePath("/", "page");
  } catch (error) {
    console.error("Error creating form:", error);
    if (error instanceof Error) {
      throw new Error(`Erro ao criar formulário: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao criar formulário");
  }
}

export async function updateForm(formId: string, formData: FormData) {
  try {
    mockDataService.updateForm(formId, {
      title: formData.title.trim(),
      description: formData.description.trim(),
    });

    const existingQuestions = mockDataService.getQuestionsByForm(formId);
    for (const question of existingQuestions) {
      mockDataService.deleteQuestion(question.id);
    }

    let order = 1;
    for (const questionData of formData.questions) {
      if (!questionData.title.trim()) continue;

      const newQuestion = mockDataService.createQuestion({
        formId: formId,
        title: questionData.title,
        code:
          questionData.code ||
          questionData.title.toLowerCase().replace(/\s+/g, "_"),
        answerGuidance: questionData.answerGuidance,
        order: order++,
        required: questionData.required,
        subQuestion: questionData.subQuestion,
        questionType: questionData.questionType,
        conditionalParentId: questionData.conditionalParentId,
        conditionalValue: questionData.conditionalValue,
      });

      for (const option of questionData.options) {
        mockDataService.createOption({
          questionId: newQuestion.id,
          answer: option.answer,
          order: option.order,
          openAnswer: option.openAnswer,
        });
      }
    }

    revalidatePath("/");
    revalidatePath(`/formulario/${formId}`);
  } catch (error) {
    throw new Error("Erro ao atualizar formulário");
  }
}

export async function submitFormAnswers(
  formId: string,
  answers: Record<string, string | string[]>
) {
  try {
    for (const [questionId, answer] of Object.entries(answers)) {
      if (answer && answer !== "") {
        const formattedAnswer = Array.isArray(answer)
          ? answer.join(", ")
          : answer;
        mockDataService.createAnswer({
          formId: formId,
          questionId: questionId,
          answer: formattedAnswer,
        });
      }
    }

    revalidatePath(`/formulario/${formId}`);
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao enviar respostas");
  }
}

export async function deleteForm(formId: string) {
  try {
    mockDataService.deleteForm(formId);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error("Erro ao excluir formulário");
  }
}
