import { Button } from "../ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";

interface FormHeaderProps {
  backHref?: string;
  showPreview?: boolean;
  previewHref?: string;
  children?: React.ReactNode;
}

const FormHeader = ({
  backHref = "/",
  showPreview = false,
  previewHref,
  children,
}: FormHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5">
          <Link href={backHref}>
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {children}
            {showPreview && previewHref && (
              <Link href={previewHref}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default FormHeader;
