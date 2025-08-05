import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start sm:justify-between items-center py-5">
          <div>
            <h1 className="hidden sm:block text-3xl font-bold text-gray-900">
              Formulários Dinâmicos
            </h1>
          </div>
          <Link href="/criar-formulario">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Formulário
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
