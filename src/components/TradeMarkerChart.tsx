import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts'

interface SeriesDay {
  date:  string
  value: number
}

interface Trade {
  date:   string
  action: 'BUY' | 'SELL'
  price:  number
}

interface Props {
  portfolioSeries: SeriesDay[]
  tradeLog:        Trade[]
}

export function TradeMarkerChart({ portfolioSeries, tradeLog }: Props) {

  // Build a map of trade dates for quick lookup
  const tradeMap: Record<string, Trade> = {}
  for (const trade of tradeLog) {
    tradeMap[trade.date] = trade
  }

  // Add trade info to each day so Recharts can render markers
  const data = portfolioSeries.map(day => ({
    date:   day.date,
    value:  day.value,
    trade:  tradeMap[day.date] ?? null,
    // Only set a marker value on trade days — null days get no dot
    marker: tradeMap[day.date] ? day.value : null
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />

        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          dy={15}
          tickFormatter={(date) => date.slice(0, 4)}
        />

        <YAxis
          tickFormatter={(value) => `$${value.toLocaleString()}`}
          tick={{ fontSize: 11, fill: '#a8a8a8', fontFamily: 'Inter' }}
          axisLine={false}
          tickLine={false}
          dx={-10}
        />

        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload
            return (
              <div className="bg-white border border-gray-100 shadow-[var(--shadow-md)] rounded-xl p-3 min-w-[200px]">
                <p className="text-[#a8a8a8] text-xs font-semibold mb-2 uppercase tracking-wider">{d.date}</p>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#e1294b]" />
                    <span className="text-gray-700 text-[13px]">Portfolio Val</span>
                  </span>
                  <span className="font-mono text-gray-900 font-semibold text-[13px]">${d.value.toLocaleString()}</span>
                </div>
                {d.trade && (
                  <div className={`mt-2 inline-flex items-center justify-center w-full px-3 py-2 rounded-lg text-[11px] font-bold tracking-wide ${d.trade.action === 'BUY' ? 'bg-[#d1fae5] text-[#0d9e6e] border border-green-100' : 'bg-[#ffe4e8] text-[#e1294b] border border-red-100'}`}>
                    {d.trade.action} SIGNAL AT ${d.trade.price.toFixed(2)}
                  </div>
                )}
              </div>
            )
          }}
        />

        {/* Portfolio line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#e1294b"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          name="Portfolio"
        />

        {/* Trade markers — colored dots on buy/sell days */}
        <Scatter dataKey="marker" name="Trades">
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.trade?.action === 'BUY'  ? '#0d9e6e' :   // profit green for buy
                entry.trade?.action === 'SELL' ? '#e1294b' :   // loss red for sell
                'transparent'
              }
            />
          ))}
        </Scatter>

      </ComposedChart>
    </ResponsiveContainer>
  )
}
