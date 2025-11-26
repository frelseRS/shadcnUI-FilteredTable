import { DemoTable } from "./components/demo-table";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-xl border bg-card shadow-sm p-4 space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              Demo tabella con filtri stile Excel
            </h1>
            <p className="text-sm text-muted-foreground">
              Ogni colonna ha il proprio filtro con ricerca, multi-select e sort.
            </p>
          </div>
        </header>

        <DemoTable />
      </div>
    </div>
  );
}

export default App;