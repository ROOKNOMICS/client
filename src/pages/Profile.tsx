import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/lib/animations';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Clock,
  Filter,
  Search,
  Trash2,
  Eye,
  ChevronRight,
  X,
} from 'lucide-react';
import type { RootState } from '@/store';
import { getUserBacktests, deleteBacktest } from '@/store/backtestSlice';
import type { AppDispatch } from '../store/index';

interface BacktestItem {
  _id: string;
  name: string;
  symbol: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  results: {
    verdict: {
      type: 'OUTPERFORM' | 'UNDERPERFORM' | 'NEUTRAL';
      title: string;
      desc: string;
    };
    benchmark: {
      strategy: number;
      benchmark: number;
      finalValue: number;
    };
  };
  createdAt: string;
}

const ProfilePage = ({ setCurrentView }: { setCurrentView: (view: string) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userBacktests, backtestsLoading, backtestsError, pagination } = useSelector((state: RootState) => state.backtest);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getUserBacktests({ 
      page: currentPage, 
      limit: 10,
      symbol: filterSymbol || undefined,
      verdict: filterVerdict || undefined
    }));
  }, [dispatch, currentPage, filterSymbol, filterVerdict]);

  const handleDeleteBacktest = async (id: string) => {
    try {
      await dispatch(deleteBacktest(id)).unwrap();
      setShowDeleteDialog(null);
      // Refresh the list
      dispatch(getUserBacktests({ 
        page: currentPage, 
        limit: 10,
        symbol: filterSymbol || undefined,
        verdict: filterVerdict || undefined
      }));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete backtest');
    }
  };

  const handleViewBacktest = async (backtest: BacktestItem) => {
    setLoadingDetails(backtest._id);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/backtests/${backtest._id}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch backtest details');
      }

      const fullBacktestData = await response.json();
      
      // Store the backtest data in localStorage for the ResultsView to use
      localStorage.setItem('currentBacktestData', JSON.stringify(fullBacktestData.results));
      
      // Navigate to results view
      setCurrentView('results');
      
    } catch (error) {
      console.error('Failed to load backtest details:', error);
      alert('Failed to load backtest details');
    } finally {
      setLoadingDetails(null);
    }
  };

  const filteredBacktests = userBacktests.filter(backtest =>
    backtest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    backtest.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerdictColor = (type: string) => {
    switch (type) {
      case 'OUTPERFORM': return 'text-emerald-600';
      case 'UNDERPERFORM': return 'text-rose-600';
      default: return 'text-amber-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 40px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setCurrentView('landing')}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.70)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 5,
                transition: 'color 150ms ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.color = 'rgba(255,255,255,0.95)'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.color = 'rgba(255,255,255,0.70)'; }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>
              My Backtest History
            </h1>
          </div>
          
          {pagination && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>
              {pagination.totalBacktests} backtest{pagination.totalBacktests !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: 72, maxWidth: 1440, margin: '0 auto', padding: '0 40px' }}>
        {/* Filters */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ marginBottom: 32 }}>
          <div style={{
            background: 'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
            padding: 20, marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Filter size={15} color="#818CF8" strokeWidth={1.5} />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.80)' }}>Filters</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.40)' }} />
                <input
                  type="text"
                  placeholder="Search by name or symbol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 12px 8px 36px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.90)', fontSize: 12,
                    outline: 'none',
                  }}
                />
              </div>
              
              <input
                type="text"
                placeholder="Filter by symbol..."
                value={filterSymbol}
                onChange={(e) => setFilterSymbol(e.target.value.toUpperCase())}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.90)', fontSize: 12,
                  outline: 'none',
                }}
              />
              
              <select
                value={filterVerdict}
                onChange={(e) => setFilterVerdict(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.90)', fontSize: 12,
                  outline: 'none',
                }}
              >
                <option value="">All Verdicts</option>
                <option value="OUTPERFORM">Outperform</option>
                <option value="UNDERPERFORM">Underperform</option>
                <option value="NEUTRAL">Neutral</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Backtest List */}
        {backtestsLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: 40, height: 40, margin: '0 auto 16px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14 }}>Loading your backtests...</p>
          </div>
        ) : backtestsError ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: '#F43F5E', fontSize: 14 }}>{backtestsError}</p>
          </div>
        ) : filteredBacktests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <BarChart3 size={48} color="rgba(255,255,255,0.20)" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14 }}>
              {searchTerm || filterSymbol || filterVerdict ? 'No backtests match your filters' : 'No backtests yet. Run your first backtest to see it here!'}
            </p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredBacktests.map((backtest: BacktestItem) => (
              <motion.div key={backtest._id} variants={fadeUp} style={{
                background: 'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
                padding: 20, display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color 150ms ease', cursor: 'pointer',
              }}
                onMouseEnter={(e) => { (e.currentTarget).style.borderColor = 'rgba(99,102,241,0.25)'; }}
                onMouseLeave={(e) => { (e.currentTarget).style.borderColor = 'rgba(255,255,255,0.06)'; }}
              >
                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: backtest.results.verdict.type === 'OUTPERFORM' ? 'rgba(16,185,129,0.1)' :
                             backtest.results.verdict.type === 'UNDERPERFORM' ? 'rgba(244,63,94,0.1)' :
                             'rgba(245,158,11,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {backtest.results.verdict.type === 'OUTPERFORM' ? (
                    <TrendingUp size={20} color="#10B981" />
                  ) : backtest.results.verdict.type === 'UNDERPERFORM' ? (
                    <TrendingDown size={20} color="#F43F5E" />
                  ) : (
                    <Activity size={20} color="#F59E0B" />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>
                      {backtest.name}
                    </h3>
                    <span style={{
                      fontSize: 10, fontWeight: 500, padding: '2px 6px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.60)',
                    }}>
                      {backtest.symbol}
                    </span>
                    <span className={`text-xs font-semibold ${getVerdictColor(backtest.results.verdict.type)}`}>
                      {backtest.results.verdict.type}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.50)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} />
                      {formatDate(backtest.startDate)} - {formatDate(backtest.endDate)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <DollarSign size={12} />
                      ${backtest.initialCapital.toLocaleString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} />
                      {formatDate(backtest.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Results */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: backtest.results.benchmark.strategy >= 0 ? '#10B981' : '#F43F5E' }}>
                    {backtest.results.benchmark.strategy >= 0 ? '+' : ''}{backtest.results.benchmark.strategy.toFixed(2)}%
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.50)' }}>
                    vs {backtest.results.benchmark.benchmark.toFixed(2)}% benchmark
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleViewBacktest(backtest)}
                    disabled={loadingDetails === backtest._id}
                    style={{
                      padding: '6px 8px', borderRadius: 5,
                      background: loadingDetails === backtest._id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)', 
                      border: loadingDetails === backtest._id ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.10)',
                      color: loadingDetails === backtest._id ? '#6366F1' : 'rgba(255,255,255,0.70)', 
                      cursor: loadingDetails === backtest._id ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => { 
                      if (loadingDetails !== backtest._id) {
                        (e.currentTarget).style.background = 'rgba(255,255,255,0.08)'; 
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (loadingDetails !== backtest._id) {
                        (e.currentTarget).style.background = 'rgba(255,255,255,0.06)'; 
                      }
                    }}
                  >
                    {loadingDetails === backtest._id ? (
                      <div style={{ width: 10, height: 10, border: '1.5px solid rgba(99,102,241,0.3)', borderTop: '1.5px solid #6366F1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <Eye size={12} />
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteDialog(backtest._id)}
                    style={{
                      padding: '6px 8px', borderRadius: 5,
                      background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)',
                      color: '#F43F5E', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(244,63,94,0.15)'; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(244,63,94,0.1)'; }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px', borderRadius: 6,
                background: currentPage === 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                color: currentPage === 1 ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.70)',
                border: '1px solid rgba(255,255,255,0.10)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: 12,
              }}
            >
              Previous
            </button>
            
            <span style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>
              Page {currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={currentPage === pagination.totalPages}
              style={{
                padding: '8px 12px', borderRadius: 6,
                background: currentPage === pagination.totalPages ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)',
                color: currentPage === pagination.totalPages ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.70)',
                border: '1px solid rgba(255,255,255,0.10)',
                cursor: currentPage === pagination.totalPages ? 'not-allowed' : 'pointer',
                fontSize: 12,
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'linear-gradient(180deg,#141414 0%,#0D0D0D 100%)',
            border: '1px solid rgba(255,255,255,0.10)', borderRadius: 12,
            padding: 24, width: '90%', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.40)',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.90)' }}>
              Delete Backtest
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: 13, color: 'rgba(255,255,255,0.60)', lineHeight: 1.4 }}>
              Are you sure you want to delete this backtest? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowDeleteDialog(null)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.70)',
                  border: '1px solid rgba(255,255,255,0.10)', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBacktest(showDeleteDialog)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 6,
                  background: '#F43F5E', color: 'rgba(255,255,255,0.95)',
                  border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
