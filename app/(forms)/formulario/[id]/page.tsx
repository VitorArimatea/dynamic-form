"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { mockDataService } from "@/lib/mock-data";
import { CompleteForm, Question } from "@/types/form";
import { ConditionalLogic } from "@/lib/actions/conditional-logic";
import { submitFormAnswers } from "@/lib/actions/actions";
import { getFormById } from "@/lib/form-sync";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { QuestionRenderer } from "@/app/components/forms/QuestionRenderer";

export default function FormPage() {
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState<CompleteForm | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[]) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }));
    },
    []
  );

  const shouldShowQuestion = useCallback(
    (question: Question): boolean => {
      if (!form) return true;
      return ConditionalLogic.shouldShowQuestion(question, form, answers);
    },
    [form, answers]
  );

  const validateForm = useCallback((): boolean => {
    if (!form) return false;

    for (const question of form.questions) {
      if (!shouldShowQuestion(question)) continue;

      if (question.required) {
        const answer = answers[question.id];
        if (
          !answer ||
          (Array.isArray(answer) && answer.length === 0) ||
          answer === ""
        ) {
          alert(
            `Por favor, responda a pergunta obrigatória: ${question.title}`
          );
          return false;
        }
      }
    }
    return true;
  }, [form, answers, shouldShowQuestion]);

  const submitAnswers = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await submitFormAnswers(id, answers);
      setIsSubmitted(true);
    } catch (error) {
      alert("Erro ao enviar respostas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [id, answers, validateForm]);

  useEffect(() => {
    let foundForm: CompleteForm | null | undefined = getFormById(id);

    if (!foundForm) {
      foundForm = mockDataService.getCompleteForm(id);
    }

    setForm(foundForm || null);
    setIsLoading(false);
  }, [id]);

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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-6">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Respostas enviadas com sucesso!
              </h2>
              <p className="text-gray-600 mb-6">
                Obrigado por preencher o formulário "{form.title}".
              </p>
              <Link href="/">
                <Button>Voltar para Home</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              {form.description && (
                <p className="text-gray-600">{form.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitAnswers();
          }}
        >
          <div className="space-y-6">
            {form.questions.map((question) => {
              if (!shouldShowQuestion(question)) return null;

              return (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <QuestionRenderer
                      id={question.id}
                      title={question.title}
                      answerGuidance={question.answerGuidance}
                      questionType={question.questionType}
                      required={question.required}
                      options={question.options}
                      value={answers[question.id]}
                      onChange={(value) =>
                        handleAnswerChange(question.id, value)
                      }
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end mt-8 pt-8 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Enviando..." : "Enviar Respostas"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
