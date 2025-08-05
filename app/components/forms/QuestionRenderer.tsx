"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { QuestionType, AnswerOption } from "@/types/form";

interface QuestionRendererProps {
  id: string;
  title: string;
  answerGuidance: string;
  questionType: QuestionType;
  required: boolean;
  options: AnswerOption[];
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export const QuestionRenderer = ({
  id,
  title,
  answerGuidance,
  questionType,
  required,
  options,
  value,
  onChange,
}: QuestionRendererProps) => {
  const handleInputChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleCheckboxChange = (optionText: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, optionText];
    } else {
      newValues = currentValues.filter((v) => v !== optionText);
    }
    onChange(newValues);
  };

  const handleRadioChange = (optionText: string) => {
    onChange(optionText);
  };

  const renderQuestionContent = () => {
    switch (questionType) {
      case "free_text":
        return (
          <textarea
            id={id}
            value={(value as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={answerGuidance || "Digite sua resposta..."}
            className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            required={required}
          />
        );

      case "integer":
        return (
          <Input
            type="number"
            id={id}
            value={(value as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={answerGuidance || "Digite um número inteiro"}
            required={required}
          />
        );

      case "decimal_two_places":
        return (
          <Input
            type="number"
            step="0.01"
            id={id}
            value={(value as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={answerGuidance || "Digite um número decimal"}
            required={required}
          />
        );

      case "yes_no":
        return (
          <div className="space-y-2">
            {["Sim", "Não"].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleRadioChange(option)}
                  required={required}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "single_choice":
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={id}
                  value={option.answer}
                  checked={value === option.answer}
                  onChange={() => handleRadioChange(option.answer)}
                  required={required}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.answer}</span>
              </label>
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {options.map((option) => {
              const currentValues = Array.isArray(value) ? value : [];
              const isChecked = currentValues.includes(option.answer);

              return (
                <label
                  key={option.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(option.answer, e.target.checked)
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option.answer}</span>
                </label>
              );
            })}
          </div>
        );

      default:
        return (
          <Input
            id={id}
            value={(value as string) || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={answerGuidance || "Digite sua resposta"}
            required={required}
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-medium">
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {answerGuidance && (
        <p className="text-sm text-gray-600">{answerGuidance}</p>
      )}

      {renderQuestionContent()}
    </div>
  );
};
