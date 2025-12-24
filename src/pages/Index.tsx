/**
 * Main dashboard page
 * Displays the crypto sidebar with market overview panel
 */

import { Sidebar } from "@/components/Sidebar";
import { CryptoPlayer } from "@/components/CryptoPlayer";
import { Activity, BarChart3, Layers } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Main sidebar with coin list */}
      <aside className="w-full max-w-md lg:w-[420px] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content area - market overview */}
      <main className="flex-1 bg-background bg-grid-pattern relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8">
          {/* Hero section */}
          <div className="text-center max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              <span>Real-time Market Data</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-foreground">Crypto</span>{" "}
              <span className="text-gradient-primary">Dashboard</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl mb-8 leading-relaxed">
              Track top performing USDT pairs with live WebSocket updates.
              Monitor price changes, volume, and market trends in real-time.
            </p>

            {/* Crypto Navigation Player */}
            <div className="w-full max-w-2xl mx-auto mb-8">
              <CryptoPlayer />
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg bg-gain/10 flex items-center justify-center mb-4 mx-auto">
                  <BarChart3 className="w-6 h-6 text-gain" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Top Gainers
                </h3>
                <p className="text-sm text-muted-foreground">
                  Sorted by 24h price change to find the best performers
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Live Updates
                </h3>
                <p className="text-sm text-muted-foreground">
                  WebSocket stream for instant price updates
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                  <Layers className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  USDT Pairs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Focus on stable-quoted pairs for accurate comparison
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 text-center">
            <p className="text-xs text-muted-foreground">
              Data provided by Binance API • Prices update in real-time
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
