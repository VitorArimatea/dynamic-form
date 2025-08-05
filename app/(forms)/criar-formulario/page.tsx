"use client";

import { mockDataService } from "@/lib/mock-data";
import { QuestionType, AnswerOption } from "@/types/form";

import { useState } from "react";
import { useRouter } from "next/navigation";

import FormHeader from "@/app/components/forms/FormHeader";
import FormInfo from "@/app/components/forms/FormInfo";
import QuestionList from "@/app/components/forms/QuestionList";
import FormActions from "@/app/components/forms/FormActions";

interface TempQuestion {
  id: string;
  title: string;
  code: string;
  answerGuidance: string;
  order: number;
  required: boolean;
  subQuestion: boolean;
  questionType: QuestionType;
  options: AnswerOption[];
  conditionalParentId?: string;
  conditionalValue?: string;
}

export default function CreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<TempQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const questionTypes = mockDataService.getQuestionTypes();

  const addQuestion = () => {
    const newQuestion: TempQuestion = {
      id: `temp-${Date.now()}`,
      title: "",
      code: "",
      answerGuidance: "",
      order: questions.length + 1,
      required: false,
      subQuestion: false,
      questionType: "free_text" as QuestionType,
      options: [],
      conditionalParentId: undefined,
      conditionalValue: undefined,
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

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

    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);

    updatedQuestions.forEach((q, i) => (q.order = i + 1));
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    const newOption = {
      id: `opt-${Date.now()}`,
      questionId: question.id,
      answer: `Opção ${question.options.length + 1}`,
      order: question.options.length + 1,
      openAnswer: false,
    };
    question.options.push(newOption);
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);

    updatedQuestions[questionIndex].options.forEach(
      (opt, i) => (opt.order = i + 1)
    );
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    newText: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].answer = newText;
    setQuestions(updatedQuestions);
  };

  const saveForm = async () => {
    if (!title.trim()) {
      alert("Por favor, informe o título do formulário");
      return;
    }

    if (questions.length === 0) {
      alert("Por favor, adicione pelo menos uma pergunta");
      return;
    }

    setIsSaving(true);

    try {
      const newForm = mockDataService.createForm({
        title: title.trim(),
        description: description.trim(),
        order: 1,
      });

      for (const question of questions) {
        if (!question.title.trim()) continue;

        const newQuestion = mockDataService.createQuestion({
          formId: newForm.id,
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
      alert("Erro ao salvar formulário. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FormInfo
          title={title}
          description={description}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
        />

        <QuestionList
          questions={questions}
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
          saveButtonText="Criar Formulário"
        />
      </main>
    </div>
  );
}
