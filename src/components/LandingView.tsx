// 🎬 ROOKNOMICS CINEMATIC UI: LandingView — full cinematic dark redesign
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { fadeUp, staggerContainer, scaleUp } from '@/lib/animations';
import {
  BarChart2, TrendingUp, Shield, Zap, ArrowRight, Play,
  CheckCircle, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';

// 🎬 ROOKNOMICS CINEMATIC UI: Same data, no logic change
const miniChartData = Array.from({ length: 40 }, (_, i) => ({
  x: i,
  user: 10000 + Math.sin(i * 0.3) * 2000 + i * 50,
  sp500: 10000 + i * 200 + Math.sin(i * 0.15) * 800,
}));

const features = [
  {
    icon: Zap,
    label: 'INSTANT RESULTS',
    title: 'Instant Backtesting',
    desc: 'Test your strategy against 20 years of S&P 500 data in seconds. No coding, no spreadsheets, just pure insight.',
  },
  {
    icon: TrendingUp,
    label: 'HEAD-TO-HEAD',
    title: 'Real Comparisons',
    desc: 'See exactly how your strategy stacks up against simple buy-and-hold.',
  },
  {
    icon: Shield,
    label: 'RISK ANALYSIS',
    title: 'Risk Analysis',
    desc: 'Understand drawdowns, Sharpe ratios, and hidden costs before risking real money.',
  },
];

const testimonials = [
  { name: 'Alex M.', role: 'Retail Investor', text: 'I was convinced my RSI strategy was genius. ROOKNOMICS showed me the S&P beat it by 285 percentage points. Humbling, but it saved me thousands.', stars: 5 },
  { name: 'Sarah K.', role: 'Finance Student', text: 'The Learning Hub alone is worth it. Finally understood Sharpe ratios and why passive investing wins.', stars: 5 },
  { name: 'David L.', role: 'Day Trader', text: 'Painful truth delivered beautifully. The verdict panel hits different when you see your strategy vs the index.', stars: 4 },
];

interface LandingViewProps {
  setCurrentView: (v: string) => void;
  setShowAuth: (v: boolean) => void;
}

// 🎬 ROOKNOMICS CINEMATIC UI: Cinematic scroll hero using Framer Motion
export default function LandingView({ setCurrentView, setShowAuth }: LandingViewProps) {
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroContainerRef,
    offset: ['start start', 'end start'],
  });

  // Headline animation: fades up and out as you scroll
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  // Dashboard mockup: fades in
  const mockupOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const mockupY = useTransform(scrollYProgress, [0.15, 0.45], [40, 0]);

  // Stat cards: stagger-explode outward
  const card1X = useTransform(scrollYProgress, [0.35, 0.65], [0, -80]);
  const card2X = useTransform(scrollYProgress, [0.35, 0.65], [0, 80]);
  const cardsOpacity = useTransform(scrollYProgress, [0.35, 0.55, 0.75, 0.90], [0, 1, 1, 0]);

  // Final dashboard fade-in
  const dashOpacity = useTransform(scrollYProgress, [0.75, 1.0], [0, 1]);
  const dashY = useTransform(scrollYProgress, [0.75, 1.0], [30, 0]);

  // Scroll text overlays
  const text2Opacity = useTransform(scrollYProgress, [0.20, 0.32, 0.42], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.42, 0.52, 0.65], [0, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.65, 0.75, 0.88], [0, 1, 0]);

  const handleCTA = () => {
    const token = localStorage.getItem('token');
    if (!token) setShowAuth(true);
    else setCurrentView('builder');
  };

  const handleResults = () => {
    const token = localStorage.getItem('token');
    if (!token) setShowAuth(true);
    else setCurrentView('results');
  };

  return (
    <div className="relative" style={{ background: '#050505' }}>
      {/* ── CINEMATIC SCROLL HERO ── */}
      {/* 🎬 ROOKNOMICS CINEMATIC UI: 400vh scroll container with sticky hero */}
      <div ref={heroContainerRef} style={{ height: '400vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#050505' }}>

          {/* Ambient indigo radial glow — pulsing behind hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)',
              animation: 'heroPulse 4s infinite ease-in-out',
            }}
          />

          {/* ── SCROLL PHASE 0: ROOKNOMICS Wordmark ── */}
          <motion.div
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          >
            <div className="flex items-center gap-4 mb-6">
              {/* Chess rook icon in indigo */}
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: '#6366F1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(99,102,241,0.40)',
              }}>
                <BarChart2 size={26} color="white" strokeWidth={2} />
              </div>
            </div>
            <h1 style={{
              fontSize: 'clamp(48px, 8vw, 80px)',
              fontWeight: 800,
              letterSpacing: '-0.05em',
              color: 'rgba(255,255,255,0.92)',
              textAlign: 'center',
              lineHeight: 1,
              marginBottom: 20,
              fontFamily: 'Inter, sans-serif',
            }}>
              ROOKNOMICS.
            </h1>
            <p style={{
              fontSize: 18,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
            }}>
              Strategy Backtesting
            </p>

            {/* Scroll hint */}
            <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.20)', textTransform: 'uppercase' }}>
                SCROLL TO EXPLORE
              </span>
              <div style={{
                width: 1, height: 40,
                background: 'linear-gradient(to bottom, rgba(99,102,241,0.60), transparent)',
                animation: 'fadeInUp 2s infinite',
              }} />
            </div>
          </motion.div>

          {/* ── SCROLL PHASE 1 TEXT: "Precision Backtesting." ── */}
          <motion.div
            style={{ opacity: text2Opacity }}
            className="absolute left-[8%] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', marginBottom: 12 }}>
              BUILT FOR PRECISION
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)' }}>
              Precision<br />Backtesting.
            </h2>
          </motion.div>

          {/* ── SCROLL PHASE 1: Dashboard mockup emerges ── */}
          <motion.div
            style={{ opacity: mockupOpacity, y: mockupY }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            {/* Mini chart mockup with rim lighting */}
            <div style={{
              background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '32px 40px',
              width: 480,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 50px rgba(99,102,241,0.10)',
            }}>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 4 }}>
                  STRATEGY VS S&P 500
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 32, fontWeight: 500, color: 'rgba(255,255,255,0.90)' }}>+47.3%</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, color: '#10B981' }}>vs +332%</span>
                </div>
              </div>
              <div style={{ height: 120 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={miniChartData}>
                    <defs>
                      <linearGradient id="cgUser" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity={0.20} />
                        <stop offset="100%" stopColor="#818CF8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="cgSp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="user" stroke="#818CF8" strokeWidth={2} fill="url(#cgUser)" dot={false} />
                    <Area type="monotone" dataKey="sp500" stroke="#10B981" strokeWidth={2} fill="url(#cgSp)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* ── SCROLL PHASE 2 TEXT: "Every Variable. Every Edge." ── */}
          <motion.div
            style={{ opacity: text3Opacity }}
            className="absolute right-[8%] top-1/2 -translate-y-1/2 z-20 pointer-events-none text-right"
          >
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', marginBottom: 12 }}>
              TOTAL CONTROL
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)' }}>
              Every Variable.<br />Every Edge.
            </h2>
          </motion.div>

          {/* ── SCROLL PHASE 2: Metric cards explode outward ── */}
          <motion.div
            style={{ opacity: cardsOpacity }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          >
            <motion.div style={{ x: card1X }} className="absolute" style={{ left: '10%', top: '35%', x: card1X }}>
              <div style={{
                background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '20px 24px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(16,185,129,0.08)',
              }}>
                <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>TOTAL RETURN</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 500, color: '#10B981' }}>+284.3%</p>
              </div>
            </motion.div>
            <motion.div style={{ x: card2X }} className="absolute" style={{ right: '10%', top: '52%', x: card2X }}>
              <div style={{
                background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10, padding: '20px 24px',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 30px rgba(244,63,94,0.06)',
              }}>
                <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 8 }}>SHARPE RATIO</p>
                <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.90)' }}>1.82</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── SCROLL PHASE 3 TEXT: "See Every Detail." ── */}
          <motion.div
            style={{ opacity: text4Opacity }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)', textAlign: 'center' }}>
              See Every Detail.
            </h2>
          </motion.div>

          {/* ── SCROLL PHASE 4: Full dashboard preview ── */}
          <motion.div
            style={{ opacity: dashOpacity, y: dashY }}
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none px-8"
          >
            <div style={{
              background: 'linear-gradient(180deg, #0D0D0D 0%, #050505 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: 32,
              width: '100%',
              maxWidth: 800,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'TOTAL RETURN', value: '+284%', color: '#10B981' },
                  { label: 'SHARPE RATIO', value: '1.82', color: 'rgba(255,255,255,0.90)' },
                  { label: 'MAX DRAWDOWN', value: '-12.3%', color: '#F43F5E' },
                  { label: 'WIN RATE', value: '67%', color: 'rgba(255,255,255,0.90)' },
                ].map(m => (
                  <div key={m.label} style={{
                    background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, padding: '16px',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{m.label}</p>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 500, color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ height: 80, background: 'rgba(255,255,255,0.02)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>EQUITY CURVE — RUN A BACKTEST TO POPULATE</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── CONTENT BELOW HERO (after scroll completes) ── */}
      <div style={{ background: '#050505' }}>

        {/* ── HERO CTA SECTION ── */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '80px 40px 80px' }}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={fadeUp} style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>
                PROFESSIONAL STRATEGY BACKTESTING
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.92)',
              marginBottom: 20,
              lineHeight: 1.1,
            }}>
              Think you can beat<br />the market?
            </motion.h2>
            <motion.p variants={fadeUp} style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 480,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}>
              Build a custom trading strategy using technical indicators — then watch it go head-to-head against the S&P 500 over 20 years of real market data.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleCTA}
                style={{
                  background: '#6366F1',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '12px 28px',
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 150ms ease, box-shadow 150ms ease',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = '#4F46E5';
                  (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(99,102,241,0.35)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = '#6366F1';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }}
              >
                Build Your Strategy <ArrowRight size={16} />
              </button>
              <button
                onClick={handleResults}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.65)',
                  fontWeight: 500,
                  fontSize: 14,
                  padding: '12px 24px',
                  borderRadius: 6,
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <Play size={14} /> View Demo
              </button>
            </motion.div>

            {/* Assurance chips */}
            <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
              {['Free forever', 'No signup required', '20 years of data'].map(item => (
                <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>
                  <CheckCircle size={13} color="#10B981" /> {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px 80px' }}>
          {/* Hairline separator */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 64 }} />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{ marginBottom: 48 }}
          >
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>CAPABILITIES</p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)' }}>
              Everything you need to<br />test your trading thesis
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}
          >
            {features.map((f, i) => (
              <motion.div
                variants={fadeUp}
                key={i}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: 28,
                  cursor: 'default',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                  transition: 'box-shadow 200ms ease',
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid rgba(99,102,241,0.20)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <f.icon size={18} color="#818CF8" strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 10 }}>
                  {f.label}
                </p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.90)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px 80px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 64 }} />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.div variants={fadeUp} style={{ marginBottom: 48 }}>
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>WORKFLOW</p>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)' }}>
                Three steps to<br />reality-check your strategy
              </h2>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { step: '01', title: 'Configure Your Strategy', desc: 'Set RSI thresholds, moving average crossover periods, and risk management parameters without writing a single line of code.' },
                { step: '02', title: 'Run the Backtest', desc: 'We instantly simulate your specific strategy against 20 years of S&P 500 historical data, accounting for trading fees.' },
                { step: '03', title: 'Face the Verdict', desc: 'See exactly how your strategy compares to a simple buy-and-hold indexing approach in a side-by-side performance review.' },
              ].map((s, i) => (
                <motion.div
                  variants={fadeUp}
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 28,
                    padding: '28px 0',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11, fontWeight: 500,
                    color: 'rgba(255,255,255,0.20)',
                    letterSpacing: '0.04em',
                    minWidth: 28, paddingTop: 4,
                  }}>
                    {s.step}
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 28 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 8, letterSpacing: '-0.01em' }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', lineHeight: 1.65 }}>
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── TESTIMONIALS MARQUEE ── */}
        <section style={{ padding: '0 0 80px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 48 }} />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              style={{ marginBottom: 36 }}
            >
              <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>WHAT TRADERS SAY</p>
            </motion.div>
          </div>

          <div className="relative flex overflow-x-hidden" style={{ '--duration': '40s' } as React.CSSProperties}>
            <div className="flex animate-marquee hover:[animation-play-state:paused] w-max gap-4 pr-4 pl-10">
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} style={{
                  width: 360,
                  flexShrink: 0,
                  background: 'linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10,
                  padding: '24px 28px',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <span key={j} style={{ fontSize: 11, color: '#F59E0B' }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 16 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'rgba(99,102,241,0.15)',
                      border: '1px solid rgba(99,102,241,0.20)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 12, color: '#818CF8',
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.80)' }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Edge fades */}
            <div style={{ position: 'absolute', inset: '0', left: 0, width: '10%', background: 'linear-gradient(to right, #050505, transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: '0', right: 0, width: '10%', background: 'linear-gradient(to left, #050505, transparent)', pointerEvents: 'none', left: 'auto' }} />
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px 80px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 64 }} />

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 65%), linear-gradient(180deg, #141414 0%, #0D0D0D 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              padding: '64px 40px',
              textAlign: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>GET STARTED</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.92)', marginBottom: 16 }}>
              Ready to test your edge?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.40)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.65 }}>
              Most strategies look great on paper. Find out if yours survives 20 years of real market conditions.
            </p>
            <button
              onClick={handleCTA}
              style={{
                background: '#6366F1',
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 600,
                fontSize: 14,
                padding: '13px 32px',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Start Building Now <ArrowRight size={16} />
            </button>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 40px' }}>
          <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, background: '#6366F1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={14} color="white" strokeWidth={2} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.04em' }}>ROOKNOMICS © 2024</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'Learning Hub', view: 'learn' },
                { label: 'Strategy Builder', view: 'builder' },
                { label: 'Demo Results', view: 'results' },
              ].map(link => (
                <button
                  key={link.label}
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (!token) setShowAuth(true);
                    else setCurrentView(link.view);
                  }}
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 150ms' }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.70)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.30)'; }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
