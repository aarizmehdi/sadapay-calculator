import CalculatorCard from "@/components/CalculatorCard";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Navy header bar */}
      <header className="bg-sadapay-navy text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-white/20 flex items-center justify-center">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-none text-white">
                SadaPay
              </h1>
              <p className="text-[10px] text-white/60 tracking-widest uppercase mt-0.5">
                Banking Calculator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
        <CalculatorCard />
      </main>

      {/* Footer */}
      <footer className="bg-sadapay-navy text-white/40 py-4 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-wider uppercase">
            Not affiliated with SadaPay. For illustrative purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
