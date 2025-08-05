import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface FormInfoProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const FormInfo = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: FormInfoProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>
          Configure as informações principais do formulário
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="titulo">Título do Formulário *</Label>
          <Input
            id="titulo"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Ex: Pesquisa de Satisfação"
          />
        </div>
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            id="descricao"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Breve descrição do formulário"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FormInfo;
