import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface Metrics {
  totalReturn:  number
  maxDrawdown:  number
  sharpeRatio:  number
  totalTrades:  number
}

interface Props {
  portfolioMetrics: Metrics
  benchmarkMetrics: Metrics
}

export function MetricsComparisonChart({ portfolioMetrics, benchmarkMetrics }: Props) {

  // Structure the data so each metric is one group of two bars
  const data = [
    {
      name:      'Return %',
      strategy:  portfolioMetrics.totalReturn,
      benchmark: benchmarkMetrics.totalReturn
    },
    {
      name:      'Drawdown %',
      strategy:  portfolioMetrics.maxDrawdown,
      benchmark: benchmarkMetrics.maxDrawdown
    },
    {
      name:      'Sharpe',
      strategy:  portfolioMetrics.sharpeRatio,
      benchmark: benchmarkMetrics.sharpeRatio
    }
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} barCategoryGap="25%">

        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} dy={10} />
        <YAxis tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }} axisLine={false} tickLine={false} dx={-10} />

        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.02)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="bg-white border border-gray-100 shadow-[var(--shadow-md)] rounded-xl p-3">
                <p className="text-[#a8a8a8] text-xs font-semibold mb-2 uppercase tracking-wider">{payload[0].payload.name}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e1294b]" />
                      <span className="text-gray-700 text-[13px]">Your Strategy</span>
                    </span>
                    <span className="font-mono text-[#e1294b] font-semibold text-[13px]">{payload[0].value.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0d9e6e]" />
                      <span className="text-gray-700 text-[13px]">S&P 500</span>
                    </span>
                    <span className="font-mono text-[#0d9e6e] font-semibold text-[13px]">{(payload[1]?.value || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )
          }}
        />

        <Legend
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => <span className="text-gray-600 text-sm font-medium">{value === 'strategy' ? 'Your strategy' : 'S&P 500'}</span>}
        />

        {/* Your strategy bars — loss red */}
        <Bar dataKey="strategy" fill="#e1294b" radius={[6, 6, 0, 0]} />

        {/* S&P 500 bars — profit green */}
        <Bar dataKey="benchmark" fill="#0d9e6e" radius={[6, 6, 0, 0]} />

      </BarChart>
    </ResponsiveContainer>
  )
}
