import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, TrendingUp, TrendingDown, Activity, Sliders,
  Play, RotateCcw, Info, ChevronDown, DollarSign,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface BuilderViewProps {
  setCurrentView: (v: string) => void;
}

export default function BuilderView({ setCurrentView }: BuilderViewProps) {
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

  const handleRunBacktest = () => {
    setCurrentView('results');
  };

  const handleReset = () => {
    setSymbol('AAPL');
    setStartDate('2015-01-01');
    setEndDate('2023-12-31');
    setRsiPeriod(14);
    setRsiBuy(30);
    setRsiSell(70);
    setMaShort(50);
    setMaLong(200);
    setMaType('SMA');
    setUseMA(true);
    setUseRSI(true);
    setInitialCapital(10000);
    setStopLoss(false);
    setStopLossPercent(10);
    setTakeProfit(false);
    setTakeProfitPercent(20);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto px-6 py-8 pb-12 bg-[#fafaf9] min-h-screen"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Strategy Builder</h1>
          <p className="text-[#6b6b6b] mt-1">Configure your trading parameters and run a backtest against the S&P 500.</p>
        </div>
        <div className="bg-[#d1fae5] text-[#0d9e6e] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0d9e6e] animate-pulse" />
          Ready to Build
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Indicators */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <label className="text-gray-900 font-semibold text-sm mb-2 block">Stock Symbol</label>
            <Input 
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. AAPL, GOOGL, TSLA" 
              className="uppercase"
            />
            <p className="text-[#a8a8a8] text-xs mt-2">Enter any valid US stock ticker symbol</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            transition={{ delay: 0.1 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-900 font-semibold text-sm mb-2 block">Start Date</label>
                <Input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-gray-900 font-semibold text-sm mb-2 block">End Date</label>
                <Input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            {startDate && endDate && (
              <p className="text-[#a8a8a8] text-xs mt-3">
                Approx. {Math.max(0, Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) * 5 / 7)).toLocaleString()} trading days
              </p>
            )}
          </motion.div>

          {/* RSI Config */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ede9fe] flex items-center justify-center">
                  <span className="text-[#5b4cf0] text-[11px] font-bold">1</span>
                </div>
                <div className="rounded-xl p-2.5 bg-[#ede9fe]">
                  <TrendingUp size={18} className="text-[#5b4cf0]" />
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold">RSI (Relative Strength Index)</h2>
                  <p className="text-[#a8a8a8] text-xs">Momentum oscillator · Buy low, sell high</p>
                </div>
              </div>
              <Switch checked={useRSI} onCheckedChange={setUseRSI} />
            </div>

            <div className={`space-y-5 ${!useRSI ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[#6b6b6b] text-sm">RSI Period</label>
                  <span className="font-mono text-gray-800 text-sm font-semibold">{rsiPeriod} days</span>
                </div>
                <Slider value={[rsiPeriod]} onValueChange={v => setRsiPeriod(v[0])} min={5} max={30} step={1} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#6b6b6b] text-sm flex items-center gap-1">
                      Buy Below <span className="text-[#0d9e6e] text-xs">(Oversold)</span>
                    </label>
                    <span className="font-mono text-[#0d9e6e] text-sm font-semibold">{rsiBuy}</span>
                  </div>
                  <Slider value={[rsiBuy]} onValueChange={v => setRsiBuy(v[0])} min={10} max={50} step={1} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#6b6b6b] text-sm flex items-center gap-1">
                      Sell Above <span className="text-[#e1294b] text-xs">(Overbought)</span>
                    </label>
                    <span className="font-mono text-[#e1294b] text-sm font-semibold">{rsiSell}</span>
                  </div>
                  <Slider value={[rsiSell]} onValueChange={v => setRsiSell(v[0])} min={50} max={95} step={1} />
                </div>
              </div>
              <div className="bg-[#ede9fe] rounded-xl p-3 flex items-start gap-2">
                <Info size={14} className="text-[#5b4cf0] mt-0.5 flex-shrink-0" />
                <p className="text-[#5b4cf0] text-xs leading-relaxed">
                  Buy when RSI drops below {rsiBuy} (stock looks oversold). Sell when RSI rises above {rsiSell} (stock looks overbought).
                </p>
              </div>
            </div>
          </motion.div>

          {/* Moving Average Config */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#ede9fe] flex items-center justify-center">
                  <span className="text-[#5b4cf0] text-[11px] font-bold">2</span>
                </div>
                <div className="rounded-xl p-2.5 bg-[#d1fae5]">
                  <Activity size={18} className="text-[#0d9e6e]" />
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold">Moving Average Crossover</h2>
                  <p className="text-[#a8a8a8] text-xs">Trend-following · Golden Cross / Death Cross</p>
                </div>
              </div>
              <Switch checked={useMA} onCheckedChange={setUseMA} />
            </div>

            <div className={`space-y-5 ${!useMA ? 'opacity-40 pointer-events-none' : ''}`}>
              <div>
                <label className="text-[#6b6b6b] text-sm mb-2 block">MA Type</label>
                <Select value={maType} onValueChange={setMaType}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="SMA" className="text-gray-800">SMA (Simple)</SelectItem>
                    <SelectItem value="EMA" className="text-gray-800">EMA (Exponential)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="bg-gray-50 rounded-xl p-3 flex items-start gap-2 mt-3">
                  <Info size={14} className="text-[#6b6b6b] mt-0.5 flex-shrink-0" />
                  <p className="text-[#6b6b6b] text-xs leading-relaxed">
                    {maType === 'SMA' 
                      ? 'Gives equal weight to all days in the period. Slower to react, less noise.' 
                      : 'Gives more weight to recent days. Reacts faster to price changes, more sensitive.'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#6b6b6b] text-sm">Short Period</label>
                    <span className="font-mono text-[#0d9e6e] text-sm font-semibold">{maShort} days</span>
                  </div>
                  <Slider value={[maShort]} onValueChange={v => setMaShort(v[0])} min={10} max={100} step={5} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[#6b6b6b] text-sm">Long Period</label>
                    <span className="font-mono text-[#0d9e6e] text-sm font-semibold">{maLong} days</span>
                  </div>
                  <Slider value={[maLong]} onValueChange={v => setMaLong(v[0])} min={100} max={400} step={10} />
                </div>
              </div>
              <div className="bg-[#ede9fe] rounded-xl p-3 flex items-start gap-2">
                <Info size={14} className="text-[#5b4cf0] mt-0.5 flex-shrink-0" />
                <p className="text-[#5b4cf0] text-xs leading-relaxed">
                  Buy when the {maShort}-day {maType} crosses above the {maLong}-day {maType} (Golden Cross). Sell on the opposite (Death Cross).
                </p>
              </div>
            </div>
          </motion.div>

          {/* Risk Management */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            transition={{ delay: 0.4 }}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-6 rounded-full bg-[#ede9fe] flex items-center justify-center">
                <span className="text-[#5b4cf0] text-[11px] font-bold">3</span>
              </div>
              <div className="rounded-xl p-2.5 bg-[#ffe4e8]">
                <TrendingDown size={18} className="text-[#e1294b]" />
              </div>
              <div>
                <h2 className="text-gray-900 font-semibold">Risk Management</h2>
                <p className="text-[#a8a8a8] text-xs">Stop-loss and take-profit rules</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Checkbox checked={stopLoss} onCheckedChange={(v) => setStopLoss(v as boolean)} />
                  <div>
                    <p className="text-gray-800 text-sm font-medium">Stop-Loss</p>
                    <p className="text-[#a8a8a8] text-xs">Auto-sell if position drops by threshold</p>
                  </div>
                </div>
                {stopLoss && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#e1294b] text-sm font-semibold">-{stopLossPercent}%</span>
                    <Slider value={[stopLossPercent]} onValueChange={v => setStopLossPercent(v[0])} min={2} max={30} step={1} className="w-24" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Checkbox checked={takeProfit} onCheckedChange={(v) => setTakeProfit(v as boolean)} />
                  <div>
                    <p className="text-gray-800 text-sm font-medium">Take-Profit</p>
                    <p className="text-[#a8a8a8] text-xs">Auto-sell if position gains by threshold</p>
                  </div>
                </div>
                {takeProfit && (
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#0d9e6e] text-sm font-semibold">+{takeProfitPercent}%</span>
                    <Slider value={[takeProfitPercent]} onValueChange={v => setTakeProfitPercent(v[0])} min={5} max={50} step={1} className="w-24" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column - Summary & Actions */}
        <div className="space-y-6">
          {/* Capital & Fees */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[var(--shadow-sm)]"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={18} className="text-[#5b4cf0]" />
              <h2 className="text-gray-900 font-semibold">Capital & Fees</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[#6b6b6b] text-sm">Starting Capital</label>
                  <span className="font-mono text-gray-800 text-sm font-semibold">${initialCapital.toLocaleString()}</span>
                </div>
                <Slider value={[initialCapital]} onValueChange={v => setInitialCapital(v[0])} min={1000} max={100000} step={1000} />
              </div>
            </div>
          </motion.div>

          {/* Strategy Summary */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={panelVariants}
            transition={{ delay: 0.1 }}
            className="bg-white border-[1.5px] border-[#c4bafc] shadow-[0_0_0_4px_rgba(91,76,240,0.04)] rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sliders size={18} className="text-[#5b4cf0]" />
              <h2 className="text-gray-900 font-semibold">Strategy Summary</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                <span className="text-[#6b6b6b]">Symbol</span>
                <span className="font-mono text-gray-800 font-semibold">{symbol || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                <span className="text-[#6b6b6b]">Period</span>
                <span className="text-gray-800">{startDate && endDate ? `${formatMonthYear(startDate)} — ${formatMonthYear(endDate)}` : '—'}</span>
              </div>
              {useRSI && (
                <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                  <span className="text-[#6b6b6b]">RSI</span>
                  <span className="font-mono text-gray-800">Buy &lt;{rsiBuy}, Sell &gt;{rsiSell} ({rsiPeriod}d)</span>
                </div>
              )}
              {useMA && (
                <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                  <span className="text-[#6b6b6b]">MA Cross</span>
                  <span className="font-mono text-gray-800">{maType} {maShort}/{maLong}</span>
                </div>
              )}
              {stopLoss && (
                <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                  <span className="text-[#6b6b6b]">Stop-Loss</span>
                  <span className="font-mono text-[#e1294b] font-semibold">-{stopLossPercent}%</span>
                </div>
              )}
              {takeProfit && (
                <div className="flex justify-between py-2 border-b border-[#e8e7e4]">
                  <span className="text-[#6b6b6b]">Take-Profit</span>
                  <span className="font-mono text-[#0d9e6e] font-semibold">+{takeProfitPercent}%</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-[#6b6b6b]">Capital</span>
                <span className="font-mono text-gray-800 font-semibold">${initialCapital.toLocaleString()}</span>
              </div>
            </div>
            {!useRSI && !useMA && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4 flex items-start gap-2">
                <Info size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-amber-700 text-xs">Enable at least one indicator to run a backtest.</p>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleRunBacktest}
              disabled={(!useRSI && !useMA) || !symbol || !startDate || !endDate}
              className="w-full bg-gradient-to-r from-[#5b4cf0] to-[#7c6ef7] hover:from-[#4a3de0] hover:to-[#6b5ef0] disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-500 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 text-[15px] shadow-[0_4px_20px_rgba(91,76,240,0.3)] hover:shadow-[0_8px_28px_rgba(91,76,240,0.4)] hover:-translate-y-0.5 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <Play size={16} /> Run Backtest
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm border border-gray-200 hover:border-gray-300 shadow-sm"
            >
              <RotateCcw size={14} /> Reset to Defaults
            </button>
          </div>

          {/* Tip */}
          <div className="bg-[#ede9fe] border border-[#c4bafc] rounded-xl p-4">
            <p className="text-[#5b4cf0] text-xs leading-relaxed">
              <strong className="text-[#5b4cf0]">Pro tip:</strong> The more parameters you tweak, the more likely you&apos;re overfitting to historical data. Simple strategies are usually more robust.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
