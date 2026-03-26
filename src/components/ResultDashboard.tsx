// 🎬 ROOKNOMICS CINEMATIC UI: ResultsDashboard — Bloomberg terminal dark redesign
// ZERO LOGIC CHANGES — all formatters, computations, props preserved exactly
import { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, Clock3, List, Trophy,
} from 'lucide-react'
import {
  PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer,
} from 'recharts'
import { PortfolioChart } from './PortfolioChart'
import { TradeMarkerChart } from './TradeMarkerChart'
import { MetricsComparisonChart } from './MetricsComparisonChart'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, scaleUp } from '@/lib/animations'

export interface SeriesDay {
  date: string
  value: number
}

export interface TradeRow {
  date: string
  action: 'BUY' | 'SELL'
  price: number
  shares?: number | null
  pnl?: number | null
  returnPct?: number | null
  cumulative?: number | null
}

export interface DashboardMetrics {
  totalReturn: number
  annualizedReturn: number
  maxDrawdown: number
  winRate: number | null
  sharpeRatio: number
  avgTradeDurationDays: number | null
  totalTrades: number
  tradingFees: number
}

export interface RiskStats {
  beta: number
  alpha: number
  var5: number
  radarData: Array<{
    metric: string
    strategy: number
    benchmark: number
  }>
}

interface ResultsDashboardProps {
  portfolioSeries: SeriesDay[]
  benchmarkSeries: SeriesDay[]
  tradeLog: TradeRow[]
  portfolioMetrics: DashboardMetrics
  benchmarkMetrics: DashboardMetrics
  riskStats: RiskStats
  loading?: boolean
  error?: string | null
  hasBacktestData: boolean
  parsedDataAvailable?: boolean
  rawDataPreview?: string | null
}

