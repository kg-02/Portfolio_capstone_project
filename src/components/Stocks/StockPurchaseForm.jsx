import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import { ArrowLeft, Info } from 'lucide-react';
import { playClickSound } from '../utils/sound';
 
import { useTheme } from '../context/ThemeContext';
 
const StockPurchaseForm = ({ stock, onSubmit, onBack, isSubmitting = false, initialValues = null }) => {
  const { colors, isDarkMode } = useTheme();
  const isEditMode = !!initialValues;
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('line'); // 'line' or 'candle'
 
  // Initialize state with initialValues if in Edit mode, otherwise defaults
  const [quantity, setQuantity] = useState(initialValues?.quantity || 1);
  const [price, setPrice] = useState(initialValues?.purchasePrice || stock?.currentPrice || 0);
  const [date, setDate] = useState(initialValues?.purchaseDate || new Date().toISOString().split('T')[0]);
 
  // --- NewsAPI integration state ---
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [newsCollapsed, setNewsCollapsed] = useState(false); // <-- new collapse state
 
  useEffect(() => {
    // Enhanced News fetch using NewsAPI /everything with fallbacks and debug logs.
    // Your provided API key is embedded here.
    const apiKey = 'd5b014937f344e958ce65b0c0c57f69f';
    if (!apiKey || !stock?.companyName) {
      setNews([]);
      return;
    }
 
    const controller = new AbortController();
    const signal = controller.signal;
 
    const fetchNews = async () => {
      setNewsLoading(true);
      setNewsError(null);
 
      try {
        // Build a robust OR query: exact company name, symbol, and common short form variations.
        const parts = [];
        const safeCompany = (stock.companyName || '').trim();
        if (safeCompany) parts.push(`"${safeCompany}"`);
        if (stock.symbol) parts.push(stock.symbol);
        // try an uppercase acronym (common), and a short name (split first two words)
        const acronym = (stock.symbol || '').toUpperCase();
        if (acronym) parts.push(acronym);
        const short = safeCompany.split(' ').slice(0, 2).join(' ');
        if (short && short.length < safeCompany.length) parts.push(short);
 
        // remove duplicates
        const uniqueParts = Array.from(new Set(parts)).filter(Boolean);
        const q = encodeURIComponent(uniqueParts.join(' OR '));
 
        // Use the broader 'everything' endpoint, language=en, sort by most recent
        const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;
 
        console.debug('NewsAPI request URL:', url);
        const res = await fetch(url, { signal });
 
        // Debug network status:
        console.debug('NewsAPI response status:', res.status, res.statusText);
 
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`NewsAPI error: ${res.status} ${text}`);
        }
 
        const json = await res.json();
        console.debug('NewsAPI payload:', json);
 
        if (json.status !== 'ok') {
          throw new Error('NewsAPI returned non-ok status: ' + JSON.stringify(json));
        }
 
        // If there are zero articles, try a relaxed query (company name only, no quotes)
        if ((!json.articles || json.articles.length === 0) && safeCompany && !safeCompany.includes('"')) {
          console.debug('No articles — retrying with relaxed query (company name without quotes)');
          const q2 = encodeURIComponent(safeCompany);
          const url2 = `https://newsapi.org/v2/everything?q=${q2}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;
          console.debug('Retry URL:', url2);
          const res2 = await fetch(url2, { signal });
          if (res2.ok) {
            const json2 = await res2.json();
            console.debug('Retry payload:', json2);
            if (json2.status === 'ok' && json2.articles && json2.articles.length > 0) {
              setNews(json2.articles);
              return;
            }
          }
        }
 
        setNews(json.articles || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Failed to load news:', err);
          // show explicit error so you can see it in UI
          setNewsError(err.message || 'Could not load news');
          setNews([]);
        }
      } finally {
        setNewsLoading(false);
      }
    };
 
    fetchNews();
 
    return () => controller.abort();
  }, [stock?.companyName, stock?.symbol]);
 
  const chartData = stock?.chartData?.[timeframe] || [];
  const latestPrice = stock?.currentPrice || 0;
  const isPositive = stock?.changePercent >= 0;
 
  const handleSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    if (quantity > 0 && price > 0) {
      onSubmit({
        // Keep existing ID if editing, else generate new
        stockId: initialValues?.stockId || Date.now().toString(),
        symbol: stock.symbol,
        companyName: stock.companyName,
        quantity: Number(quantity),
        purchasePrice: Number(price),
        currentPrice: Number(latestPrice), // In real app, this would be fetched live
        purchaseDate: date,
      });
    }
  };
 
  const styles = {
    container: {
      backgroundColor: colors.background,
      minHeight: '100vh',
      padding: '24px',
      fontFamily: '"Roboto", sans-serif',
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      color: colors.textPrimary,
      marginBottom: '24px',
      padding: 0,
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '32px',
    },
    logo: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      objectFit: 'contain',
      border: `1px solid ${colors.border}`,
      padding: '4px',
    },
    priceLarge: {
      fontSize: '32px',
      fontWeight: '600',
      color: colors.textPrimary,
    },
    change: {
      fontSize: '16px',
      fontWeight: '500',
      color: isPositive ? colors.positive : colors.negative,
      marginTop: '4px',
    },
    chartContainer: {
      height: '400px',
      marginBottom: '32px',
    },
    tabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    tab: (active) => ({
      padding: '6px 16px',
      borderRadius: '16px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: active ? (isDarkMode ? 'rgba(0, 208, 156, 0.2)' : '#e5fbf5') : 'transparent',
      color: active ? colors.positive : colors.textSecondary,
      transition: 'all 0.2s',
    }),
    chartTypeTabs: {
      display: 'flex',
      gap: '8px',
      backgroundColor: colors.background,
      borderRadius: '8px',
      padding: '4px',
    },
    chartTypeTab: (active) => ({
      padding: '6px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      backgroundColor: active ? colors.cardBackground : 'transparent',
      color: active ? colors.textPrimary : colors.textSecondary,
      transition: 'all 0.2s',
      boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    }),
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    fundamentalsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '32px',
    },
    fundamentalItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    fundLabel: {
      fontSize: '12px',
      color: colors.textSecondary,
    },
    fundValue: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.textPrimary,
    },
    buyPanel: {
      position: 'sticky',
      top: '24px',
      height: 'fit-content',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '16px',
      fontSize: '18px',
      fontWeight: '500',
      borderRadius: '8px',
      border: `1px solid ${colors.border}`,
      outline: 'none',
      color: colors.textPrimary,
      backgroundColor: colors.inputBackground || 'transparent',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: colors.primary,
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      opacity: isSubmitting ? 0.7 : 1,
      marginTop: '12px',
    },
    newsToggleButton: { // style for the collapsible toggle
      marginLeft: '12px',
      padding: '6px 10px',
      borderRadius: '8px',
      background: 'transparent',
      border: `1px solid ${colors.border}`,
      color: colors.textPrimary,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 500,
    }
  };
 
  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button onClick={() => { playClickSound(); onBack(); }} style={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
 
        <div style={styles.mainGrid}>
          {/* Left Column: Details */}
          <div style={styles.card}>
            <div style={styles.header}>
              <img
                src={stock.logoUrl}
                alt={stock.symbol}
                style={styles.logo}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=' + stock.symbol[0] }}
              />
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', color: colors.textPrimary }}>{stock.companyName}</h1>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={styles.priceLarge}>₹{latestPrice}</span>
                  <span style={styles.change}>
                    {isPositive ? '+' : ''}{stock.changePercent}% (1D)
                  </span>
                </div>
              </div>
            </div>
 
            <div style={styles.chartContainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={styles.tabs}>
                  {['1D', '1W', '1M'].map(t => (
                    <button
                      key={t}
                      style={styles.tab(timeframe === t)}
                      onClick={() => { playClickSound(); setTimeframe(t); }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div style={styles.chartTypeTabs}>
                  <button
                    style={styles.chartTypeTab(chartType === 'line')}
                    onClick={() => { playClickSound(); setChartType('line'); }}
                  >
                    Line
                  </button>
                  <button
                    style={styles.chartTypeTab(chartType === 'candle')}
                    onClick={() => { playClickSound(); setChartType('candle'); }}
                  >
                    Candle
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                {chartData.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colors.textSecondary }}>
                    No chart data available
                  </div>
                ) : chartType === 'line' ? (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: colors.cardBackground }}
                      itemStyle={{ color: colors.textPrimary }}
                      labelStyle={{ color: colors.textSecondary }}
                      formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={colors.primary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVal)"
                    />
                  </AreaChart>
                ) : (
                  <ComposedChart data={chartData.map((d) => {
                    const baseValue = d.value;
                    const volatility = baseValue * 0.015;
                    const open = baseValue + (Math.random() - 0.5) * volatility;
                    const close = baseValue + (Math.random() - 0.5) * volatility;
                    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
                    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
                    return { ...d, open, high, low, close };
                  })}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: colors.cardBackground }}
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div style={{ backgroundColor: colors.cardBackground, padding: '8px 12px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                              <p style={{ margin: '4px 0', fontSize: '12px', color: colors.textSecondary }}>{data.time}</p>
                              <p style={{ margin: '4px 0', fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>O: ₹{data.open?.toFixed(2)}</p>
                              <p style={{ margin: '4px 0', fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>H: ₹{data.high?.toFixed(2)}</p>
                              <p style={{ margin: '4px 0', fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>L: ₹{data.low?.toFixed(2)}</p>
                              <p style={{ margin: '4px 0', fontSize: '13px', fontWeight: '500', color: colors.textPrimary }}>C: ₹{data.close?.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="high"
                      shape={(props) => {
                        const { x, y, width, payload } = props;
                        if (!payload) return null;
 
                        const { open, high, low, close } = payload;
                        const isGreen = close >= open;
                        const color = isGreen ? colors.positive : colors.negative;
 
                        // Calculate positions
                        const chartHeight = 400;
                        const dataMin = Math.min(...chartData.map((d) => d.value * 0.98));
                        const dataMax = Math.max(...chartData.map((d) => d.value * 1.02));
                        const range = dataMax - dataMin;
 
                        const getY = (value) => {
                          return chartHeight - ((value - dataMin) / range) * chartHeight;
                        };
 
                        const highY = getY(high);
                        const lowY = getY(low);
                        const openY = getY(open);
                        const closeY = getY(close);
 
                        const bodyTop = Math.min(openY, closeY);
                        const bodyHeight = Math.abs(closeY - openY);
                        const candleWidth = Math.max(width * 0.6, 2);
                        const wickX = x + width / 2;
 
                        return (
                          <g>
                            {/* Upper wick */}
                            <line
                              x1={wickX}
                              y1={highY}
                              x2={wickX}
                              y2={Math.min(openY, closeY)}
                              stroke={color}
                              strokeWidth={1.5}
                            />
                            {/* Lower wick */}
                            <line
                              x1={wickX}
                              y1={Math.max(openY, closeY)}
                              x2={wickX}
                              y2={lowY}
                              stroke={color}
                              strokeWidth={1.5}
                            />
                            {/* Candle body */}
                            <rect
                              x={x + (width - candleWidth) / 2}
                              y={bodyTop}
                              width={candleWidth}
                              height={Math.max(bodyHeight, 1)}
                              fill={color}
                              stroke={color}
                              strokeWidth={1}
                            />
                          </g>
                        );
                      }}
                    />
                  </ComposedChart>
                )}
              </ResponsiveContainer>
            </div>
 
            <div>
              <h3 style={styles.sectionTitle}><Info size={18} /> About {stock.companyName}</h3>
              <p style={{ color: colors.textPrimary, lineHeight: '1.6', fontSize: '14px' }}>
                {stock.about}
              </p>
 
              {/* News block injected into About with collapsible toggle */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: '8px 0', color: colors.textPrimary, fontSize: '15px' }}>Latest news</h4>
 
                  {/* Toggle button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      aria-expanded={!newsCollapsed}
                      onClick={() => { playClickSound(); setNewsCollapsed(prev => !prev); }}
                      style={styles.newsToggleButton}
                      title={newsCollapsed ? 'Show news' : 'Hide news'}
                    >
                      {newsCollapsed ? 'Show' : 'Hide'}
                    </button>
                  </div>
                </div>
 
                {/* When collapsed show a short one-line summary */}
                {newsCollapsed ? (
                  <div style={{ color: colors.textSecondary, fontSize: '13px', marginTop: 8 }}>
                    {newsLoading ? 'Loading news...' : (newsError ? newsError : `Show article${news.length !== 1 ? 's' : ''}. Click Show to expand.`)}
                  </div>
                ) : (
                  <>
                    {newsLoading && <p style={{ color: colors.textSecondary, fontSize: '13px' }}>Loading news...</p>}
                    {newsError && <p style={{ color: colors.textSecondary, fontSize: '13px' }}>{newsError}</p>}
 
                    {!newsLoading && !newsError && news.length === 0 && (
                      <p style={{ color: colors.textSecondary, fontSize: '13px' }}>No recent news found for this company.</p>
                    )}
 
                    <ul style={{ paddingLeft: '18px', marginTop: '8px' }}>
                      {news.map((a, idx) => (
                        <li key={idx} style={{ marginBottom: '8px', fontSize: '14px', lineHeight: '1.4' }}>
                          <a
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: colors.primary, textDecoration: 'none', fontWeight: 500 }}
                            onClick={() => playClickSound()}
                          >
                            {a.title}
                          </a>
                          <div style={{ fontSize: '12px', color: colors.textSecondary }}>
                            {a.source?.name} • {a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ''}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
 
          {/* Right Column: Buy/Edit Panel */}
          <div style={{ ...styles.card, ...styles.buyPanel }}>
            <h3 style={{ ...styles.sectionTitle, marginTop: 0 }}>
              {isEditMode ? `Edit ${stock.symbol}` : `Buy ${stock.symbol}`}
            </h3>
 
            <form onSubmit={handleSubmit}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Quantity (Shares)</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={styles.input}
                />
              </div>
 
              <div style={styles.inputGroup}>
                <label style={styles.label}>Price (₹)</label>
                <input
                  type="number"
                  step="0.05"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={styles.input}
                />
              </div>
 
              <div style={styles.inputGroup}>
  <label style={{ ...styles.label, color: colors.textPrimary }}>Date</label>

  <input
    type="date"
    value={date}
    disabled
    style={{
      ...styles.input,
      fontSize: "16px",
      backgroundColor: colors.hover,      // grey background
      border: `1px solid ${colors.border}`,
      color: colors.textSecondary,
      cursor: "not-allowed",
    }}
  />
</div>
 
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '20px 0',
                padding: '16px',
                backgroundColor: colors.background,
                borderRadius: '8px'
              }}>
                <span style={{ color: colors.textSecondary }}>Total Amount</span>
                <span style={{ fontWeight: '600', color: colors.textPrimary }}>
                  ₹{(quantity * price).toLocaleString('en-IN')}
                </span>
              </div>
 
              <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : (isEditMode ? 'UPDATE HOLDING' : 'BUY')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
 
StockPurchaseForm.propTypes = {
  stock: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  initialValues: PropTypes.shape({
    stockId: PropTypes.string,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchasePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    purchaseDate: PropTypes.string,
  }),
};
 
export default StockPurchaseForm;
 