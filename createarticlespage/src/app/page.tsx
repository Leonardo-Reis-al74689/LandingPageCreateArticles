import { SectionCards } from "@/components/cardsActions"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 lg:p-2">
        <div className="@container/main px-3 md:px-6 pb-6">
          <header className="mb-6">
            <h1 className="text text-gray-600 dark:text-white">
              Criação, Registo e Verificação de Códigos de Artigos / Articles Codes Creation, Verification and Registration
            </h1>
          </header>
          <SectionCards />
          <div className="flex justify-end mt-4">
            <Button>Gravar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
