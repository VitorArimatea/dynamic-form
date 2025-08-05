"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Trash2, Plus } from "lucide-react";
import { QuestionType, AnswerOption } from "@/types/form";

const questionTypeLabels: Record<QuestionType, string> = {
  yes_no: "Sim/Não",
  multiple_choice: "Múltipla Escolha",
  single_choice: "Escolha Única",
  free_text: "Texto Livre",
  integer: "Número Inteiro",
  decimal_two_places: "Número Decimal (2 casas)",
};

interface QuestionEditorProps {
  question: {
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
  };
  index: number;
  questionTypes: QuestionType[];
  allQuestions: any[];
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, newText: string) => void;
  onRemoveOption: (optionIndex: number) => void;
}

const QuestionEditor = ({
  question,
  index,
  questionTypes,
  allQuestions,
  onUpdate,
  onRemove,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: QuestionEditorProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Pergunta {index + 1}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Título da Pergunta *</Label>
            <Input
              value={question.title}
              onChange={(e) => onUpdate("title", e.target.value)}
              placeholder="Ex: Como você avalia nosso serviço?"
            />
          </div>
          <div>
            <Label>Tipo de Pergunta</Label>
            <Select
              value={question.questionType}
              onValueChange={(value) =>
                onUpdate("questionType", value as QuestionType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {questionTypeLabels[type] || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Orientação de Resposta / Dica</Label>
          <Input
            value={question.answerGuidance}
            onChange={(e) => onUpdate("answerGuidance", e.target.value)}
            placeholder="Ex: Selecione a opção que melhor representa sua experiência"
          />
        </div>

        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onUpdate("required", e.target.checked)}
            />
            <span className="text-sm">Obrigatória</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={question.subQuestion}
              onChange={(e) => onUpdate("subQuestion", e.target.checked)}
            />
            <span className="text-sm">Subpergunta (condicional)</span>
          </label>
        </div>

        {question.subQuestion && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 space-y-3">
            <Label className="text-blue-800 font-medium">
              Configuração Condicional
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Pergunta que Controla</Label>
                <Select
                  value={question.conditionalParentId || ""}
                  onValueChange={(value) =>
                    onUpdate("conditionalParentId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pergunta" />
                  </SelectTrigger>
                  <SelectContent>
                    {allQuestions
                      .filter((q, i) => i < index && !q.subQuestion)
                      .map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title || `Pergunta ${allQuestions.indexOf(q) + 1}`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Resposta que Ativa</Label>
                <Input
                  value={question.conditionalValue || ""}
                  onChange={(e) => onUpdate("conditionalValue", e.target.value)}
                  placeholder="Ex: Sim, Não, Excelente..."
                />
              </div>
            </div>
            <p className="text-xs text-blue-600">
              Esta pergunta aparecerá apenas quando o usuário responder com o
              valor especificado
            </p>
            <div className="bg-blue-100 border border-blue-300 rounded p-3 text-xs text-blue-800">
              <strong>Exemplo:</strong> Se a pergunta for "Gostou do serviço?" e
              você definir "Sim" como resposta que ativa, esta pergunta só
              aparecerá quando o usuário responder "Sim"
            </div>
          </div>
        )}

        {/* Options for single and multiple choice */}
        {(question.questionType === "single_choice" ||
          question.questionType === "multiple_choice") && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <Label>Opções de Resposta</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddOption}
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Opção
              </Button>
            </div>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.answer}
                    onChange={(e) =>
                      onUpdateOption(optionIndex, e.target.value)
                    }
                    placeholder={`Texto da Opção ${optionIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveOption(optionIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
