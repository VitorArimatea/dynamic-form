import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QuestionType, AnswerOption } from "@/types/form";
import { UI_MESSAGES } from "@/lib/constants";
import { updateForm } from "@/lib/actions/actions";
import { saveFormToStorage } from "@/lib/form-sync";

export interface FormQuestion {
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

interface UseFormManagerProps {
  initialTitle?: string;
  initialDescription?: string;
  initialQuestions?: FormQuestion[];
  formId?: string;
  mode: "create" | "edit";
}

export function useFormManager({
  initialTitle = "",
  initialDescription = "",
  initialQuestions = [],
  formId,
  mode,
}: UseFormManagerProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [questions, setQuestions] = useState<FormQuestion[]>(initialQuestions);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addQuestion = useCallback(() => {
    const newQuestion: FormQuestion = {
      id: `temp-${Date.now()}`,
      title: "",
      code: "",
      answerGuidance: "",
      order: questions.length + 1,
      required: false,
      subQuestion: false,
      questionType: "free_text",
      options: [],
      conditionalParentId: undefined,
      conditionalValue: undefined,
    };
    setQuestions((prev) => [...prev, newQuestion]);
  }, [questions.length]);

  const updateQuestion = useCallback(
    (index: number, field: string, value: any) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [field]: value };

        if (
          field === "questionType" &&
          (value === "single_choice" || value === "multiple_choice")
        ) {
          if (updated[index].options.length === 0) {
            updated[index].options = [
              {
                id: `opt-1-${Date.now()}`,
                questionId: updated[index].id,
                answer: "Opção 1",
                order: 1,
                openAnswer: false,
              },
              {
                id: `opt-2-${Date.now()}`,
                questionId: updated[index].id,
                answer: "Opção 2",
                order: 2,
                openAnswer: false,
              },
            ];
          }
        }

        if (field === "subQuestion" && !value) {
          updated[index].conditionalParentId = undefined;
          updated[index].conditionalValue = undefined;
        }

        return updated;
      });
    },
    []
  );

  const removeQuestion = useCallback((index: number) => {
    setQuestions((prev) =>
      prev.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 }))
    );
  }, []);

  const addOption = useCallback((questionIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      const question = updated[questionIndex];
      const newOption = {
        id: `opt-${Date.now()}`,
        questionId: question.id,
        answer: `Opção ${question.options.length + 1}`,
        order: question.options.length + 1,
        openAnswer: false,
      };
      updated[questionIndex] = {
        ...question,
        options: [...question.options, newOption],
      };
      return updated;
    });
  }, []);

  const updateOption = useCallback(
    (questionIndex: number, optionIndex: number, newText: string) => {
      setQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex].options[optionIndex].answer = newText;
        return updated;
      });
    },
    []
  );

  const removeOption = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setQuestions((prev) => {
        const updated = [...prev];
        const questionOptions = updated[questionIndex].options;
        questionOptions.splice(optionIndex, 1);
        questionOptions.forEach((opt, i) => (opt.order = i + 1));
        return updated;
      });
    },
    []
  );

  const saveForm = useCallback(async () => {
    if (!title.trim()) {
      setErrors(["Título é obrigatório"]);
      return;
    }
    if (questions.filter((q) => q.title.trim()).length === 0) {
      setErrors(["Pelo menos uma pergunta é obrigatória"]);
      return;
    }

    setIsSaving(true);
    setErrors([]);

    try {
      const validQuestions = questions.filter((q) => q.title.trim());

      const formData = {
        title: title.trim(),
        description: description.trim(),
        questions: validQuestions.map((q) => ({
          ...q,
          code: q.code || q.title.toLowerCase().replace(/\s+/g, "_"),
          options: q.options || [],
        })),
      };

      if (mode === "create") {
        const newFormId = saveFormToStorage(formData);
        if (newFormId) {
          router.push("/");
        } else {
          setErrors(["Erro ao salvar formulário"]);
        }
      } else if (mode === "edit" && formId) {
        await updateForm(formId, formData);
        saveFormToStorage(formData, formId);
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors([UI_MESSAGES.ERROR_SAVING]);
      }
    } finally {
      setIsSaving(false);
    }
  }, [title, description, questions, mode, formId, router]);

  return {
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
  };
}
