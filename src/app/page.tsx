import CalculatorCard from "@/components/CalculatorCard";
import SplineBackground from "@/components/SplineBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Layer 0: 3D Spline background */}
      <SplineBackground
        sceneUrl="https://prod.spline.design/In7bW46qvoRcvz1K/scene.splinecode"
        fallbackColor="#072333"
      />

      {/* Layer 1: Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-sadapay-navy/70 backdrop-blur-sm text-white py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold tracking-tight">
                Banking Calculator
              </h1>
            </div>
            <a
              href="https://github.com/aarizmehdi/sadapay-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 flex items-center justify-center hover:bg-white/10 transition-colors rounded"
              title="View source on GitHub"
              aria-label="GitHub repository"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
          <CalculatorCard />
        </main>

        {/* Footer */}
        <footer className="bg-sadapay-navy/70 backdrop-blur-sm text-white/40 py-4 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
            <p className="text-[10px] tracking-wider">
              Open source by{" "}
              <a
                href="https://github.com/aarizmehdi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
              >
                aarizmehdi
              </a>
              <span className="mx-2">·</span>
              Not affiliated with SadaPay
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
