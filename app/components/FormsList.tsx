"use client";

import { useState, useEffect } from "react";
import { mockDataService } from "@/lib/mock-data";
import { Form } from "@/types/form";
import { getAllForms } from "@/lib/form-sync";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

import { Eye, FileText, Plus } from "lucide-react";
import Link from "next/link";

const FormsList = () => {
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    const loadForms = () => {
      // Carrega formulários do mock (inicial) e do novo sistema
      const mockForms = mockDataService.getForms();
      const syncedForms = getAllForms();

      // Combina ambos evitando duplicatas
      const allForms = [...mockForms];
      syncedForms.forEach((syncForm) => {
        if (!allForms.find((f) => f.id === syncForm.id)) {
          allForms.push(syncForm);
        }
      });

      console.log("📋 Total forms loaded:", allForms.length);
      console.log(
        "Forms:",
        allForms.map((f) => f.title)
      );
      setForms(allForms);
    };

    loadForms();

    // Recarrega a cada 1 segundo
    const interval = setInterval(loadForms, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Meus Formulários
        </h2>
        <p className="text-gray-600">
          Gerencie e visualize seus formulários criados
        </p>
      </div>

      {forms.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-800 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum formulário criado ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando seu primeiro formulário
            </p>
            <Link href="/criar-formulario">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Formulário
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card
              key={form.id}
              className="hover:shadow-md transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-between">
                  <div className="text-sm text-gray-500 flex items-center">
                    Criado em {form.createdAt.toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/editar-formulario/${form.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    <Link href={`/formulario/${form.id}`}>
                      <Button size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
};

export default FormsList;
