"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { mockDataService } from "@/lib/mock-data";
import { CompleteForm } from "@/types/form";
import { useFormManager } from "@/hooks/useFormManager";
import { getFormById } from "@/lib/form-sync";

import FormHeader from "@/app/components/forms/FormHeader";
import FormInfo from "@/app/components/forms/FormInfo";
import QuestionList from "@/app/components/forms/QuestionList";
import FormActions from "@/app/components/forms/FormActions";
import { Button } from "@/app/components/ui/button";

function FormEditor({ initialForm }: { initialForm: CompleteForm }) {
  const questionTypes = mockDataService.getQuestionTypes();

  const {
    title,
    description,
    questions,
    isSaving,
    errors,
    setTitle,
    setDescription,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
    saveForm,
  } = useFormManager({
    initialTitle: initialForm.title,
    initialDescription: initialForm.description,
    initialQuestions: initialForm.questions,
    formId: initialForm.id,
    mode: "edit",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader showPreview previewHref={`/formulario/${initialForm.id}`} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">
              Erros encontrados:
            </h3>
            <ul className="text-red-700 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

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
          saveButtonText="Salvar Alterações"
          showPreview
          previewHref={`/formulario/${initialForm.id}`}
        />
      </main>
    </div>
  );
}

interface Props {
  params: { id: string };
}

export default function EditFormPage({ params }: Props) {
  const { id } = params;
  const [initialForm, setInitialForm] = useState<CompleteForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let foundForm = getFormById(id);

    if (!foundForm) {
      foundForm = mockDataService.getCompleteForm(id);
    }

    if (foundForm) {
      setInitialForm(foundForm);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando formulário...</p>
      </div>
    );
  }

  if (!initialForm) {
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

  return <FormEditor initialForm={initialForm} />;
}
