import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts'

interface SeriesDay {
  date:  string
  value: number
}

interface Props {
  portfolioSeries: SeriesDay[]
  benchmarkSeries: SeriesDay[]
}

export function PortfolioChart({ portfolioSeries, benchmarkSeries }: Props) {

  // Merge both series into one array by date
  const combined = portfolioSeries.map((day, i) => ({
    date:      day.date,
    strategy:  day.value,
    benchmark: benchmarkSeries[i]?.value ?? null
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combined} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          dy={15}
          // Only show one label per year to avoid crowding
          tickFormatter={(date) => date.slice(0, 4)}
        />

        <YAxis
          // Format as dollars
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          dx={-10}
        />

        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            return (
              <div className="bg-white border border-gray-100 shadow-[var(--shadow-md)] rounded-xl p-3">
                <p className="text-[#a8a8a8] text-xs font-semibold mb-2 uppercase tracking-wider">{label}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-6">
                    <span className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e1294b]" />
                      <span className="text-gray-700 text-[13px]">Your Strategy</span>
                    </span>
                    <span className="font-mono text-[#e1294b] font-semibold text-[13px]">${payload[0].value.toLocaleString()}</span>
                  </div>
                  {payload[1] && (
                    <div className="flex items-center justify-between gap-6">
                      <span className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0d9e6e]" />
                        <span className="text-gray-700 text-[13px]">S&P 500</span>
                      </span>
                      <span className="font-mono text-[#0d9e6e] font-semibold text-[13px]">${payload[1].value.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        />

        <Legend 
          iconType="circle"
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={(value) => <span className="text-gray-600 text-sm font-medium">{value === 'Your strategy' ? 'Your strategy' : 'S&P 500 index'}</span>}
        />

        {/* Your strategy line — loss red */}
        <Line
          type="monotone"
          dataKey="strategy"
          stroke="#e1294b"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: '#e1294b', stroke: '#fff', strokeWidth: 2 }}
          name="Your strategy"
        />

        {/* S&P 500 benchmark line — profit green */}
        <Line
          type="monotone"
          dataKey="benchmark"
          stroke="#0d9e6e"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: '#0d9e6e', stroke: '#fff', strokeWidth: 1 }}
          name="S&P 500 index"
        />

      </LineChart>
    </ResponsiveContainer>
  )
}
