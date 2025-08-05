import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";

import { QuestionType, AnswerOption } from "@/types/form";
import QuestionEditor from "./QuestionEditor";

interface QuestionListProps {
  questions: Array<{
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
  }>;
  questionTypes: QuestionType[];
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, field: string, value: any) => void;
  onRemoveQuestion: (index: number) => void;
  onAddOption: (questionIndex: number) => void;
  onUpdateOption: (
    questionIndex: number,
    optionIndex: number,
    newText: string
  ) => void;
  onRemoveOption: (questionIndex: number, optionIndex: number) => void;
}

const QuestionList = ({
  questions,
  questionTypes,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
}: QuestionListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Perguntas</h2>
        <Button
          onClick={() => {
            onAddQuestion();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Pergunta
        </Button>
      </div>

      {questions.map((question, index) => (
        <QuestionEditor
          key={question.id}
          index={index}
          question={question}
          questionTypes={questionTypes}
          allQuestions={questions}
          onUpdate={(field, value) => onUpdateQuestion(index, field, value)}
          onRemove={() => onRemoveQuestion(index)}
          onAddOption={() => onAddOption(index)}
          onUpdateOption={(optionIndex, newText) =>
            onUpdateOption(index, optionIndex, newText)
          }
          onRemoveOption={(optionIndex) => onRemoveOption(index, optionIndex)}
        />
      ))}

      {questions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-600 mb-4">
              Nenhuma pergunta adicionada ainda
            </p>
            <Button onClick={onAddQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Pergunta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuestionList;
