import { motion } from 'framer-motion';
import {
  BarChart2, TrendingUp, Shield, Zap, ArrowRight, Play,
  CheckCircle, ChevronRight, Star,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';

const miniChartData = Array.from({ length: 40 }, (_, i) => ({
  x: i,
  user: 10000 + Math.sin(i * 0.3) * 2000 + i * 50,
  sp500: 10000 + i * 200 + Math.sin(i * 0.15) * 800,
}));

const features = [
  {
    icon: Zap,
    iconBg: 'bg-[#ede9fe]',
    title: 'Instant Backtesting',
    desc: 'Test your strategy against 20 years of S&P 500 data in seconds. No coding, no spreadsheets, just pure insight.',
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-[#d1fae5]',
    title: 'Real Comparisons',
    desc: 'See exactly how your strategy stacks up against simple buy-and-hold.',
  },
  {
    icon: Shield,
    iconBg: 'bg-[#ffe4e8]',
    title: 'Risk Analysis',
    desc: 'Understand drawdowns, Sharpe ratios, and hidden costs before risking real money.',
  },
];

const testimonials = [
  { name: 'Alex M.', role: 'Retail Investor', text: 'I was convinced my RSI strategy was genius. ROOKNOMICS showed me the S&P beat it by 285 percentage points. Humbling, but it saved me thousands in potential mistakes.', stars: 5 },
  { name: 'Sarah K.', role: 'Finance Student', text: 'The Learning Hub alone is worth it. Finally understood Sharpe ratios and why passive investing wins.', stars: 5 },
  { name: 'David L.', role: 'Day Trader', text: 'Painful truth delivered beautifully. The verdict panel hits different when you see your strategy vs the index.', stars: 4 },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface LandingViewProps {
  setCurrentView: (v: string) => void;
  setShowAuth: (v: boolean) => void;
}

export default function LandingView({ setCurrentView, setShowAuth }: LandingViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen relative overflow-hidden bg-[#fafaf9]"
    >
      {/* Visual flair - radial gradient blobs */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(91,76,240,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-20 right-0 w-[400px] h-[400px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(13,158,110,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="font-display italic text-6xl md:text-7xl font-normal text-[#111110] leading-tight mb-6 tracking-tight"
            >
              Think you can beat the{' '}
              <span className="bg-gradient-to-r from-[#5b4cf0] to-violet-400 bg-clip-text text-transparent">
                market?
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              className="text-lg text-[#6b6b6b] leading-relaxed mb-10 max-w-lg"
            >
              Build a custom trading strategy using technical indicators—then watch it go head-to-head against the S&P 500 over 20 years of real market data.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => setCurrentView('builder')}
                className="bg-[#5b4cf0] hover:bg-[#4a3de0] text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[15px] shadow-[0_4px_20px_rgba(91,76,240,0.3)] hover:shadow-[0_8px_28px_rgba(91,76,240,0.4)] hover:-translate-y-0.5"
              >
                Build Your Strategy <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setCurrentView('results')}
                className="bg-white border border-gray-200 text-gray-700 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:border-gray-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <Play size={16} className="text-[#5b4cf0]" /> See How It Looks
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.35 }}
              className="flex flex-wrap items-center gap-6 mt-10 text-[13px] text-[#a8a8a8] font-medium"
            >
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-[#0d9e6e]" /> Free forever</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-[#0d9e6e]" /> No signup required</span>
              <span className="flex items-center gap-2"><CheckCircle size={16} className="text-[#0d9e6e]" /> 20 years of data</span>
            </motion.div>
          </div>

          {/* App preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="relative z-10 lg:ml-auto w-full max-w-[500px]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-[var(--shadow-lg)] border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                  <div className="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]" />
                  <div className="w-[10px] h-[10px] rounded-full bg-[#28ca41]" />
                  <span className="text-[#a8a8a8] text-xs font-medium ml-2 tracking-wide">ROOKNOMICS.app</span>
                </div>
              </div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[#6b6b6b] text-sm font-medium mb-1">Your Strategy vs S&P 500</p>
                  <div className="flex items-baseline gap-2">
                    <p className="font-mono text-[#e1294b] text-3xl font-bold tracking-tight">+47%</p>
                    <span className="text-[#a8a8a8] text-sm font-medium">vs</span>
                    <p className="font-mono text-[#0d9e6e] text-xl font-bold">+332%</p>
                  </div>
                </div>
                <div className="bg-[#d1fae5] text-[#0d9e6e] text-xs font-bold px-3 py-1 rounded-full mb-1 border border-green-100">S&P WINS</div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData}>
                    <defs>
                      <linearGradient id="heroUser" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e1294b" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#e1294b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="heroSp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9e6e" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#0d9e6e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="user" stroke="#e1294b" strokeWidth={2} fill="url(#heroUser)" />
                    <Area type="monotone" dataKey="sp500" stroke="#0d9e6e" strokeWidth={2.5} fill="url(#heroSp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -top-6 -right-6 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[var(--shadow-md)] hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} className="text-[#e1294b]" />
                <p className="text-[#a8a8a8] text-xs font-semibold uppercase tracking-wider">Max Drawdown</p>
              </div>
              <p className="font-mono text-[#111110] text-lg font-bold">-38.4%</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-[var(--shadow-md)] hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield size={14} className="text-[#5b4cf0]" />
                <p className="text-[#a8a8a8] text-xs font-semibold uppercase tracking-wider">Sharpe Ratio</p>
              </div>
              <p className="font-mono text-[#111110] text-lg font-bold">0.82</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="mb-16 text-center lg:text-left lg:max-w-2xl">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#5b4cf0] mb-3">How it works</p>
          <h2 className="font-display italic text-4xl font-normal text-[#111110] mb-4 tracking-tight">
            Everything you need to test your trading thesis
          </h2>
          <p className="text-[#6b6b6b] text-lg leading-relaxed">
            No spreadsheets, no coding, no BS. Just honest results visualized beautifully to save you from costly mistakes.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 grid-flow-row-dense"
        >
          {features.map((f, i) => {
            const isLarge = i === 0;
            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-[var(--shadow-md)] transition-all duration-300 group relative overflow-hidden shadow-[var(--shadow-sm)] flex flex-col cursor-pointer ${isLarge ? 'lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-white to-[#ede9fe]/30 justify-center lg:p-10' : 'lg:col-span-1'}`}
              >
                <div className="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                  <f.icon size={isLarge ? 240 : 160} />
                </div>
                <div className={`w-11 h-11 rounded-xl p-2.5 inline-flex mb-6 self-start ${f.iconBg}`}>
                  <f.icon size={24} className="text-[#5b4cf0]" strokeWidth={1.5} />
                </div>
                <h3 className={`${isLarge ? 'text-3xl lg:text-4xl' : 'text-xl'} text-[#111110] font-bold mb-3 tracking-tight`}>{f.title}</h3>
                <p className={`text-[#6b6b6b] leading-relaxed ${isLarge ? 'text-xl max-w-lg' : 'text-base'}`}>{f.desc}</p>
                {isLarge && (
                  <div className="mt-10 pt-6 border-t border-[#e8e7e4] flex items-center text-[#5b4cf0] font-semibold gap-2 cursor-pointer w-max">
                    Explore builder capabilities <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Steps */}
      <section className="bg-[#fafaf9] border-y border-[#e8e7e4] py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#5b4cf0] mb-3">Simple Process</p>
            <h2 className="font-display italic text-4xl font-normal text-[#111110] mb-4 tracking-tight">
              How it works
            </h2>
            <p className="text-[#6b6b6b] text-lg">Three simple steps to reality-check your strategy.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[31px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#5b4cf0] via-[#e1294b] to-[#0d9e6e]" />

            {[
              { step: '1', title: 'Configure Your Strategy', desc: 'Set RSI thresholds, moving average crossover periods, and risk management parameters without writing a single line of code.' },
              { step: '2', title: 'Run the Backtest', desc: 'We instantly simulate your specific strategy against 20 years of S&P 500 historical data, accounting for trading fees.' },
              { step: '3', title: 'Face the Verdict', desc: 'See exactly how your strategy compares to a simple buy-and-hold indexing approach in a side-by-side performance review.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="relative flex flex-col md:flex-row gap-6 md:gap-10 mb-16 last:mb-0 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#e8e7e4] flex items-center justify-center flex-shrink-0 z-10 shadow-[var(--shadow-sm)] transition-all duration-300 group-hover:scale-110 group-hover:border-[#5b4cf0] group-hover:shadow-[0_0_20px_rgba(91,76,240,0.2)]">
                  <div className="w-6 h-6 rounded-full bg-[#ede9fe] flex items-center justify-center">
                    <span className="text-[#5b4cf0] font-bold text-[11px]">{s.step}</span>
                  </div>
                </div>
                <div className="pt-3 bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-[var(--shadow-sm)] flex-1 hover:shadow-[var(--shadow-md)] transition-shadow">
                  <h3 className="text-xl text-[#111110] font-bold mb-2 tracking-tight">{s.title}</h3>
                  <p className="text-[#6b6b6b] text-base leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 pb-12 relative z-10 overflow-hidden bg-[#fafaf9] border-t border-[#e8e7e4]">
        <div className="mb-12 text-center max-w-7xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#5b4cf0] mb-3">Testimonials</p>
          <h2 className="font-display italic text-4xl font-normal text-[#111110] mb-4 tracking-tight">
            What traders are saying
          </h2>
          <p className="text-[#6b6b6b] text-lg">{"Don't just take our word for it. See what others have built."}</p>
        </div>

        <div className="relative flex overflow-x-hidden group py-4" style={{ '--duration': '40s' } as React.CSSProperties}>
          <div className="flex animate-marquee hover:[animation-play-state:paused] w-max gap-8 pr-8">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-[350px] md:w-[420px] shrink-0 bg-white border border-gray-100 rounded-2xl p-8 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-transform hover:-translate-y-1 flex flex-col justify-between cursor-default">
                <div>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={16} className="text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-[#6b6b6b] leading-relaxed mb-8 italic text-base">{`"${t.text}"`}</p>
                </div>
                <div className="flex items-center gap-4 border-t border-[#e8e7e4] pt-6 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#ede9fe] flex items-center justify-center font-bold text-[#5b4cf0] text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[#111110] text-sm font-bold">{t.name}</p>
                    <p className="text-[#a8a8a8] text-sm font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Fading gradient edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-[#fafaf9] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#fafaf9] to-transparent z-10" />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-8 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white border-[1.5px] border-[#c4bafc] shadow-[0_0_0_4px_rgba(91,76,240,0.04),var(--shadow-lg)] rounded-2xl p-10 lg:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ede9fe]/50 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10">
            <h2 className="font-display italic text-3xl lg:text-5xl font-normal text-[#111110] mb-6 tracking-tight">
              Ready to test your edge?
            </h2>
            <p className="text-[#6b6b6b] text-lg lg:text-xl mb-10 max-w-xl mx-auto">
              Most strategies look great on paper. Find out if yours survives 20 years of real market conditions.
            </p>
            <button
              onClick={() => setCurrentView('builder')}
              className="bg-gradient-to-r from-[#5b4cf0] to-[#7c6ef7] hover:from-[#4a3de0] hover:to-[#6b5ef0] text-white font-bold px-10 py-5 rounded-2xl transition-all duration-200 text-lg shadow-[0_4px_20px_rgba(91,76,240,0.3)] hover:shadow-[0_8px_28px_rgba(91,76,240,0.4)] inline-flex items-center gap-3 hover:-translate-y-0.5"
            >
              Start Building Now <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e8e7e4] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5b4cf0] flex items-center justify-center shadow-sm">
              <BarChart2 size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[#6b6b6b] font-bold text-sm tracking-wide">ROOKNOMICS © 2024</span>
          </div>
          <div className="flex gap-8 text-[#6b6b6b] text-sm font-medium">
            <button onClick={() => setCurrentView('learn')} className="hover:text-[#5b4cf0] transition-colors">Learning Hub</button>
            <button onClick={() => setCurrentView('builder')} className="hover:text-[#5b4cf0] transition-colors">Strategy Builder</button>
            <button onClick={() => setCurrentView('results')} className="hover:text-[#5b4cf0] transition-colors">Demo Results</button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
