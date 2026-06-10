import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Internal values are in thousands of dollars ($1 unit = $1,000).
function formatValue(valueInThousands) {
  if (valueInThousands >= 1000) {
    return `$${(valueInThousands / 1000).toFixed(1)}M`;
  }
  if (valueInThousands === 0) {
    return '$0';
  }
  return `$${Math.round(valueInThousands)}k`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0].payload;
  if (!row) return null;

  return (
    <div className="mc-tooltip">
      <div className="mc-tooltip-year">Year {label}</div>
      <div className="mc-tooltip-row">
        <span>Median portfolio</span>
        <strong>{formatValue(row.median)}</strong>
      </div>
      <div className="mc-tooltip-row">
        <span>Typical range (10th–90th)</span>
        <strong>
          {formatValue(row.p10)} – {formatValue(row.p90)}
        </strong>
      </div>
      <div className="mc-tooltip-row">
        <span>Paths fully busted</span>
        <strong>
          {row.bustAtYear} / 100
        </strong>
      </div>
      <p className="mc-tooltip-note">
        Snapshot across all 100 simulations at this year. Grey lines on the chart are a sample of individual paths.
      </p>
    </div>
  );
}

const NUM_PATHS = 100;
const YEARS = 10;

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildReturnShocks(seed) {
  const random = createSeededRandom(seed);
  const shocks = [];
  for (let path = 0; path < NUM_PATHS; path++) {
    const pathShocks = [];
    for (let year = 1; year <= YEARS; year++) {
      let u = 0;
      let v = 0;
      while (u === 0) u = random();
      while (v === 0) v = random();
      pathShocks[year] = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    shocks.push(pathShocks);
  }
  return shocks;
}

export default function PortfolioSimulator() {
  const [totalCapital, setTotalCapital] = useState(1000);
  const [cashBuffer, setCashBuffer] = useState(100);
  const [baseSpending, setBaseSpending] = useState(100);
  const [inflationRate, setInflationRate] = useState(5);
  const [volatility, setVolatility] = useState(40);
  const [expectedReturn, setExpectedReturn] = useState(25);
  const [taxRate, setTaxRate] = useState(15);
  const [simulationSeed, setSimulationSeed] = useState(() => Date.now());

  const returnShocks = useMemo(() => buildReturnShocks(simulationSeed), [simulationSeed]);

  const simulationData = useMemo(() => {
    const numPaths = NUM_PATHS;
    const years = YEARS;
    const paths = [];

    for (let i = 0; i < numPaths; i++) {
      paths.push([{ year: 0, totalValue: totalCapital, assetValue: totalCapital - cashBuffer, cashBalance: cashBuffer }]);
    }

    for (let year = 1; year <= years; year++) {
      const infRateDecimal = inflationRate / 100;
      const taxRateDecimal = taxRate / 100;
      const meanReturn = expectedReturn / 100;
      const stdDev = volatility / 100;

      const currentSpend = baseSpending * Math.pow(1 + infRateDecimal, year - 1);
      const nextSpend = baseSpending * Math.pow(1 + infRateDecimal, year);

      for (let i = 0; i < numPaths; i++) {
        const currentPath = paths[i];
        const previousState = currentPath[year - 1];

        let assetValue = previousState.assetValue;
        let cashBalance = previousState.cashBalance;

        if (assetValue <= 0 && cashBalance <= 0) {
          currentPath.push({ year, totalValue: 0, assetValue: 0, cashBalance: 0 });
          continue;
        }

        const assetReturn = meanReturn + stdDev * returnShocks[i][year];
        assetValue = assetValue * (1 + assetReturn);

        cashBalance = cashBalance - currentSpend;

        if (cashBalance < 0) {
          const shortfall = Math.abs(cashBalance);
          const requiredLiquidation = shortfall + nextSpend;
          const grossAssetToSell = requiredLiquidation / (1 - taxRateDecimal);

          if (assetValue >= grossAssetToSell) {
            assetValue -= grossAssetToSell;
            cashBalance = nextSpend;
          } else {
            const netProceeds = assetValue * (1 - taxRateDecimal);
            cashBalance = Math.max(0, cashBalance + netProceeds);
            assetValue = 0;
          }
        }

        const totalValue = Math.max(0, assetValue + Math.max(0, cashBalance));
        currentPath.push({ year, totalValue, assetValue, cashBalance });
      }
    }

    const displayedPathIndices = [
      ...Array.from({ length: 30 }, (_, i) => i * 3),
      50,
    ];

    const chartData = [];
    for (let year = 0; year <= years; year++) {
      const yearValues = paths.map((p) => p[year].totalValue).sort((a, b) => a - b);
      const row = {
        year,
        median: Math.round(
          numPaths % 2 === 0
            ? (yearValues[numPaths / 2 - 1] + yearValues[numPaths / 2]) / 2
            : yearValues[Math.floor(numPaths / 2)],
        ),
        p10: Math.round(yearValues[Math.floor(numPaths * 0.1)]),
        p90: Math.round(yearValues[Math.floor(numPaths * 0.9)]),
        bustAtYear: yearValues.filter((v) => v === 0).length,
      };
      displayedPathIndices.forEach((index) => {
        row[`path_${index}`] = Math.round(paths[index][year].totalValue);
      });
      chartData.push(row);
    }

    const finalValues = paths.map((p) => p[years].totalValue).sort((a, b) => a - b);
    const successPaths = finalValues.filter((v) => v > 0).length;

    const probabilityOfSuccess = Math.round((successPaths / numPaths) * 100);
    const medianFinalValue =
      numPaths % 2 === 0
        ? (finalValues[numPaths / 2 - 1] + finalValues[numPaths / 2]) / 2
        : finalValues[Math.floor(numPaths / 2)];
    const tenthPercentile = finalValues[Math.floor(numPaths * 0.1)];
    const bustCount = finalValues.filter((v) => v === 0).length;

    const percentile = (values, p) => {
      const sorted = [...values].sort((a, b) => a - b);
      return sorted[Math.min(Math.floor(sorted.length * p), sorted.length - 1)] ?? 0;
    };

    const yearlyP50 = chartData.map((row) =>
      percentile(
        displayedPathIndices.map((index) => row[`path_${index}`]),
        0.5,
      ),
    );
    const yearlyP10 = chartData.map((row) =>
      percentile(
        displayedPathIndices.map((index) => row[`path_${index}`]),
        0.1,
      ),
    );
    const clusterHigh = Math.max(...yearlyP50, totalCapital, medianFinalValue);
    const clusterLow = Math.min(...yearlyP10, totalCapital);
    const span = Math.max(clusterHigh - clusterLow, totalCapital * 0.2, 400);
    const yMin = Math.max(0, clusterLow - span * 0.12);
    const yMax = clusterHigh + span * 0.15;

    return {
      chartData,
      probabilityOfSuccess,
      medianFinalValue,
      tenthPercentile,
      bustCount,
      yMin,
      yMax,
    };
  }, [totalCapital, cashBuffer, baseSpending, inflationRate, volatility, expectedReturn, taxRate, returnShocks]);

  return (
    <div className="mc-simulator">
      <div className="mc-controls">
        <div>
          <label>Total Capital: {formatValue(totalCapital)}</label>
          <input type="range" min="1000" max="10000" step="100" value={totalCapital} onChange={(e) => setTotalCapital(Number(e.target.value))} />
        </div>
        <div>
          <label>Initial Cash Buffer: {formatValue(cashBuffer)}</label>
          <input type="range" min="0" max="2000" step="50" value={cashBuffer} onChange={(e) => setCashBuffer(Number(e.target.value))} />
        </div>
        <div>
          <label>Annual Spending (Base): {formatValue(baseSpending)}</label>
          <input type="range" min="100" max="1500" step="50" value={baseSpending} onChange={(e) => setBaseSpending(Number(e.target.value))} />
        </div>
        <div>
          <label>Inflation Rate: {inflationRate}%</label>
          <input type="range" min="0" max="20" step="1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
        </div>
        <div>
          <label>Asset Volatility: {volatility}%</label>
          <input type="range" min="10" max="100" step="5" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} />
        </div>
        <div>
          <label>Expected Annual Return: {expectedReturn}%</label>
          <input type="range" min="0" max="80" step="5" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
        </div>
        <div>
          <label>Tax Rate: {taxRate}%</label>
          <input type="range" min="0" max="40" step="1" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
        </div>
      </div>

      <div className="mc-sim-actions">
        <button type="button" className="mc-rerun-btn" onClick={() => setSimulationSeed(Date.now())}>
          New random scenarios
        </button>
        <p className="mc-sim-actions-note">
          Sliders reuse the same 100 market scenarios until you click above. Lower spending should raise success rate;
          the old behavior re-rolled randomness on every slider move, which could make results look backwards.
        </p>
      </div>

      <div className="mc-metrics">
        <div>
          <div className="mc-metric-label">Probability of Success</div>
          <div className={`mc-metric-value ${simulationData.probabilityOfSuccess > 80 ? 'mc-good' : 'mc-warn'}`}>
            {simulationData.probabilityOfSuccess}%
          </div>
        </div>
        <div>
          <div className="mc-metric-label">Median Final Value</div>
          <div className="mc-metric-value mc-median">{formatValue(simulationData.medianFinalValue)}</div>
        </div>
        <div>
          <div className="mc-metric-label">10th Percentile (Downside Risk)</div>
          <div className={`mc-metric-value ${simulationData.tenthPercentile > 0 ? 'mc-good' : 'mc-bad'}`}>
            {formatValue(simulationData.tenthPercentile)}
          </div>
        </div>
      </div>

      <div className="mc-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={simulationData.chartData} margin={{ top: 24, right: 24, left: 8, bottom: 36 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="year"
              stroke="#71717a"
              tickMargin={10}
              label={{ value: 'Years', position: 'insideBottom', offset: -24, fill: '#71717a' }}
            />
            <YAxis
              stroke="#71717a"
              width={80}
              tickMargin={8}
              allowDataOverflow
              domain={[simulationData.yMin, simulationData.yMax]}
              tickFormatter={(v) => formatValue(v)}
              label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft', offset: 12, fill: '#71717a' }}
            />
            <Tooltip content={<ChartTooltip />} />
            {Array.from({ length: 30 }).map((_, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={`path_${i * 3}`}
                stroke="#27272a"
                strokeWidth={0.75}
                dot={false}
                activeDot={false}
              />
            ))}
            <Line type="monotone" dataKey="median" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} name="Median Path" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <section className="mc-explainer">
        <h2>How to read the results</h2>

        <div className="mc-explainer-grid">
          <div className="mc-explainer-card">
            <h3>Probability of Success</h3>
            <p>
              Percentage of the 100 simulated paths that still have money at year 10.
              Right now that is <strong>{simulationData.probabilityOfSuccess}%</strong>.
              A path counts as failed when both assets and cash reach zero. The same random return scenarios
              are held fixed while you move sliders — only click &quot;New random scenarios&quot; to reshuffle them.
            </p>
          </div>

          <div className="mc-explainer-card">
            <h3>Median Final Value</h3>
            <p>
              The middle outcome at year 10 after sorting all 100 final portfolio values.
              Half of simulations end above this, half below. Currently{' '}
              <strong>{formatValue(simulationData.medianFinalValue)}</strong>.
              The blue line on the chart tracks this median value at each year, not a single random path.
            </p>
          </div>

          <div className="mc-explainer-card">
            <h3>10th Percentile (Downside Risk)</h3>
            <p>
              The portfolio value at year 10 in a bad-but-not-worst-case scenario. The simulator sorts
              all 100 final values and picks the one at the 10th percentile — roughly the 11th-lowest
              outcome. About 10% of runs finish at this level or lower.
            </p>
            <p>
              <strong>{formatValue(simulationData.tenthPercentile)}</strong> means the bottom decile of
              outcomes looks this bad.{' '}
              {simulationData.tenthPercentile === 0 && simulationData.bustCount > 0
                ? `In this run, ${simulationData.bustCount} of 100 paths went fully bust ($0), so the 10th percentile sits at zero even though more than 10% failed.`
                : 'Higher is better — it means even bad scenarios retain some capital.'}
            </p>
          </div>
        </div>

        <h2>Chart hover tooltip</h2>
        <p className="mc-explainer-hover">
          Hover any year on the chart to see a snapshot for that point in time — not a forecast for a single path.
          <strong> Median portfolio</strong> is the middle outcome across all 100 runs.
          <strong> Typical range (10th–90th)</strong> shows where most paths fall; the bottom end is the bad scenarios, the top is the good ones.
          <strong> Paths fully busted</strong> counts how many simulations have already hit zero by that year.
        </p>

        <h2>What the simulation does each year</h2>
        <ol className="mc-explainer-steps">
          <li>
            <strong>Apply a random return</strong> to invested assets using a normal distribution
            (Box-Muller) with your expected return as the mean and volatility as the standard deviation.
          </li>
          <li>
            <strong>Subtract inflation-adjusted spending</strong> from cash. Year 1 spends the base
            amount; each later year increases spending by your inflation rate.
          </li>
          <li>
            <strong>Liquidate assets if cash runs short.</strong> The model sells enough to cover the
            current shortfall plus next year&apos;s spending, grossed up for taxes:
            gross sale = net cash needed ÷ (1 − tax rate).
          </li>
          <li>
            <strong>Record total value</strong> as assets + cash. If both are depleted, the path stays at
            $0 for remaining years.
          </li>
        </ol>

        <h2>Math notes &amp; caveats</h2>
        <ul className="mc-explainer-caveats">
          <li>Values of $1M+ display as millions with one decimal (e.g. $4.0M); amounts under $1M show in thousands (e.g. $500k).</li>
          <li>Returns are applied before spending each year; cash and assets are tracked separately.</li>
          <li>Taxes are a flat rate on every sale — no cost basis, lot tracking, or carry-forward losses.</li>
          <li>When liquidation succeeds, cash is prefunded for the following year&apos;s spending in one step.</li>
          <li>100 paths is a rough sample — click &quot;New random scenarios&quot; for a fresh draw.</li>
          <li>Extreme outlier paths may clip off the top of the chart; the Y-axis is scaled to the main cluster so typical outcomes stay readable.</li>
        </ul>
      </section>
    </div>
  );
}
