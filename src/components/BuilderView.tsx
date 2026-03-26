// 🎬 ROOKNOMICS CINEMATIC UI: BuilderView — dark precision instrument redesign
// ZERO LOGIC CHANGES — all state, handlers, dispatch logic preserved exactly
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import {
  TrendingUp, TrendingDown, Activity,
  Play, RotateCcw, Info, DollarSign, Sliders,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { runBacktest } from '@/store/backtestSlice';
import { clearBacktest } from '@/store/backtestSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/index';

// 🎬 ROOKNOMICS CINEMATIC UI: Shared style tokens
const card = {
  background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
  padding: 24,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
} as React.CSSProperties;

const label = {
  fontSize: 10,
  fontWeight: 500 as const,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.30)',
  marginBottom: 8,
  display: 'block',
  fontFamily: 'Inter, sans-serif',
} as React.CSSProperties;

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  color: 'rgba(255,255,255,0.90)',
  fontSize: 13,
  padding: '9px 12px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 150ms ease',
} as React.CSSProperties;

const sectionHeader = {
  fontSize: 9,
  fontWeight: 500 as const,
  letterSpacing: '0.14em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.25)',
  marginBottom: 6,
  fontFamily: 'Inter, sans-serif',
} as React.CSSProperties;

interface BuilderViewProps {
  setCurrentView: (v: string) => void;
}

