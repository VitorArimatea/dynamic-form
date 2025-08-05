"use client";

import { mockDataService } from "@/lib/mock-data";
import { useFormManager } from "@/hooks/useFormManager";
import FormHeader from "@/app/components/forms/FormHeader";
import FormInfo from "@/app/components/forms/FormInfo";
import QuestionList from "@/app/components/forms/QuestionList";
import FormActions from "@/app/components/forms/FormActions";

export default function CreateForm() {
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
    mode: "create",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FormHeader />
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
          saveButtonText="Criar Formulário"
        />
      </main>
    </div>
  );
}
