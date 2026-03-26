import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ExternalLink,
  TrendingUp, TrendingDown, Activity, GitBranch, Layers, Star,
  BarChart2, Maximize2, RefreshCw, Shield, Target, Sliders, Scale,
  Zap, AlertTriangle, Percent, RotateCcw, Rocket, ArrowLeftRight,
  Clock, Calendar, BarChart, Sun, Navigation, PieChart, Package,
  Award, DollarSign, Droplets, Brain, AlertCircle,
} from 'lucide-react';
import { useLearnSearch } from '@/hooks/useLearnSearch';
import { GlossaryTerm, GlossaryCategory } from '@/types/learn';
import { glossaryTerms } from '@/data/glossary';

// ── Icon map ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, TrendingDown, Activity, GitBranch, Layers, Star,
  BarChart2, Maximize2, RefreshCw, Shield, Target, Sliders, Scale,
  Zap, AlertTriangle, Percent, RotateCcw, Rocket, ArrowLeftRight,
  Clock, Calendar, BarChart, Sun, Navigation, PieChart, Package,
  Award, DollarSign, Droplets, Brain, AlertCircle, X,
};

// ── Dark category colours ─────────────────────────────────────────────────────
const CAT_COLORS: Record<GlossaryCategory, { bg: string; iconColor: string; pillBg: string; pillColor: string; pillBorder: string }> = {
  indicator: { bg: 'rgba(99,102,241,0.12)', iconColor: '#818CF8', pillBg: 'rgba(99,102,241,0.10)', pillColor: '#818CF8', pillBorder: 'rgba(99,102,241,0.22)' },
  risk:      { bg: 'rgba(244,63,94,0.10)',  iconColor: '#F87171', pillBg: 'rgba(244,63,94,0.08)',  pillColor: '#F87171', pillBorder: 'rgba(244,63,94,0.22)' },
  strategy:  { bg: 'rgba(16,185,129,0.10)', iconColor: '#10B981', pillBg: 'rgba(16,185,129,0.08)', pillColor: '#10B981', pillBorder: 'rgba(16,185,129,0.22)' },
  market:    { bg: 'rgba(56,189,248,0.10)', iconColor: '#38BDF8', pillBg: 'rgba(56,189,248,0.08)', pillColor: '#38BDF8', pillBorder: 'rgba(56,189,248,0.22)' },
  metric:    { bg: 'rgba(251,191,36,0.10)', iconColor: '#FBBF24', pillBg: 'rgba(251,191,36,0.08)', pillColor: '#FBBF24', pillBorder: 'rgba(251,191,36,0.22)' },
  psychology:{ bg: 'rgba(167,139,250,0.10)',iconColor: '#A78BFA', pillBg: 'rgba(167,139,250,0.08)',pillColor: '#A78BFA', pillBorder: 'rgba(167,139,250,0.22)' },
};

const DIFF_DARK: Record<string, { bg: string; color: string; border: string }> = {
  beginner:     { bg: 'rgba(16,185,129,0.08)',  color: '#10B981', border: 'rgba(16,185,129,0.22)' },
  intermediate: { bg: 'rgba(251,191,36,0.08)',  color: '#FBBF24', border: 'rgba(251,191,36,0.22)' },
  advanced:     { bg: 'rgba(244,63,94,0.08)',   color: '#F87171', border: 'rgba(244,63,94,0.22)' },
};

const CATEGORY_CHIPS = [
  { label: 'All', value: '' },
  { label: 'Indicators', value: 'indicator' },
  { label: 'Risk', value: 'risk' },
  { label: 'Strategies', value: 'strategy' },
  { label: 'Markets', value: 'market' },
  { label: 'Metrics', value: 'metric' },
  { label: 'Psychology', value: 'psychology' },
];

function getCategoryCount(cat: string) {
  if (!cat) return glossaryTerms.length;
  return glossaryTerms.filter((t) => t.category === cat).length;
}

// ── Animation variants ────────────────────────────────────────────────────────
const pageVariant = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };
const cardGrid = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const cardItem = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const dropDown = { hidden: { opacity: 0, y: -8, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } }, exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.1 } } };
const wikiCard = { hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };

