import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  channel: string;
  currentPrice: number;
  originalPrice: number;
  verified: boolean;
  prices: Array<{ store: string; channel: string; price: number; date: string; verified: boolean }>;
  reviews: Array<{ user: string; rating: number; comment: string }>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'discount' | 'submit' | 'verify' | 'basket' | 'watchlist' | 'python'>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'danger' | 'info'; text: string } | null>(null);

  // Status indicators
  const [nestStatus, setNestStatus] = useState<boolean>(false);
  const [pythonStatus, setPythonStatus] = useState<boolean>(false);

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Discount Checker State
  const [claimedOriginal, setClaimedOriginal] = useState<number>(38000);
  const [currentPrice, setCurrentPrice] = useState<number>(31999);
  const [discountResult, setDiscountResult] = useState<any>(null);
  const [pythonPrediction, setPythonPrediction] = useState<any>(null);

  // Submission State
  const [submitStore, setSubmitStore] = useState('Daraz BD');
  const [submitPrice, setSubmitPrice] = useState<number>(32500);
  const [submitProductId, setSubmitProductId] = useState<number>(1);

  // Verification Feed State
  const [verificationItems, setVerificationItems] = useState<any[]>([]);

  // Basket State
  const [basketResult, setBasketResult] = useState<any>(null);

  // Watchlist State
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [targetPriceInput, setTargetPriceInput] = useState<number>(30000);

  // Python Scraper State
  const [scrapeStore, setScrapeStore] = useState('Daraz Bangladesh');
  const [scrapeQuery, setScrapeQuery] = useState('Samsung Galaxy');
  const [scrapeResult, setScrapeResult] = useState<any>(null);

  // Fetch health statuses & initial data
  useEffect(() => {
    checkHealth();
    fetchProducts();
    fetchVerification();
    fetchBasket();
    fetchWatchlist();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) setNestStatus(true);
    } catch {
      setNestStatus(false);
    }

    try {
      const res = await fetch('/api/python/status');
      const data = await res.json();
      if (data.status === 'healthy') setPythonStatus(true);
    } catch {
      setPythonStatus(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedChannel) params.append('channel', selectedChannel);
      if (verifiedOnly) params.append('verifiedOnly', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        if (data.length > 0 && !selectedProduct) {
          setSelectedProduct(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerification = async () => {
    try {
      const res = await fetch('/api/verification');
      if (res.ok) setVerificationItems(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBasket = async () => {
    try {
      const res = await fetch('/api/basket');
      if (res.ok) setBasketResult(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist');
      if (res.ok) setWatchlist(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleEvaluateDiscount = async () => {
    try {
      const res = await fetch('/api/discount-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimedOriginalPrice: claimedOriginal, currentPrice }),
      });
      if (res.ok) {
        setDiscountResult(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePythonPredict = async () => {
    try {
      const res = await fetch('/api/python/predict-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimedOriginalPrice: claimedOriginal, currentPrice }),
      });
      if (res.ok) {
        setPythonPrediction(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePriceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: submitProductId,
          store: submitStore,
          price: submitPrice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFlashMessage({ type: 'success', text: data.message });
        fetchVerification();
      } else {
        setFlashMessage({ type: 'danger', text: data.message });
      }
    } catch {
      setFlashMessage({ type: 'danger', text: 'Error connecting to submission service.' });
    }
  };

  const handleVote = async (id: string, decision: 'confirm' | 'dispute') => {
    try {
      const res = await fetch(`/api/verification/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      setFlashMessage({ type: 'info', text: data.message });
      fetchVerification();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 1, targetPrice: targetPriceInput }),
      });
      if (res.ok) {
        setFlashMessage({ type: 'success', text: 'Price alert armed!' });
        fetchWatchlist();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScrapeStore = async () => {
    try {
      const res = await fetch('/api/python/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store: scrapeStore, query: scrapeQuery }),
      });
      if (res.ok) {
        setScrapeResult(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand-logo" onClick={() => setActiveTab('catalog')}>
          <span>🛡️ BrandTruth</span>
          <span className="brand-badge">React + Vite + NestJS + Python</span>
        </div>

        <nav className="nav-links">
          <button className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
            🔍 Search & Compare (C1/C2)
          </button>
          <button className={`nav-item ${activeTab === 'discount' ? 'active' : ''}`} onClick={() => setActiveTab('discount')}>
            🏷️ Fake Discount Checker (C3)
          </button>
          <button className={`nav-item ${activeTab === 'submit' ? 'active' : ''}`} onClick={() => setActiveTab('submit')}>
            📝 Submit Price (C4)
          </button>
          <button className={`nav-item ${activeTab === 'verify' ? 'active' : ''}`} onClick={() => setActiveTab('verify')}>
            👥 Verification Feed (C5)
          </button>
          <button className={`nav-item ${activeTab === 'basket' ? 'active' : ''}`} onClick={() => setActiveTab('basket')}>
            🧺 Smart Basket (C9)
          </button>
          <button className={`nav-item ${activeTab === 'watchlist' ? 'active' : ''}`} onClick={() => setActiveTab('watchlist')}>
            🔔 Alerts (C6)
          </button>
          <button className={`nav-item ${activeTab === 'python' ? 'active' : ''}`} onClick={() => setActiveTab('python')}>
            🐍 Python Scraper & ML
          </button>
        </nav>

        <div className="runtime-status-bar">
          <div>
            <span className={`status-dot ${nestStatus ? 'online' : 'offline'}`} />
            <span>NestJS API</span>
          </div>
          <div>
            <span className={`status-dot ${pythonStatus ? 'online' : 'offline'}`} />
            <span>Python ML</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content-area">
        {flashMessage && (
          <div className={`alert-box alert-${flashMessage.type}`}>
            <span>ℹ️</span>
            <div>{flashMessage.text}</div>
            <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => setFlashMessage(null)}>✕</button>
          </div>
        )}

        {/* TAB 1: CATALOG & PRICE COMPARISON */}
        {activeTab === 'catalog' && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Unified Product Search & Price Comparison</h1>
              <p className="page-subtitle">Track verified prices across Bangladesh e-commerce, official brand stores, and retail markets.</p>
            </div>

            {/* Filter controls */}
            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Search Query</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by name, brand (e.g. Samsung, Rice)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Consumer Electronics">Consumer Electronics</option>
                    <option value="Packaged Groceries">Packaged Groceries</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Store Channel</label>
                  <select className="form-select" value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)}>
                    <option value="">All Channels</option>
                    <option value="online marketplace">Online Marketplace</option>
                    <option value="brand website">Brand Website</option>
                    <option value="physical shop">Physical Retail</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
                    Verified Only
                  </label>
                  <button className="btn btn-primary" onClick={fetchProducts} style={{ marginLeft: 'auto' }}>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid-2">
              <div className="grid-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card"
                    style={{
                      cursor: 'pointer',
                      border: selectedProduct?.id === p.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    }}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-channel">{p.brand}</span>
                      <span className={`badge ${p.verified ? 'badge-verified' : 'badge-warning'}`}>
                        {p.verified ? '✓ Verified' : 'Pending'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{p.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{p.category} • {p.channel}</p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span className="strike-price">৳{p.originalPrice?.toLocaleString()}</span>
                      <span className="price-display">৳{p.currentPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Detail & Price History Side Panel */}
              {selectedProduct && (
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <span className="badge badge-genuine" style={{ marginBottom: '0.5rem' }}>Detail & History Analysis</span>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedProduct.name}</h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{selectedProduct.brand} | Current Price: ৳{selectedProduct.currentPrice?.toLocaleString()}</p>
                    </div>
                    <span className="badge badge-verified" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                      Buy Timing: Good Buy
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: '#93c5fd' }}>Verified Multi-Store Observations</h4>
                  <div className="table-responsive">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Store</th>
                          <th>Channel</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProduct.prices.map((pr, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{pr.store}</td>
                            <td><span className="badge badge-channel">{pr.channel}</span></td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>৳{pr.price.toLocaleString()}</td>
                            <td>
                              <span className={`badge ${pr.verified ? 'badge-verified' : 'badge-warning'}`}>
                                {pr.verified ? 'Verified' : 'Unverified'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)' }}>
                    <h5 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Customer Value Reviews</h5>
                    {selectedProduct.reviews.slice(0, 2).map((r, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f59e0b', fontWeight: 700 }}>
                          <span>{'★'.repeat(r.rating)}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{r.user}</span>
                        </div>
                        <p style={{ marginTop: '0.2rem' }}>"{r.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FAKE DISCOUNT CHECKER */}
        {activeTab === 'discount' && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Fake Discount & Price Inflation Checker</h1>
              <p className="page-subtitle">Cross-reference promotional discounts against 30-day verified historical maximum prices.</p>
            </div>

            <div className="grid-2">
              <div className="glass-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Enter Promotion Parameters</h3>

                <div className="form-group">
                  <label className="form-label">Claimed Original / "Crossed-Out" Price (BDT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={claimedOriginal}
                    onChange={(e) => setClaimedOriginal(Number(e.target.value))}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>The inflated original price advertised on the banner.</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Advertised Sale Price (BDT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button className="btn btn-primary" onClick={handleEvaluateDiscount} style={{ flex: 1 }}>
                    Evaluate with NestJS Rule
                  </button>
                  <button className="btn btn-secondary" onClick={handlePythonPredict} style={{ flex: 1, borderColor: '#38bdf8' }}>
                    🐍 Predict with Python ML
                  </button>
                </div>
              </div>

              {/* Verdict Block */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Evaluation Verdict</h3>

                {discountResult ? (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <span className={`badge ${discountResult.verdict === 'Inflated' ? 'badge-inflated' : discountResult.verdict === 'Genuine' ? 'badge-genuine' : 'badge-warning'}`} style={{ fontSize: '1.1rem', padding: '0.4rem 1rem' }}>
                        {discountResult.verdict === 'Inflated' ? '⚠️ Inflated Fake Discount' : '✓ Genuine Discount'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{discountResult.message}</p>

                    <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Highest 30-Day Verified Price:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>৳{discountResult.highestVerifiedPrice?.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Observed On:</span>
                        <span>{discountResult.highestVerifiedDate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Channel:</span>
                        <span>{discountResult.highestVerifiedChannel}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Click "Evaluate" to compute verification bounds against historical records.</p>
                )}

                {/* Python ML Result */}
                {pythonPrediction && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem' }}>🐍</span>
                      <strong style={{ color: '#38bdf8' }}>Python Statistical Anomaly Model (Z-Score)</strong>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{pythonPrediction.explanation}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                      <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                        <span>Confidence: </span>
                        <strong>{(pythonPrediction.confidence_score * 100).toFixed(0)}%</strong>
                      </div>
                      <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>
                        <span>Z-Score: </span>
                        <strong>{pythonPrediction.z_score}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRICE SUBMISSION */}
        {activeTab === 'submit' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div className="page-title-banner">
              <h1 className="page-title">Submit Observed Price</h1>
              <p className="page-subtitle">Crowdsource verified prices. Enforces a 24-hour duplicate prevention guard.</p>
            </div>

            <div className="glass-card">
              <form onSubmit={handlePriceSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Product</label>
                  <select className="form-select" value={submitProductId} onChange={(e) => setSubmitProductId(Number(e.target.value))}>
                    <option value={1}>Samsung Galaxy M34 5G</option>
                    <option value={2}>Canon EOS R50 Mirrorless</option>
                    <option value={3}>Basmati Rice 5kg Pack</option>
                    <option value={4}>Pran Chips Family Pack</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Retailer / Store Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={submitStore}
                    onChange={(e) => setSubmitStore(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Observed Price (BDT)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={submitPrice}
                    onChange={(e) => setSubmitPrice(Number(e.target.value))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Proof of Purchase / Shelf Invoice (Mock)</label>
                  <input type="file" className="form-input" disabled style={{ opacity: 0.6 }} />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Receipt upload automatically OCR-extracted in production.</small>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Submit Price Observation
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: VERIFICATION FEED */}
        {activeTab === 'verify' && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Community Price Verification</h1>
              <p className="page-subtitle">Weighted peer-review queue. Submissions achieve verified status once confirm score reaches 3.0.</p>
            </div>

            <div className="grid-2">
              {verificationItems.map((item) => (
                <div key={item.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge badge-channel">{item.store}</span>
                    <span className={`badge ${item.status === 'Verified' ? 'badge-verified' : item.status === 'Disputed' ? 'badge-inflated' : 'badge-warning'}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{item.productName}</h3>
                  <div className="price-display" style={{ margin: '0.5rem 0 1rem 0' }}>৳{item.price?.toLocaleString()}</div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      <span>Verification Progress</span>
                      <span>{item.summary?.confirmScore || 2.3} / 3.0 points</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${Math.min(100, ((item.summary?.confirmScore || 2.3) / 3.0) * 100)}%` }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-success" onClick={() => handleVote(item.id, 'confirm')} style={{ flex: 1, fontSize: '0.85rem' }}>
                      ✓ Confirm (+1.4)
                    </button>
                    <button className="btn btn-danger" onClick={() => handleVote(item.id, 'dispute')} style={{ flex: 1, fontSize: '0.85rem' }}>
                      ✕ Dispute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SMART BASKET OPTIMIZER */}
        {activeTab === 'basket' && basketResult && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Smart Basket Optimizer (C9)</h1>
              <p className="page-subtitle">Compares buying all items at a single store versus splitting items across multiple stores with delivery fees.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                    Potential Savings: ৳{basketResult.savings?.toLocaleString()}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Splitting items across stores covers individual delivery charges and yields a net lower price.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-verified" style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}>
                    Optimal Plan: Split Across Stores
                  </span>
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="glass-card">
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#93c5fd' }}>Plan A: Single Store Order</h4>
                <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Best Single Store:</span>
                    <strong style={{ color: 'white' }}>{basketResult.singleStorePlan?.store}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '1rem' }}>
                    <span>Total Checkout:</span>
                    <span className="price-display" style={{ color: '#f87171' }}>৳{basketResult.singleStorePlan?.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#6ee7b7' }}>Plan B: Multi-Store Split Order</h4>
                <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Split Strategy:</span>
                    <strong style={{ color: '#6ee7b7' }}>Itemized Cheapest Verified Offer</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginTop: '1rem' }}>
                    <span>Total Checkout:</span>
                    <span className="price-display" style={{ color: '#34d399' }}>৳{basketResult.splitAcrossStoresPlan?.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WATCHLIST & ALERTS */}
        {activeTab === 'watchlist' && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Watchlist & Target Price Alerts</h1>
              <p className="page-subtitle">Automated periodic alert engine monitors prices and triggers notifications when prices cross below target.</p>
            </div>

            <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Add Target Price Alert</h4>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Target Price (BDT)"
                  value={targetPriceInput}
                  onChange={(e) => setTargetPriceInput(Number(e.target.value))}
                  style={{ maxWidth: '300px' }}
                />
                <button className="btn btn-primary" onClick={handleAddWatchlist}>
                  Arm Price Alert
                </button>
              </div>
            </div>

            <div className="glass-card">
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Target Price</th>
                      <th>Current Price</th>
                      <th>Alert Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.map((w) => (
                      <tr key={w.id}>
                        <td style={{ fontWeight: 600 }}>{w.productName}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>৳{w.targetPrice?.toLocaleString()}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>৳{w.currentPrice?.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${w.triggered ? 'badge-inflated' : 'badge-verified'}`}>
                            {w.triggered ? '🔔 Triggered (Target Crossed)' : '🛡️ Armed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PYTHON SCRAPER & ML SERVICE */}
        {activeTab === 'python' && (
          <div>
            <div className="page-title-banner">
              <h1 className="page-title">Python Microservice Telemetry & Live Scraper</h1>
              <p className="page-subtitle">Inspect the standalone Python service (`python-service/app.py`) for live web scraping and ML Z-score anomaly detection.</p>
            </div>

            <div className="grid-2">
              <div className="glass-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Test Python E-Commerce Scraper</h3>

                <div className="form-group">
                  <label className="form-label">Target Marketplace</label>
                  <select className="form-select" value={scrapeStore} onChange={(e) => setScrapeStore(e.target.value)}>
                    <option value="Daraz Bangladesh">Daraz Bangladesh</option>
                    <option value="Star Tech BD">Star Tech BD</option>
                    <option value="Chaldal Grocery">Chaldal Grocery</option>
                    <option value="Pickaboo">Pickaboo BD</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Search Query</label>
                  <input
                    type="text"
                    className="form-input"
                    value={scrapeQuery}
                    onChange={(e) => setScrapeQuery(e.target.value)}
                  />
                </div>

                <button className="btn btn-primary" onClick={handleScrapeStore} style={{ width: '100%' }}>
                  🐍 Trigger Live Python Scrape Adapter
                </button>
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Scraped Stream Output</h3>

                {scrapeResult ? (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                      Status: <span style={{ color: '#34d399', fontWeight: 700 }}>{scrapeResult.status.toUpperCase()}</span> | Items Scraped: {scrapeResult.items_scraped}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {scrapeResult.results?.map((item: any, idx: number) => (
                        <div key={idx} style={{ padding: '0.75rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                            <span>{item.product}</span>
                            <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>৳{item.scraped_price?.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                            <span>{item.store} ({item.channel})</span>
                            <span>Delivery: ৳{item.delivery_fee}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Trigger the scraper to see parsed payload data streamed from Python.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
