import { USFlag, AUFlag, CursorArrow, ChevronDown } from "../components/Icons";

/** Bar chart: light gray bars + one diagonally-striped dark bar with tooltip. */
function BalanceChart() {
  const bars = [42, 58, 36, 68, 92, 50, 64];
  const highlightIndex = 4;

  return (
    <div className="relative mt-6 flex gap-3">
      {/* y-axis labels */}
      <div className="relative w-8 shrink-0">
        <span className="absolute top-[4%] right-0 text-[10px] font-medium text-neutral-400">
          $40k
        </span>
        <span className="absolute top-[36%] right-0 text-[10px] font-medium text-neutral-400">
          $30k
        </span>
        <span className="absolute bottom-[2%] right-0 text-[10px] font-medium text-neutral-400">
          $20k
        </span>
      </div>

      {/* plot area */}
      <div className="relative h-44 flex-1">
        {/* dashed gridlines */}
        <div className="absolute inset-x-0 top-[8%] border-t border-dashed border-neutral-200" />
        <div className="absolute inset-x-0 top-[40%] border-t border-dashed border-neutral-200" />
        <div className="absolute inset-x-0 bottom-0 border-t border-neutral-200" />

        {/* bars */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-end gap-2.5 pt-6">
          {bars.map((h, i) => {
            const isHighlight = i === highlightIndex;
            return (
              <div
                key={i}
                className="relative flex h-full flex-1 items-end justify-center"
              >
                {isHighlight && (
                  <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
                    <div className="relative rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg">
                      $30,403
                      <span className="absolute -bottom-5 right-1">
                        <CursorArrow className="h-6 w-6 drop-shadow" />
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={`w-full max-w-[34px] rounded-t-md ${
                    isHighlight ? "rounded-b-md" : "rounded-b-[3px]"
                  }`}
                  style={
                    isHighlight
                      ? {
                          height: `${h}%`,
                          backgroundImage:
                            "repeating-linear-gradient(135deg, #17181c 0px, #17181c 5px, #2e2f36 5px, #2e2f36 10px)",
                        }
                      : {
                          height: `${h}%`,
                          backgroundColor: "#eceef1",
                        }
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Small dark "current balance" chip card with US flag. */
function BalanceChip() {
  return (
    <div className="w-[168px] shrink-0 rounded-2xl bg-neutral-900 p-4 text-white shadow-xl">
      <div className="flex items-center gap-2">
        <USFlag className="h-4 w-[22px]" />
        <span className="text-[11px] font-medium text-neutral-400">
          My current balance
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold tracking-tight">$90,4389.40</p>
    </div>
  );
}

/** Floating currency converter card (AUD). */
function ConverterCard() {
  return (
    <div className="w-[272px] rounded-2xl border border-neutral-100 bg-white p-4 shadow-[0_18px_50px_-12px_rgba(23,24,28,0.28)]">
      <p className="text-xs font-medium text-neutral-500">You send exactly</p>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
        <span className="text-sm font-semibold text-neutral-900">1,000</span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
          <AUFlag className="h-4 w-[22px]" />
          AUD
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        </span>
      </div>
      <div className="mt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">– 4.00</span>
          <span className="text-neutral-500">Bank transfer fee</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">= 996.00</span>
          <span className="text-neutral-500">Amount after fee</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-900">× 0.66092</span>
          <span className="text-neutral-500">Exchange rate</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Hero illustration: finance dashboard window mockup —
 * traffic-light chrome, Total Balance + bar chart, dark balance chip,
 * and a floating AUD converter card.
 */
export function HeroDashboard({ className = "" }: { className?: string }) {
  return (
    /* light-gray rounded backdrop panel behind the window */
    <div className={`relative w-full max-w-[560px] ${className}`}>
      <div className="absolute right-0 top-0 h-[86%] w-[88%] rounded-[28px] bg-neutral-100" />

      {/* dashboard window */}
      <div className="relative rounded-[20px] bg-white p-5 pt-6 shadow-[0_24px_70px_-20px_rgba(23,24,28,0.25)] sm:p-6">
        {/* window chrome */}
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        {/* heading row + dark chip floating over the top-right edge */}
        <div className="relative mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Balance</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
              $48,403
            </p>
          </div>
        </div>

        <BalanceChart />
      </div>

      {/* dark current-balance chip, floating outside the window top-right */}
      <div className="absolute -top-3 right-[-10px] z-20 sm:right-[-16px]">
        <BalanceChip />
      </div>

      {/* floating converter card, overlapping bottom-left */}
      <div className="absolute -bottom-20 left-[-18px] z-20 sm:left-[-24px]">
        <ConverterCard />
      </div>
    </div>
  );
}

export default HeroDashboard;