// ── Dark Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: 'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 20 }}>
      <style>{`
        @keyframes shimmer-dark { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .sk-dark { background:linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%);background-size:200% 100%;animation:shimmer-dark 1.5s infinite; border-radius: 4px; }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div className="sk-dark" style={{ width: 40, height: 40, borderRadius: 8 }} />
        <div className="sk-dark" style={{ width: 72, height: 18 }} />
      </div>
      <div className="sk-dark" style={{ height: 16, width: '70%', marginBottom: 10 }} />
      <div className="sk-dark" style={{ height: 13, width: '100%', marginBottom: 6 }} />
      <div className="sk-dark" style={{ height: 13, width: '85%', marginBottom: 6 }} />
      <div className="sk-dark" style={{ height: 13, width: '65%', marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        {[56, 48, 60].map((w, i) => <div key={i} className="sk-dark" style={{ height: 20, width: w }} />)}
      </div>
    </div>
  );
}

// ── Concept Card ──────────────────────────────────────────────────────────────
function ConceptCard({ term, onClick }: { term: GlossaryTerm; onClick: () => void }) {
  const colors = CAT_COLORS[term.category];
  const diff = DIFF_DARK[term.difficulty];
  const IconComp = ICON_MAP[term.icon] ?? TrendingUp;
  const firstTwo = term.definition.split('. ').slice(0, 2).join('. ') + '.';

  return (
    <motion.div
      variants={cardItem}
      onClick={onClick}
      style={{
        background: 'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: 20,
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.borderColor = `${colors.pillBorder}`;
        e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.08), 0 0 24px ${colors.pillBg}`;
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06)';
      }}
    >
      {/* Icon + badges row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: colors.bg }}>
          <IconComp size={18} color={colors.iconColor} strokeWidth={1.8} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: colors.pillBg, color: colors.pillColor, border: `1px solid ${colors.pillBorder}`, letterSpacing: '0.06em', textTransform: 'capitalize' }}>
            {term.category}
          </span>
          <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, letterSpacing: '0.06em', textTransform: 'capitalize' }}>
            {term.difficulty}
          </span>
        </div>
      </div>

      {/* Term name */}
      <div>
        <p style={{ fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>{term.term}</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', marginTop: 3 }}>{term.fullName}</p>
      </div>

      {/* Definition preview */}
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, flex: 1 }} className="line-clamp-3">{firstTwo}</p>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {term.tags.slice(0, 3).map((tag) => (
          <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', fontSize: 10, padding: '2px 8px', borderRadius: 3, border: '1px solid rgba(255,255,255,0.06)' }}>{tag}</span>
        ))}
      </div>

      {/* Read more row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ color: colors.pillColor, fontSize: 12, fontWeight: 500 }}>Read more →</span>
        <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
          <IconComp size={12} color={colors.iconColor} />
        </div>
      </div>
    </motion.div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  term, onClose, onNavigate, onNavigateToBuilder,
}: {
  term: GlossaryTerm;
  onClose: () => void;
  onNavigate: (t: GlossaryTerm) => void;
  onNavigateToBuilder: () => void;
}) {
  const colors = CAT_COLORS[term.category];
  const diff = DIFF_DARK[term.difficulty];
  const IconComp = ICON_MAP[term.icon] ?? TrendingUp;

  const relatedTerms = term.related
    .map((id) => glossaryTerms.find((t) => t.id === id))
    .filter(Boolean) as GlossaryTerm[];

  return (
    <>
      {/* Overlay */}
      <motion.div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 40 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        style={{
          position: 'fixed', right: 0, top: 0, height: '100%',
          width: '100%', maxWidth: 480,
          background: 'linear-gradient(180deg,#151515 0%,#0F0F0F 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          zIndex: 50,
          boxShadow: '-12px 0 60px rgba(0,0,0,0.60)',
          overflowY: 'auto',
        }}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, background: 'rgba(15,15,15,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: colors.bg }}>
                <IconComp size={16} color={colors.iconColor} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 16, color: 'rgba(255,255,255,0.90)' }}>{term.term}</span>
            </div>
            <button
              onClick={onClose}
              style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'rgba(255,255,255,0.50)' }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: colors.pillBg, color: colors.pillColor, border: `1px solid ${colors.pillBorder}`, letterSpacing: '0.06em', textTransform: 'capitalize' }}>
              {term.category}
            </span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 4, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, letterSpacing: '0.06em', textTransform: 'capitalize' }}>
              {term.difficulty}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* What is it */}
          <section>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>What Is It?</p>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, lineHeight: 1.75 }}>{term.definition}</p>
          </section>

          {/* How to use */}
          <section>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>How To Use It</p>
            <div style={{ background: colors.bg, borderLeft: `3px solid ${colors.pillColor}`, borderRadius: '0 8px 8px 0', padding: 16 }}>
              <p style={{ color: colors.pillColor, fontSize: 13, lineHeight: 1.65 }}>{term.howToUse}</p>
            </div>
          </section>

          {/* Example */}
          <section>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Example</p>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 16 }}>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.65, fontFamily: 'JetBrains Mono, monospace' }}>{term.example}</p>
            </div>
          </section>

          {/* Related concepts */}
          {relatedTerms.length > 0 && (
            <section>
              <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Related Concepts</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {relatedTerms.map((rt) => {
                  const rc = CAT_COLORS[rt.category];
                  const RIcon = ICON_MAP[rt.icon] ?? TrendingUp;
                  const snippet = rt.definition.split(' ').slice(0, 8).join(' ') + '…';
                  return (
                    <button
                      key={rt.id}
                      onClick={() => onNavigate(rt)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 8, padding: '10px 12px',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'border-color 150ms ease',
                      }}
                      onMouseEnter={(e: any) => e.currentTarget.style.borderColor = rc.pillBorder}
                      onMouseLeave={(e: any) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: rc.bg }}>
                        <RIcon size={13} color={rc.iconColor} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.80)' }}>{rt.term}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{snippet}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tags */}
          <section>
            <p style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>Tags</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {term.tags.map((tag) => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', fontSize: 11, padding: '3px 10px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.07)' }}>{tag}</span>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </>
  );
}

// ── Main Learn page ──────────────────────────────────────────────────────────
interface LearnPageProps {
  setCurrentView: (v: string) => void;
}

export default function LearnPage({ setCurrentView }: LearnPageProps) {
  const {
    query, setQuery,
    activeCategory, setActiveCategory,
    results, suggestions,
    isWikiLoading, wikiResult, wikiError,
    selectedTerm, setSelectedTerm,
    totalCount, filteredCount,
  } = useLearnSearch();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSuggestionClick(s: string) {
    setQuery(s);
    setShowSuggestions(false);
  }

  function highlightMatch(text: string) {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: '#818CF8', fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  }

  const hasResults = results.length > 0;
  const showWikiLoading = isWikiLoading && !hasResults;
  const showWikiResult = !isWikiLoading && wikiResult && !hasResults;
  const showError = !isWikiLoading && !wikiResult && wikiError && !hasResults;

  const looselyRelated = wikiResult
    ? glossaryTerms
      .filter((t) =>
        t.tags.some((tag) => query.toLowerCase().split(' ').some((w) => tag.includes(w))) ||
        t.definition.toLowerCase().includes(query.toLowerCase().split(' ')[0])
      )
      .slice(0, 3)
    : [];

  return (
    <motion.div
      style={{ maxWidth: 1440, margin: '0 auto', padding: '40px 40px 60px', background: '#050505', minHeight: '100vh' }}
      variants={pageVariant}
      initial="hidden"
      animate="visible"
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>KNOWLEDGE BASE</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.90)', marginBottom: 4 }}>Learn</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)' }}>
            Search any market concept, indicator, or strategy — plain English explanations
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: 'rgba(99,102,241,0.10)', color: '#818CF8', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(99,102,241,0.18)' }}>
            {totalCount} concepts
          </span>
          {filteredCount !== totalCount && (
            <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
              {filteredCount} showing
            </span>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 8,
          padding: '11px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          transition: 'border-color 150ms ease',
        }}>
          <Search size={15} color="rgba(255,255,255,0.30)" />
          <input
            ref={inputRef}
            style={{ background: 'transparent', color: 'rgba(255,255,255,0.80)', outline: 'none', width: '100%', fontSize: 13, fontFamily: 'Inter, sans-serif' }}
            placeholder="Search RSI, drawdown, momentum..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowSuggestions(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Autocomplete */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              ref={dropdownRef}
              variants={dropDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
                background: 'linear-gradient(180deg,#1A1A1A 0%,#141414 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8, boxShadow: '0 12px 32px rgba(0,0,0,0.50)',
                zIndex: 50, overflow: 'hidden',
              }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  style={{
                    width: '100%', padding: '11px 16px',
                    display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                    background: 'none', border: 'none', cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    transition: 'background 120ms ease',
                  }}
                  onMouseEnter={(e: any) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e: any) => e.currentTarget.style.background = 'none'}
                >
                  <Search size={12} color="rgba(255,255,255,0.20)" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>{highlightMatch(s)}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Category chips ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = activeCategory === chip.value;
          const count = getCategoryCount(chip.value);
          return (
            <button
              key={chip.value}
              onClick={() => setActiveCategory(chip.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 5, fontSize: 12, fontWeight: 500,
                cursor: 'pointer',
                background: isActive ? 'rgba(99,102,241,0.14)' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#818CF8' : 'rgba(255,255,255,0.45)',
                border: isActive ? '1px solid rgba(99,102,241,0.28)' : '1px solid rgba(255,255,255,0.07)',
                transition: 'all 150ms ease',
              }}
            >
              {chip.label}
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3,
                background: isActive ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.06)',
                color: isActive ? '#818CF8' : 'rgba(255,255,255,0.30)',
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Results label ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13 }}>
        {!query && !activeCategory ? (
          <>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>All financial concepts</span>
            <span style={{ background: 'rgba(99,102,241,0.10)', color: '#818CF8', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(99,102,241,0.18)' }}>
              {totalCount}
            </span>
          </>
        ) : showWikiLoading ? (
          <span style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg className="animate-spin w-4 h-4" style={{ color: '#818CF8' }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Searching wider knowledge base...
          </span>
        ) : query ? (
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>
            Showing results for: <span style={{ color: '#818CF8', fontWeight: 600 }}>"{query}"</span>
          </span>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500, textTransform: 'capitalize' }}>{activeCategory}</span>
        )}
      </div>

      {/* ── Main content ── */}

      {/* State 1 — glossary results */}
      {hasResults && (
        <motion.div
          key={activeCategory + query}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={cardGrid}
          initial="hidden"
          animate="visible"
        >
          {results.map((term) => (
            <ConceptCard key={term.id} term={term} onClick={() => setSelectedTerm(term)} />
          ))}
        </motion.div>
      )}

      {/* State 3 — Wikipedia loading */}
      {showWikiLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* State 2 — Wikipedia result */}
      {showWikiResult && wikiResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <motion.div
            variants={wikiCard}
            initial="hidden"
            animate="visible"
            style={{
              background: 'rgba(99,102,241,0.06)',
              border: '1px solid rgba(99,102,241,0.20)',
              borderRadius: 10, padding: 24,
              boxShadow: '0 0 40px rgba(99,102,241,0.06)',
            }}
          >
            {/* Wikipedia header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, background: '#818CF8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>W</span>
              </div>
              <span style={{ color: '#818CF8', fontSize: 12, fontWeight: 500 }}>From Wikipedia</span>
              <ExternalLink size={12} color="#818CF8" />
            </div>

            <div style={{ overflow: 'hidden' }}>
              {wikiResult.thumbnail && (
                <img
                  src={wikiResult.thumbnail}
                  alt={wikiResult.title}
                  style={{ float: 'right', marginLeft: 16, marginBottom: 8, width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}
                />
              )}
              <h2 style={{ fontSize: 20, fontWeight: 600, color: 'rgba(255,255,255,0.90)', marginBottom: 10 }}>{wikiResult.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.75 }}>{wikiResult.extract}</p>
            </div>

            <div style={{ clear: 'both', paddingTop: 16 }}>
              <a
                href={wikiResult.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#818CF8', fontWeight: 500, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}
              >
                Read full article on Wikipedia → <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>

          {looselyRelated.length > 0 && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', marginBottom: 14, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Related concepts in ROOKNOMICS:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {looselyRelated.map((term) => (
                  <ConceptCard key={term.id} term={term} onClick={() => setSelectedTerm(term)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* State 4 — no results + wiki error */}
      {showError && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Search size={40} color="rgba(255,255,255,0.10)" />
          </div>
          <h3 style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>No results for "{query}"</h3>
          <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 13, maxWidth: 280, margin: '0 auto 24px' }}>{wikiError}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {['RSI', 'Drawdown', 'Sharpe Ratio', 'Backtesting', 'Bull Market'].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.50)', fontSize: 12, fontWeight: 500,
                  padding: '6px 14px', borderRadius: 5, cursor: 'pointer',
                  transition: 'border-color 150ms ease, color 150ms ease',
                }}
                onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)'; e.currentTarget.style.color = '#818CF8'; }}
                onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.50)'; }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selectedTerm && (
          <DetailPanel
            key={selectedTerm.id}
            term={selectedTerm}
            onClose={() => setSelectedTerm(null)}
            onNavigate={(t) => setSelectedTerm(t)}
            onNavigateToBuilder={() => { setSelectedTerm(null); setCurrentView('builder'); }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
