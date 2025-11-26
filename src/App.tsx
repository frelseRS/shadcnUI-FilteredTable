import { DemoTable } from "./components/demo-table";
import { useClock } from "./hooks/use-clock";

function App() {
  const now = useClock(); // oppure useClock("Europe/Rome")

  const day = now.format("ddd").toUpperCase();   // MON, TUE, ...
  const time = now.format("HH:mm");              // 09:27
  const date = now.format("DD/MM");              // 25/11
  const tz   = now.format("z");                  // CET, CEST, etc.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-sky-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl rounded-2xl border border-cyan-500/35 bg-slate-950/70 shadow-[0_0_60px_rgba(8,47,73,0.9)] backdrop-blur-xl p-5 space-y-4">
        <header className="space-y-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-sky-300">
            <div className="flex items-baseline gap-3">
              <span>STARK INDUSTRIES</span>
              <span className="text-slate-500 tracking-normal">(SIA)</span>
            </div>
            <div className="flex items-baseline gap-4 font-mono tracking-normal">
              <span className="text-lg text-sky-200">130.15</span>
              <span className="text-emerald-400 text-xs">+5.82%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-sky-100">
                Market Monitor Console
              </h1>
            </div>

            <div className="hidden md:flex gap-2 text-[10px] font-mono text-slate-400">
              <span>{day}</span>
              <span>{date}</span>
              <span className="text-slate-600">|</span>
              <span>{time}</span>
              <span className="text-slate-600">|</span>
              <span>{tz}</span>
              <span className="text-slate-600">|</span>
              <span>NASDAQ · LIVE FEED</span>
            </div>
          </div>
        </header>

        <DemoTable />
      </div>
    </div>
  );
}

export default App;