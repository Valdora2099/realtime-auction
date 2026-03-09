import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAuctionsBySeller, getAuctions, addAuction, deleteAuction, getBids, clearAuth
} from '../api';
import {
    IconZap, IconPackage, IconBarChart, IconTrendingUp, IconGavel,
    IconPlus, IconX, IconTrash, IconLogOut, IconClock, IconCalendar,
    IconTag, IconCheckCircle, IconAlertCircle, IconLoader, IconDollarSign,
    IconFilter
} from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
import '../styles/Dashboard.css';

/* ─── Toast hook ─────────────────────────────────────────── */
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const push = useCallback((msg, type = 'info') => {
        const id = Date.now();
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
    }, []);
    return { toasts, push };
};

/* ─── Stat card ──────────────────────────────────────────── */
const StatCard = ({ Icon, value, label, accent }) => (
    <div className="stat-card">
        <div className={`stat-icon ${accent}`}><Icon size={20} /></div>
        <div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const SellerDashboard = () => {
    const [myAuctions, setMyAuctions] = useState([]);
    const [otherAuctions, setOtherAuctions] = useState([]);
    const [allBids, setAllBids] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');
    const [form, setForm] = useState({
        itemName: '', description: '', startingPrice: '', startTime: '', endTime: ''
    });

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { toasts, push } = useToast();

    /* ── Fetch ─────────────────────────────────────────────── */
    const fetchData = useCallback(async () => {
        setLoading(true);
        setApiError('');
        try {
            const [mine, all, bids] = await Promise.all([
                getAuctionsBySeller(user.userId),
                getAuctions(),
                getBids(),
            ]);
            setMyAuctions(mine);
            setOtherAuctions(all.filter(a => a.seller?.userId !== user.userId));
            setAllBids(bids);
        } catch (err) {
            setApiError(err.message || 'Failed to load data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, [user.userId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Create auction ────────────────────────────────────── */
    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addAuction({
                itemName: form.itemName,
                description: form.description,
                startingPrice: parseFloat(form.startingPrice),
                currentPrice: parseFloat(form.startingPrice),
                startTime: form.startTime || null,
                endTime: form.endTime || null,
                status: 'UPCOMING',
                isVerified: false,
                seller: { userId: user.userId },
            });
            setForm({ itemName: '', description: '', startingPrice: '', startTime: '', endTime: '' });
            setShowForm(false);
            push('Auction submitted — awaiting admin verification.', 'success');
            fetchData();
        } catch (err) {
            push(err.message || 'Failed to create auction.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    /* ── Delete auction ────────────────────────────────────── */
    const handleDelete = async (auctionId, name) => {
        try {
            await deleteAuction(auctionId);
            setMyAuctions(a => a.filter(x => x.auctionId !== auctionId));
            push(`"${name}" removed.`, 'info');
        } catch (err) {
            push(err.message || 'Failed to delete.', 'error');
        }
    };

    /* ── Helpers ─────────────────────────────────────────────── */
    const bidsForAuction = (auctionId) =>
        allBids.filter(b => b.auction?.auctionId === auctionId);

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    /* ── Stats ──────────────────────────────────────────────── */
    const liveCount = myAuctions.filter(a => a.status === 'LIVE').length;
    const totalBids = myAuctions.reduce((s, a) => s + bidsForAuction(a.auctionId).length, 0);
    const topPrice = Math.max(0, ...myAuctions.map(a => a.currentPrice ?? 0));

    /* ── Filtered list ──────────────────────────────────────── */
    const filtered = filter === 'ALL' ? myAuctions : myAuctions.filter(a => a.status === filter);

    /* ─────────────────────────────────────────────────────── */
    if (loading) return (
        <div className="loading">
            <div className="loading-spinner" />
            <span className="loading-text">Loading your auctions…</span>
        </div>
    );

    return (
        <div className="dashboard-container">

            {/* NAV */}
            <header className="dashboard-header">
                <BrandLogo size={30} />
                <h1>Seller Dashboard</h1>
                <div className="user-info">
                    <div className="user-badge">
                        <div className="user-avatar">{user.name?.[0]?.toUpperCase() ?? 'S'}</div>
                        <span className="user-name">{user.name}</span>
                    </div>
                    <button className="btn-logout" onClick={handleLogout}>
                        <IconLogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            <main className="dashboard-content">

                {apiError && (
                    <div className="page-error">
                        <IconAlertCircle size={16} />
                        {apiError}
                        <button className="btn-link" onClick={fetchData}>Retry</button>
                    </div>
                )}

                {/* STATS */}
                <div className="stats-row">
                    <StatCard Icon={IconPackage} value={myAuctions.length} label="My Auctions" accent="purple" />
                    <StatCard Icon={IconTrendingUp} value={liveCount} label="Live Now" accent="green" />
                    <StatCard Icon={IconGavel} value={totalBids} label="Total Bids" accent="amber" />
                    <StatCard Icon={IconDollarSign} value={`$${topPrice.toLocaleString()}`} label="Top Price" accent="green" />
                </div>

                {/* MY AUCTIONS */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>My Auctions</h2>
                            <p className="section-subtitle">Manage your listed items</p>
                        </div>
                        <button
                            className={showForm ? 'btn-secondary' : 'btn-primary'}
                            onClick={() => setShowForm(v => !v)}
                        >
                            {showForm ? <><IconX size={14} /> Cancel</> : <><IconPlus size={14} /> New Auction</>}
                        </button>
                    </div>

                    {/* CREATE FORM */}
                    {showForm && (
                        <form onSubmit={handleCreate} className="create-auction-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Item Name</label>
                                    <input type="text" placeholder="e.g. Vintage Rolex"
                                        value={form.itemName}
                                        onChange={e => setForm(p => ({ ...p, itemName: e.target.value }))} required />
                                </div>
                                <div className="form-group">
                                    <label>Starting Price ($)</label>
                                    <input type="number" min="1" placeholder="0"
                                        value={form.startingPrice}
                                        onChange={e => setForm(p => ({ ...p, startingPrice: e.target.value }))} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea placeholder="Describe the item in detail…"
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Time</label>
                                    <input type="datetime-local" value={form.startTime}
                                        onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} />
                                </div>
                                <div className="form-group">
                                    <label>End Time</label>
                                    <input type="datetime-local" value={form.endTime}
                                        onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting
                                        ? <span className="btn-loading"><IconLoader size={14} className="spin" />Submitting…</span>
                                        : 'Create Auction'}
                                </button>
                                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* FILTER TABS */}
                    <div className="filter-tabs">
                        {['ALL', 'LIVE', 'UPCOMING', 'ENDED'].map(f => (
                            <button key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}>
                                {f === 'ALL' ? 'All' : f === 'LIVE' ? 'Live' : f === 'UPCOMING' ? 'Upcoming' : 'Ended'}
                                <span className="tab-count">
                                    {f === 'ALL' ? myAuctions.length : myAuctions.filter(a => a.status === f).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* AUCTION CARDS */}
                    <div className="auction-list">
                        {filtered.length === 0 ? (
                            <EmptyState
                                Icon={IconPackage}
                                title="No auctions here"
                                sub={showForm ? 'Fill in the form above to list your first item.' : 'Click "New Auction" to get started.'}
                            />
                        ) : filtered.map((auction, i) => {
                            const bids = bidsForAuction(auction.auctionId);
                            return (
                                <AuctionCard
                                    key={auction.auctionId}
                                    auction={auction}
                                    bids={bids}
                                    delay={i * 0.05}
                                    actions={
                                        <button className="btn-icon-danger" onClick={() => handleDelete(auction.auctionId, auction.itemName)}>
                                            <IconTrash size={14} /> Remove
                                        </button>
                                    }
                                />
                            );
                        })}
                    </div>
                </section>

                {/* MARKETPLACE */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>Marketplace</h2>
                            <p className="section-subtitle">Auctions from other sellers</p>
                        </div>
                    </div>
                    <div className="auction-list">
                        {otherAuctions.length === 0 ? (
                            <EmptyState Icon={IconFilter} title="No other auctions" sub="Check back later." />
                        ) : otherAuctions.map((auction, i) => {
                            const bids = bidsForAuction(auction.auctionId);
                            return <AuctionCard key={auction.auctionId} auction={auction} bids={bids} delay={i * 0.05} readOnly />;
                        })}
                    </div>
                </section>
            </main>

            <ToastContainer toasts={toasts} />
        </div>
    );
};

/* ─── Shared sub-components ─────────────────────────────── */

const AuctionCard = ({ auction, bids = [], delay = 0, actions, readOnly }) => (
    <div className="auction-card" style={{ animationDelay: `${delay}s` }}>
        <div className="auction-header">
            <h3>{auction.itemName}</h3>
            <div className="auction-badges">
                <span className={`status-badge ${(auction.status || '').toLowerCase()}`}>{auction.status}</span>
                {!readOnly && (
                    <span className={`verified-badge ${auction.isVerified ? 'yes' : 'no'}`}>
                        {auction.isVerified ? <><IconCheckCircle size={11} /> Verified</> : <><IconClock size={11} /> Pending</>}
                    </span>
                )}
            </div>
        </div>

        {auction.description && <p className="auction-description">{auction.description}</p>}

        <div className="auction-details">
            {auction.seller?.name && !readOnly === false && (
                <div className="detail-item"><label>Seller</label><span>{auction.seller.name}</span></div>
            )}
            {!readOnly && auction.seller && (
                <div className="detail-item"><label>Seller</label><span>{auction.seller.name ?? '—'}</span></div>
            )}
            <div className="detail-item">
                <label>Starting</label>
                <span>${(auction.startingPrice || 0).toLocaleString()}</span>
            </div>
            <div className="detail-item">
                <label>Current</label>
                <span className="current-price">${(auction.currentPrice || auction.startingPrice || 0).toLocaleString()}</span>
            </div>
            <div className="detail-item"><label>Bids</label><span>{bids.length}</span></div>
            {auction.endTime && (
                <div className="detail-item">
                    <label>Ends</label>
                    <span>{new Date(auction.endTime).toLocaleDateString()}</span>
                </div>
            )}
        </div>

        {bids.length > 0 && (
            <div className="bids-section">
                <h4>Recent Bids</h4>
                {bids.slice(-3).reverse().map(bid => (
                    <div key={bid.bidId} className="bid-item">
                        <span>{bid.user?.name ?? 'Unknown'}</span>
                        <span className="bid-amount">${(bid.bidAmount || 0).toLocaleString()}</span>
                    </div>
                ))}
            </div>
        )}

        {actions && <div className="card-actions">{actions}</div>}
    </div>
);

const EmptyState = ({ Icon, title, sub }) => (
    <div className="empty-state">
        <div className="empty-state-icon"><Icon size={36} /></div>
        <div className="empty-state-title">{title}</div>
        <div className="empty-state-sub">{sub}</div>
    </div>
);

const ToastContainer = ({ toasts }) => (
    <div className="toast-container">
        {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>
                {t.type === 'success' ? <IconCheckCircle size={15} />
                    : t.type === 'error' ? <IconAlertCircle size={15} />
                        : <IconZap size={15} />}
                {t.msg}
            </div>
        ))}
    </div>
);

export { AuctionCard, EmptyState, ToastContainer };
export default SellerDashboard;