export default function BuilderView({ setCurrentView }: BuilderViewProps) {
  // 🎬 ROOKNOMICS CINEMATIC UI: All state identical — zero logic change
  const [symbol, setSymbol] = useState('AAPL');
  const [startDate, setStartDate] = useState('2015-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [rsiBuy, setRsiBuy] = useState(30);
  const [rsiSell, setRsiSell] = useState(70);
  const [maShort, setMaShort] = useState(50);
  const [maLong, setMaLong] = useState(200);
  const [maType, setMaType] = useState('SMA');
  const [useMA, setUseMA] = useState(true);
  const [useRSI, setUseRSI] = useState(true);
  const [initialCapital, setInitialCapital] = useState(10000);

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  const [stopLoss, setStopLoss] = useState(false);
  const [stopLossPercent, setStopLossPercent] = useState(10);
  const [takeProfit, setTakeProfit] = useState(false);
  const [takeProfitPercent, setTakeProfitPercent] = useState(20);
  const dispatch = useDispatch<AppDispatch>();

  // 🎬 All handlers identical — zero logic change
  const handleRunBacktest = async () => {
    const activeRules = [];
    if (useMA) { activeRules.push('MA Crossover'); }
    if (useRSI) { activeRules.push('RSI Entry'); }
    if (stopLoss) { activeRules.push('Stop Loss'); }
    const rulesConfig = {
      rsi: { enabled: useRSI, period: rsiPeriod, buyBelow: rsiBuy, sellAbove: rsiSell },
      maCross: { enabled: useMA, type: maType, fastPeriod: maShort, slowPeriod: maLong },
    };
    const result = { symbol, startDate, endDate, capital: initialCapital, activeRules, rulesConfig };
    dispatch(clearBacktest());
    try {
      await dispatch(runBacktest({ ...result })).unwrap();
      setCurrentView('results');
    } catch (err) {
      console.error('Backtest failed', err);
    }
  };

  const handleReset = () => {
    setSymbol('AAPL'); setStartDate('2015-01-01'); setEndDate('2023-12-31');
    setRsiPeriod(14); setRsiBuy(30); setRsiSell(70);
    setMaShort(50); setMaLong(200); setMaType('SMA');
    setUseMA(true); setUseRSI(true); setInitialCapital(10000);
    setStopLoss(false); setStopLossPercent(10);
    setTakeProfit(false); setTakeProfitPercent(20);
  };

  const canRun = (useRSI || useMA) && !!symbol && !!startDate && !!endDate;

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 40px 64px', background: '#050505', minHeight: '100vh' }} className="rn-page-enter">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 40 }}
      >
        <p style={sectionHeader}>STRATEGY CONFIGURATION</p>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'rgba(255,255,255,0.90)',
          marginBottom: 6,
        }}>Strategy Builder</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)' }}>
          Configure your trading parameters and run a 20-year backtest against the S&P 500.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}
        className="lg:grid-cols-[1fr_320px] flex flex-col lg:grid"
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Symbol + Dates */}
          <motion.div variants={fadeUp} style={card}>
            <p style={sectionHeader}>INSTRUMENT</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
              <div>
                <label style={label}>Stock Symbol</label>
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. AAPL"
                  style={{ ...inputStyle, textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>Any valid US ticker</p>
              </div>
              <div>
                <label style={label}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={label}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.60)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            {startDate && endDate && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                ≈ {Math.max(0, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) * 5 / 7)).toLocaleString()} trading days
              </p>
            )}
          </motion.div>

          {/* RSI config */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'rgba(99,102,241,0.10)',
                  border: '1px solid rgba(99,102,241,0.18)',
                  borderRadius: 7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TrendingUp size={16} color="#818CF8" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>RSI Indicator</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.04em' }}>MOMENTUM OSCILLATOR</p>
                </div>
              </div>
              <Switch checked={useRSI} onCheckedChange={setUseRSI} />
            </div>

            <div style={{ opacity: useRSI ? 1 : 0.35, pointerEvents: useRSI ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={label}>RSI Period</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>{rsiPeriod} days</span>
                </div>
                <Slider value={[rsiPeriod]} onValueChange={v => setRsiPeriod(v[0])} min={5} max={30} step={1} className="w-full" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={label}>Buy Below <span style={{ color: '#10B981' }}>(Oversold)</span></span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#10B981' }}>{rsiBuy}</span>
                  </div>
                  <Slider value={[rsiBuy]} onValueChange={v => setRsiBuy(v[0])} min={10} max={50} step={1} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={label}>Sell Above <span style={{ color: '#F43F5E' }}>(Overbought)</span></span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F43F5E' }}>{rsiSell}</span>
                  </div>
                  <Slider value={[rsiSell]} onValueChange={v => setRsiSell(v[0])} min={50} max={95} step={1} />
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 8 }}>
                <Info size={13} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Buy when RSI drops below {rsiBuy} (oversold). Sell when RSI rises above {rsiSell} (overbought).
                </p>
              </div>
            </div>
          </motion.div>

          {/* Moving Average config */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36,
                  background: 'rgba(34,211,238,0.08)',
                  border: '1px solid rgba(34,211,238,0.15)',
                  borderRadius: 7,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Activity size={16} color="#22D3EE" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>Moving Average Crossover</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.04em' }}>TREND-FOLLOWING</p>
                </div>
              </div>
              <Switch checked={useMA} onCheckedChange={setUseMA} />
            </div>

            <div style={{ opacity: useMA ? 1 : 0.35, pointerEvents: useMA ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={label}>MA Type</label>
                <Select value={maType} onValueChange={setMaType}>
                  <SelectTrigger style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    color: 'rgba(255,255,255,0.80)',
                    fontSize: 13,
                    width: 180,
                  }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{
                    background: '#111111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                  }}>
                    <SelectItem value="SMA" style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13 }}>SMA (Simple)</SelectItem>
                    <SelectItem value="EMA" style={{ color: 'rgba(255,255,255,0.80)', fontSize: 13 }}>EMA (Exponential)</SelectItem>
                  </SelectContent>
                </Select>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 8, marginTop: 10 }}>
                  <Info size={13} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                    {maType === 'SMA'
                      ? 'Equal weight to all days. Slower to react, less noise.'
                      : 'More weight to recent days. Reacts faster, more sensitive.'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={label}>Short Period</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#22D3EE' }}>{maShort}d</span>
                  </div>
                  <Slider value={[maShort]} onValueChange={v => setMaShort(v[0])} min={10} max={100} step={5} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={label}>Long Period</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#22D3EE' }}>{maLong}d</span>
                  </div>
                  <Slider value={[maLong]} onValueChange={v => setMaLong(v[0])} min={100} max={400} step={10} />
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, padding: '10px 14px', display: 'flex', gap: 8 }}>
                <Info size={13} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Buy on Golden Cross ({maShort}d {maType} above {maLong}d {maType}). Sell on Death Cross.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Risk Management */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36,
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.15)',
                borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <TrendingDown size={16} color="#F43F5E" strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.01em' }}>Risk Management</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.04em' }}>STOP-LOSS & TAKE-PROFIT</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Stop Loss */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Checkbox checked={stopLoss} onCheckedChange={(v) => setStopLoss(v as boolean)} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>Stop-Loss</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>Auto-sell if position drops by threshold</p>
                  </div>
                </div>
                {stopLoss && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#F43F5E' }}>-{stopLossPercent}%</span>
                    <div style={{ width: 80 }}>
                      <Slider value={[stopLossPercent]} onValueChange={v => setStopLossPercent(v[0])} min={2} max={30} step={1} />
                    </div>
                  </div>
                )}
              </div>

              {/* Take Profit */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: 6,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Checkbox checked={takeProfit} onCheckedChange={(v) => setTakeProfit(v as boolean)} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>Take-Profit</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.30)' }}>Auto-sell if position gains by threshold</p>
                  </div>
                </div>
                {takeProfit && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#10B981' }}>+{takeProfitPercent}%</span>
                    <div style={{ width: 80 }}>
                      <Slider value={[takeProfitPercent]} onValueChange={v => setTakeProfitPercent(v[0])} min={5} max={50} step={1} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN — Summary & Actions ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Capital */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <DollarSign size={15} color="#818CF8" strokeWidth={1.5} />
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>Capital & Fees</p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={label}>Starting Capital</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,0.80)' }}>${initialCapital.toLocaleString()}</span>
              </div>
              <Slider value={[initialCapital]} onValueChange={v => setInitialCapital(v[0])} min={1000} max={100000} step={1000} />
            </div>
          </motion.div>

          {/* Strategy Summary */}
          <motion.div variants={fadeUp} style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Sliders size={15} color="#818CF8" strokeWidth={1.5} />
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>Strategy Summary</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Symbol', value: symbol || '—', mono: true },
                { label: 'Period', value: startDate && endDate ? `${formatMonthYear(startDate)} — ${formatMonthYear(endDate)}` : '—' },
                ...(useRSI ? [{ label: 'RSI', value: `Buy <${rsiBuy}, Sell >${rsiSell} (${rsiPeriod}d)`, mono: true }] : []),
                ...(useMA ? [{ label: 'MA Cross', value: `${maType} ${maShort}/${maLong}`, mono: true }] : []),
                ...(stopLoss ? [{ label: 'Stop-Loss', value: `-${stopLossPercent}%`, color: '#F43F5E', mono: true }] : []),
                ...(takeProfit ? [{ label: 'Take-Profit', value: `+${takeProfitPercent}%`, color: '#10B981', mono: true }] : []),
                { label: 'Capital', value: `$${initialCapital.toLocaleString()}`, mono: true },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{row.label}</span>
                  <span style={{
                    fontFamily: row.mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
                    fontSize: 11,
                    fontWeight: 500,
                    color: (row as any).color || 'rgba(255,255,255,0.75)',
                  }}>{row.value}</span>
                </div>
              ))}
            </div>
            {!useRSI && !useMA && (
              <div style={{
                marginTop: 12,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.20)',
                borderRadius: 6,
                padding: '10px 14px',
                display: 'flex', gap: 8,
              }}>
                <Info size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: '#F59E0B' }}>Enable at least one indicator to run a backtest.</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={handleRunBacktest}
              disabled={!canRun}
              style={{
                width: '100%',
                background: canRun ? '#6366F1' : 'rgba(255,255,255,0.06)',
                color: canRun ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)',
                fontWeight: 600,
                fontSize: 13,
                padding: '13px',
                borderRadius: 6,
                border: 'none',
                cursor: canRun ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 150ms ease, box-shadow 150ms ease',
                boxShadow: canRun ? '0 0 20px rgba(99,102,241,0.20)' : 'none',
              }}
              onMouseEnter={e => { if (canRun) { (e.currentTarget).style.background = '#4F46E5'; (e.currentTarget).style.boxShadow = '0 0 30px rgba(99,102,241,0.35)'; } }}
              onMouseLeave={e => { if (canRun) { (e.currentTarget).style.background = '#6366F1'; (e.currentTarget).style.boxShadow = '0 0 20px rgba(99,102,241,0.20)'; } }}
            >
              <Play size={14} strokeWidth={2} /> Run Backtest
            </button>
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.50)',
                fontWeight: 500,
                fontSize: 13,
                padding: '10px',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 150ms ease',
              }}
              onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <RotateCcw size={12} /> Reset to Defaults
            </button>
          </motion.div>

          {/* Pro tip card */}
          <motion.div variants={fadeUp} style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
            borderRadius: 8,
            padding: '14px 16px',
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
              <span style={{ color: '#818CF8', fontWeight: 600 }}>Pro tip:</span> The more parameters you tweak, the more likely you're overfitting to historical data. Simple strategies are usually more robust.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
