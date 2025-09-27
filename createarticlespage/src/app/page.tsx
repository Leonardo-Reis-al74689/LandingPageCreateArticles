"use client"

import { SectionCards } from "@/components/cardsActions"
import { useNavigation } from "@/contexts/NavigationContext"
import { Construction } from "lucide-react"

function CreateArticlesContent() {
  return (
    <div className="@container/main px-3 md:px-6 pb-6">
      <header className="mb-6">
        <h1 className="text text-gray-600 dark:text-white">
          Criação, Registo e Verificação de Códigos de Artigos / Articles Codes Creation, Verification and Registration
        </h1>
      </header>
      <SectionCards />
    </div>
  );
}

function DefaultContent({ title }: { title: string }) {
  return (
    <div className="@container/main px-3 md:px-6 pb-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 flex flex-col items-center">
          <div className="text-8xl text-gray-300 flex justify-center items-center"><Construction size={64} /></div>
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Esta secção está em desenvolvimento. Por favor, selecione &ldquo;Create Articles&rdquo; para aceder à funcionalidade disponível.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { activeItem } = useNavigation();

  const renderContent = () => {
    switch (activeItem) {
      case "create-articles":
        return <CreateArticlesContent />;
      case "backlog":
        return <DefaultContent title="Backlog" />;
      case "roadmap":
        return <DefaultContent title="Roadmap" />;
      case "reports":
        return <DefaultContent title="Reports" />;
      case "releases":
        return <DefaultContent title="Releases" />;
      case "teams":
        return <DefaultContent title="Teams" />;
      case "settings":
        return <DefaultContent title="Project Settings" />;
      default:
        return <CreateArticlesContent />;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 lg:p-2">
        {renderContent()}
      </div>
    </div>
  );
}
