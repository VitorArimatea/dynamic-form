"use client";

import { Button } from "../ui/button";
import Link from "next/link";

interface FormActionsProps {
  onSave: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
  saveButtonText?: string;
  cancelHref?: string;
  showPreview?: boolean;
  previewHref?: string;
}

const FormActions = ({
  onSave,
  onPreview,
  isSaving = false,
  saveButtonText = "Salvar",
  cancelHref = "/",
  showPreview = false,
  previewHref,
}: FormActionsProps) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-8 border-t">
      <div className="flex gap-2">
        {showPreview && previewHref && (
          <Link href={previewHref}>
            <Button variant="outline">Visualizar</Button>
          </Link>
        )}
      </div>

      <div className="flex gap-4">
        <Link href={cancelHref}>
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button
          onClick={() => {
            onSave();
          }}
          disabled={isSaving}
        >
          {isSaving ? "Salvando..." : saveButtonText}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