// 🎬 All formatters identical — zero logic change
function formatSignedPercent(value: number, digits = 1) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(digits)}%`
}

function formatPercent(value: number | null, digits = 1) {
  if (value === null || Number.isNaN(value)) return 'N/A'
  return `${value.toFixed(digits)}%`
}

function formatCurrency(value: number | null, digits = 0) {
  if (value === null || Number.isNaN(value)) return '-'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

function metricColor(value: number, positiveIsGood = true) {
  if (value === 0) return 'rgba(255,255,255,0.60)'
  if (positiveIsGood) {
    return value > 0 ? '#10B981' : '#F43F5E'
  }
  return value < 0 ? '#F43F5E' : '#10B981'
}

function tradeColor(value: number | null) {
  if (value === null || Number.isNaN(value)) return 'rgba(255,255,255,0.30)'
  if (value > 0) return '#10B981'
  if (value < 0) return '#F43F5E'
  return 'rgba(255,255,255,0.50)'
}

// 🎬 ROOKNOMICS CINEMATIC UI: Shared styles
const card = {
  background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
} as React.CSSProperties

export function ResultsDashboard({
  portfolioSeries,
  benchmarkSeries,
  tradeLog,
  portfolioMetrics,
  benchmarkMetrics,
  riskStats,
  loading = false,
  error = null,
  hasBacktestData,
  parsedDataAvailable = true,
  rawDataPreview = null,
}: ResultsDashboardProps) {
  const [metricTab, setMetricTab] = useState<'strategy' | 'sp500'>('strategy')
  const activeMetrics = metricTab === 'strategy' ? portfolioMetrics : benchmarkMetrics
  const returnGap = portfolioMetrics.totalReturn - benchmarkMetrics.totalReturn
  const strategyWon = returnGap > 0

  const tradeRows = useMemo(() => tradeLog.slice(0, 8), [tradeLog])

  const metricRows = [
    { label: 'Total Return', value: formatSignedPercent(activeMetrics.totalReturn), color: metricColor(activeMetrics.totalReturn) },
    { label: 'Annualized Return', value: formatSignedPercent(activeMetrics.annualizedReturn, 2), color: metricColor(activeMetrics.annualizedReturn) },
    { label: 'Max Drawdown', value: formatSignedPercent(activeMetrics.maxDrawdown), color: '#F43F5E', note: 'Peak-to-trough fall' },
    { label: 'Win Rate', value: activeMetrics.winRate === null ? 'N/A' : formatPercent(activeMetrics.winRate), color: 'rgba(255,255,255,0.75)' },
    { label: 'Sharpe Ratio', value: activeMetrics.sharpeRatio.toFixed(2), color: 'rgba(255,255,255,0.75)' },
    { label: 'Avg Trade Duration', value: activeMetrics.avgTradeDurationDays === null ? 'N/A' : `${Math.round(activeMetrics.avgTradeDurationDays)} days`, color: 'rgba(255,255,255,0.75)' },
    { label: 'Total Trades', value: String(activeMetrics.totalTrades), color: 'rgba(255,255,255,0.75)' },
    { label: 'Trading Fees Paid', value: formatCurrency(activeMetrics.tradingFees), color: activeMetrics.tradingFees > 0 ? '#F43F5E' : 'rgba(255,255,255,0.75)' },
  ]

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 40px 64px', background: '#050505', minHeight: '100vh' }} className="rn-page-enter">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 36 }}
      >
        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
          BACKTEST ANALYSIS
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)' }}>Results Dashboard</h1>
      </motion.div>

      {/* ── Verdict Banner ── */}
      <motion.div
        variants={scaleUp}
        initial="hidden"
        animate="visible"
        style={{
          ...card,
          padding: '24px 28px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          borderColor: strategyWon ? 'rgba(16,185,129,0.20)' : 'rgba(244,63,94,0.20)',
          boxShadow: strategyWon
            ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(16,185,129,0.06)'
            : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(244,63,94,0.06)',
        }}
      >
        <div style={{
          width: 48, height: 48, flexShrink: 0,
          background: strategyWon ? 'rgba(16,185,129,0.10)' : 'rgba(244,63,94,0.10)',
          border: `1px solid ${strategyWon ? 'rgba(16,185,129,0.25)' : 'rgba(244,63,94,0.25)'}`,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {strategyWon
            ? <Trophy size={22} color="#10B981" strokeWidth={1.5} />
            : <AlertTriangle size={22} color="#F43F5E" strokeWidth={1.5} />}
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 4 }}>VERDICT</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.90)', letterSpacing: '-0.01em' }}>
            {strategyWon
              ? `Your strategy outperformed the index by ${formatSignedPercent(returnGap)}`
              : `The index outperformed your strategy by ${formatSignedPercent(Math.abs(returnGap))}`}
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>YOUR RETURN</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 500, color: '#818CF8' }}>
              {formatSignedPercent(portfolioMetrics.totalReturn)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>S&P 500 RETURN</p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.60)' }}>
              {formatSignedPercent(benchmarkMetrics.totalReturn)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Summary Stat Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}
        className="grid-cols-2 md:grid-cols-4"
      >
        {[
          { label: 'YOUR RETURN', value: formatSignedPercent(portfolioMetrics.totalReturn), type: 'positive' },
          { label: 'INDEX RETURN', value: formatSignedPercent(benchmarkMetrics.totalReturn), type: 'neutral' },
          { label: 'MAX DRAWDOWN', value: formatSignedPercent(portfolioMetrics.maxDrawdown), type: 'negative' },
          { label: 'TOTAL TRADES', value: String(portfolioMetrics.totalTrades), type: 'neutral' },
        ].map(c => (
          <motion.div
            variants={fadeUp}
            key={c.label}
            style={{
              ...card,
              padding: '20px 24px',
              boxShadow: c.type === 'positive'
                ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(16,185,129,0.06)'
                : c.type === 'negative'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(244,63,94,0.06)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>{c.label}</p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 26,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: c.type === 'positive' ? '#10B981' : c.type === 'negative' ? '#F43F5E' : 'rgba(255,255,255,0.90)',
            }}>{c.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Metric Tab Selector ── */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 24,
      }}>
        {(['strategy', 'sp500'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setMetricTab(tab)}
            style={{
              padding: '10px 20px',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: metricTab === tab ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.30)',
              background: 'none',
              border: 'none',
              borderBottom: metricTab === tab ? '2px solid #6366F1' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 150ms ease, border-color 150ms ease',
              marginBottom: -1,
            }}
          >
            {tab === 'strategy' ? 'Your Strategy' : 'S&P 500'}
          </button>
        ))}
      </div>

      {/* ── Metrics Grid ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}
        className="grid-cols-2 md:grid-cols-4"
      >
        {metricRows.map(row => (
          <motion.div
            variants={fadeUp}
            key={row.label}
            style={{ ...card, padding: '18px 22px' }}
          >
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
              {row.label}
            </p>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 500, color: row.color }}>
              {row.value}
            </p>
            {(row as any).note && (
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.20)', marginTop: 4 }}>{(row as any).note}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Charts ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        {/* Portfolio vs Index chart */}
        <motion.div variants={fadeUp} style={{ ...card, padding: 28 }}>
          <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>EQUITY CURVE</p>
          <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
            Portfolio vs S&P 500 Over Time
          </h2>
          <PortfolioChart portfolioSeries={portfolioSeries} benchmarkSeries={benchmarkSeries} />
        </motion.div>

        {/* Trade Markers + Metrics Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid-cols-1 lg:grid-cols-2">
          <motion.div variants={fadeUp} style={{ ...card, padding: 28 }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>TRADE TIMING</p>
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
              When You Traded
            </h2>
            <TradeMarkerChart portfolioSeries={portfolioSeries} tradeLog={tradeLog} />
          </motion.div>

          <motion.div variants={fadeUp} style={{ ...card, padding: 28 }}>
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>DEEP DIVE</p>
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.85)', marginBottom: 24 }}>
              Performance Analysis
            </h2>
            <MetricsComparisonChart portfolioMetrics={portfolioMetrics} benchmarkMetrics={benchmarkMetrics} />
          </motion.div>
        </div>

        {/* Trade Log — Bloomberg terminal style */}
        <motion.div variants={fadeUp} style={{ ...card, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <List size={15} color="#818CF8" strokeWidth={1.5} />
            <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>TRADE HISTORY</p>
            <div style={{
              background: 'rgba(99,102,241,0.10)',
              border: '1px solid rgba(99,102,241,0.20)',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 10, fontWeight: 500, letterSpacing: '0.06em',
              color: '#818CF8',
              textTransform: 'uppercase',
            }}>
              {portfolioMetrics.totalTrades} TRADES
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Date', 'Action', 'Price', 'Shares', 'P&L', 'Return%', 'Cumulative'].map(h => (
                    <th key={h} style={{
                      padding: '8px 12px',
                      textAlign: 'left',
                      fontSize: 9,
                      fontWeight: 500,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.25)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tradeRows.map((trade, index) => (
                  <tr
                    key={`${trade.date}-${trade.action}-${index}`}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{trade.date}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        background: trade.action === 'BUY' ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.10)',
                        border: `1px solid ${trade.action === 'BUY' ? 'rgba(99,102,241,0.25)' : 'rgba(245,158,11,0.20)'}`,
                        color: trade.action === 'BUY' ? '#818CF8' : '#F59E0B',
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 10,
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}>
                        {trade.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>{formatCurrency(trade.price, 2)}</td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>
                      {trade.shares === null || trade.shares === undefined ? '—' : trade.shares.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: tradeColor(trade.pnl ?? null), fontWeight: 500 }}>
                      {trade.pnl === null || trade.pnl === undefined ? '—' : formatCurrency(trade.pnl, 0)}
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: tradeColor(trade.returnPct ?? null), fontWeight: 500 }}>
                      {trade.returnPct === null || trade.returnPct === undefined ? '—' : formatSignedPercent(trade.returnPct)}
                    </td>
                    <td style={{ padding: '12px 12px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>
                      {trade.cumulative === null || trade.cumulative === undefined ? '—' : formatCurrency(trade.cumulative, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              Showing {tradeRows.length} of {portfolioMetrics.totalTrades} trades
            </span>
            <span style={{ fontSize: 11, color: '#818CF8', cursor: 'pointer' }}>View All</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── State banners — zero logic change ── */}
      {loading && (
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 8, padding: '14px 18px', marginTop: 16, fontSize: 13, color: '#818CF8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} className="animate-spin" />
          Calculating your backtest results...
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.20)', borderRadius: 8, padding: '14px 18px', marginTop: 16, fontSize: 13, color: '#F43F5E' }}>
          {error}
        </div>
      )}

      {!hasBacktestData && !loading && !error && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '20px', marginTop: 16, textAlign: 'center' }}>
          <Clock3 size={36} color="rgba(255,255,255,0.12)" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>No Backtest Data</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.20)' }}>Run a backtest in the Builder to populate this dashboard.</p>
        </div>
      )}

      {hasBacktestData && !parsedDataAvailable && !loading && !error && (
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8, padding: '14px 18px', marginTop: 16, fontSize: 13 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: rawDataPreview ? 12 : 0 }}>
            <AlertTriangle size={14} color="#F59E0B" style={{ marginTop: 2 }} />
            <span style={{ color: '#F59E0B' }}>Backtest data received — charts could not be mapped from the response payload.</span>
          </div>
          {rawDataPreview && (
            <pre style={{ fontSize: 10, color: 'rgba(255,255,255,0.40)', background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 12, overflowX: 'auto', maxHeight: 160, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontFamily: 'JetBrains Mono, monospace' }}>
              {rawDataPreview}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
