"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { mockDataService } from "@/lib/mock-data";
import { CompleteForm, QuestionType } from "@/types/form";

import FormHeader from "@/app/components/forms/FormHeader";
import FormInfo from "@/app/components/forms/FormInfo";
import QuestionList from "@/app/components/forms/QuestionList";
import FormActions from "@/app/components/forms/FormActions";
import { Button } from "@/app/components/ui/button";

interface Props {
  params: { id: string };
}

export default function EditForm({ params }: Props) {
  const { id } = params;
  const router = useRouter();
  const [form, setForm] = useState<CompleteForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const questionTypes = mockDataService.getQuestionTypes();

  useEffect(() => {
    const foundForm = mockDataService.getCompleteForm(id);
    if (foundForm) {
      setForm(foundForm);
    }
    setIsLoading(false);
  }, [id]);

  const updateFormField = (field: string, value: string) => {
    if (!form) return;
    setForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const addQuestion = () => {
    if (!form) return;

    const newQuestion = {
      id: `temp-${Date.now()}`,
      formId: form.id,
      title: "",
      code: "",
      answerGuidance: "",
      order: form.questions.length + 1,
      required: false,
      subQuestion: false,
      questionType: "free_text" as QuestionType,
      options: [],
      conditionalParentId: undefined,
      conditionalValue: undefined,
    };

    setForm((prev) =>
      prev ? { ...prev, questions: [...prev.questions, newQuestion] } : null
    );
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    if (!form) return;

    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };

    if (
      field === "questionType" &&
      (value === "single_choice" || value === "multiple_choice")
    ) {
      if (updatedQuestions[index].options.length === 0) {
        updatedQuestions[index].options = [
          {
            id: `opt-1-${Date.now()}`,
            questionId: updatedQuestions[index].id,
            answer: "Opção 1",
            order: 1,
            openAnswer: false,
          },
          {
            id: `opt-2-${Date.now()}`,
            questionId: updatedQuestions[index].id,
            answer: "Opção 2",
            order: 2,
            openAnswer: false,
          },
        ];
      }
    }

    setForm((prev) => (prev ? { ...prev, questions: updatedQuestions } : null));
  };

  const removeQuestion = (index: number) => {
    if (!form) return;

    const updatedQuestions = form.questions.filter((_, i) => i !== index);
    updatedQuestions.forEach((q, i) => (q.order = i + 1));

    setForm((prev) => (prev ? { ...prev, questions: updatedQuestions } : null));
  };

  const addOption = (questionIndex: number) => {
    if (!form) return;

    const updatedQuestions = [...form.questions];
    const question = updatedQuestions[questionIndex];
    const newOption = {
      id: `opt-${Date.now()}`,
      questionId: question.id,
      answer: `Opção ${question.options.length + 1}`,
      order: question.options.length + 1,
      openAnswer: false,
    };
    question.options.push(newOption);

    setForm((prev) => (prev ? { ...prev, questions: updatedQuestions } : null));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    if (!form) return;

    const updatedQuestions = [...form.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    updatedQuestions[questionIndex].options.forEach(
      (opt, i) => (opt.order = i + 1)
    );

    setForm((prev) => (prev ? { ...prev, questions: updatedQuestions } : null));
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    newText: string
  ) => {
    if (!form) return;

    const updatedQuestions = [...form.questions];
    updatedQuestions[questionIndex].options[optionIndex].answer = newText;

    setForm((prev) => (prev ? { ...prev, questions: updatedQuestions } : null));
  };

  const saveForm = async () => {
    if (!form) return;

    if (!form.title.trim()) {
      alert("Por favor, informe o título do formulário");
      return;
    }

    if (form.questions.length === 0) {
      alert("Por favor, adicione pelo menos uma pergunta");
      return;
    }

    setIsSaving(true);

    try {
      mockDataService.updateForm(form.id, {
        title: form.title,
        description: form.description,
      });

      const existingQuestions = mockDataService.getQuestionsByForm(form.id);
      existingQuestions.forEach((q) => mockDataService.deleteQuestion(q.id));

      for (const question of form.questions) {
        if (!question.title.trim()) continue;

        const newQuestion = mockDataService.createQuestion({
          formId: form.id,
          title: question.title,
          code:
            question.code || question.title.toLowerCase().replace(/\s+/g, "_"),
          answerGuidance: question.answerGuidance,
          order: question.order,
          required: question.required,
          subQuestion: question.subQuestion,
          questionType: question.questionType,
          conditionalParentId: question.conditionalParentId,
          conditionalValue: question.conditionalValue,
        });

        for (const option of question.options) {
          mockDataService.createOption({
            questionId: newQuestion.id,
            answer: option.answer,
            order: option.order,
            openAnswer: option.openAnswer,
          });
        }
      }

      router.push("/");
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Erro ao salvar formulário. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando formulário...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Formulário não encontrado
          </h1>
          <p className="text-gray-600 mb-4">
            O formulário solicitado não existe ou foi removido.
          </p>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader showPreview previewHref={`/formulario/${form.id}`} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormInfo
          title={form.title}
          description={form.description}
          onTitleChange={(value) => updateFormField("title", value)}
          onDescriptionChange={(value) => updateFormField("description", value)}
        />

        <QuestionList
          questions={form.questions}
          questionTypes={questionTypes}
          onAddQuestion={addQuestion}
          onUpdateQuestion={updateQuestion}
          onRemoveQuestion={removeQuestion}
          onAddOption={addOption}
          onUpdateOption={updateOption}
          onRemoveOption={removeOption}
        />

        <FormActions
          onSave={saveForm}
          isSaving={isSaving}
          saveButtonText="Salvar Alterações"
          showPreview
          previewHref={`/formulario/${form.id}`}
        />
      </main>
    </div>
  );
}
