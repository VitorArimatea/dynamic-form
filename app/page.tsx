import Header from "./components/Header";
import FormsList from "./components/FormsList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <FormsList />
    </div>
  );
}
