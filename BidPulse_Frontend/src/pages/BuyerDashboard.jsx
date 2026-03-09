import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuctions, getBids, addBid, clearAuth } from '../api';
import {
    IconZap, IconGavel, IconTrendingUp, IconAward, IconClock,
    IconCheckCircle, IconAlertCircle, IconLogOut, IconLoader,
    IconDollarSign, IconBarChart, IconArrowUp
} from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
import { AuctionCard, EmptyState, ToastContainer } from './SellerDashboard';
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

const StatCard = ({ Icon, value, label, accent }) => (
    <div className="stat-card">
        <div className={`stat-icon ${accent}`}><Icon size={20} /></div>
        <div><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
    </div>
);

/* ═══════════════════════════════════════════════════════════ */
const BuyerDashboard = () => {
    const [auctions, setAuctions] = useState([]);
    const [allBids, setAllBids] = useState([]);
    const [bidAmounts, setBidAmounts] = useState({});
    const [filter, setFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [placing, setPlacing] = useState({}); // auctionId → bool

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { toasts, push } = useToast();

    /* ── Fetch ─────────────────────────────────────────────── */
    const fetchData = useCallback(async () => {
        setLoading(true); setApiError('');
        try {
            const [aList, bList] = await Promise.all([getAuctions(), getBids()]);
            setAuctions(aList);
            setAllBids(bList);
        } catch (err) {
            setApiError(err.message || 'Could not load auctions. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Place bid ─────────────────────────────────────────── */
    const handlePlaceBid = async (auctionId) => {
        const amount = parseFloat(bidAmounts[auctionId]);
        const auction = auctions.find(a => a.auctionId === auctionId);

        if (!amount || isNaN(amount)) { push('Enter a valid bid amount.', 'error'); return; }
        const currentPrice = auction.currentPrice ?? auction.startingPrice ?? 0;
        if (amount <= currentPrice) {
            push(`Bid must exceed the current price of $${currentPrice.toLocaleString()}.`, 'error');
            return;
        }

        setPlacing(p => ({ ...p, [auctionId]: true }));
        try {
            const newBid = await addBid(auctionId, user.userId, amount);
            // Update local state immediately for responsiveness
            setAllBids(b => [...b, newBid]);
            setAuctions(prev => prev.map(a =>
                a.auctionId === auctionId ? { ...a, currentPrice: amount } : a
            ));
            setBidAmounts(b => ({ ...b, [auctionId]: '' }));
            push(`Bid of $${amount.toLocaleString()} placed on "${auction.itemName}"`, 'success');
        } catch (err) {
            push(err.message || 'Failed to place bid.', 'error');
        } finally {
            setPlacing(p => ({ ...p, [auctionId]: false }));
        }
    };

    const handleLogout = () => { clearAuth(); navigate('/login'); };

    /* ── Helpers ─────────────────────────────────────────────── */
    const bidsForAuction = (auctionId) =>
        allBids.filter(b => b.auction?.auctionId === auctionId);

    const myBidsTotal = allBids.filter(b => b.user?.userId === user.userId).length;
    const winningCount = auctions.filter(a => {
        const bids = bidsForAuction(a.auctionId);
        return a.status === 'LIVE' && bids.length > 0 &&
            bids[bids.length - 1]?.user?.userId === user.userId;
    }).length;

    const liveCount = auctions.filter(a => a.status === 'LIVE').length;
    const upcomingCount = auctions.filter(a => a.status === 'UPCOMING').length;
    const filtered = filter === 'ALL' ? auctions : auctions.filter(a => a.status === filter);

    if (loading) return (
        <div className="loading">
            <div className="loading-spinner" />
            <span className="loading-text">Loading auctions…</span>
        </div>
    );

    return (
        <div className="dashboard-container">

            {/* NAV */}
            <header className="dashboard-header">
                <BrandLogo size={30} />
                <h1>Buyer Dashboard</h1>
                <div className="user-info">
                    <div className="user-badge">
                        <div className="user-avatar">{user.name?.[0]?.toUpperCase() ?? 'B'}</div>
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
                        <IconAlertCircle size={16} />{apiError}
                        <button className="btn-link" onClick={fetchData}>Retry</button>
                    </div>
                )}

                {/* STATS */}
                <div className="stats-row">
                    <StatCard Icon={IconTrendingUp} value={liveCount} label="Live Auctions" accent="green" />
                    <StatCard Icon={IconClock} value={upcomingCount} label="Upcoming" accent="amber" />
                    <StatCard Icon={IconGavel} value={myBidsTotal} label="My Bids" accent="purple" />
                    <StatCard Icon={IconAward} value={winningCount} label="Leading Bids" accent="green" />
                </div>

                {/* AUCTION LISTINGS */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <div>
                            <h2>Available Auctions</h2>
                            <p className="section-subtitle">Browse and bid on live listings</p>
                        </div>
                    </div>

                    {/* FILTER TABS */}
                    <div className="filter-tabs">
                        {['ALL', 'LIVE', 'UPCOMING', 'ENDED'].map(f => (
                            <button key={f}
                                className={`filter-tab ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}>
                                {f === 'ALL' ? 'All' : f === 'LIVE' ? 'Live' : f === 'UPCOMING' ? 'Upcoming' : 'Ended'}
                                <span className="tab-count">
                                    {f === 'ALL' ? auctions.length : auctions.filter(a => a.status === f).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="auction-list">
                        {filtered.length === 0 ? (
                            <EmptyState Icon={IconGavel} title="No auctions here" sub="Try a different filter." />
                        ) : filtered.map((auction, i) => {
                            const bids = bidsForAuction(auction.auctionId);
                            const isLeading = bids.length > 0 && bids[bids.length - 1]?.user?.userId === user.userId;
                            const isLive = auction.status === 'LIVE';
                            const curPrice = auction.currentPrice ?? auction.startingPrice ?? 0;

                            return (
                                <div key={auction.auctionId} className="auction-card" style={{ animationDelay: `${i * 0.05}s` }}>
                                    {isLeading && isLive && (
                                        <div className="leading-badge">
                                            <IconAward size={12} /> Leading
                                        </div>
                                    )}

                                    <div className="auction-header">
                                        <h3>{auction.itemName}</h3>
                                        <span className={`status-badge ${(auction.status || '').toLowerCase()}`}>
                                            {auction.status}
                                        </span>
                                    </div>

                                    {auction.description && <p className="auction-description">{auction.description}</p>}

                                    <div className="auction-details">
                                        {auction.seller?.name && (
                                            <div className="detail-item"><label>Seller</label><span>{auction.seller.name}</span></div>
                                        )}
                                        <div className="detail-item"><label>Starting</label><span>${(auction.startingPrice || 0).toLocaleString()}</span></div>
                                        <div className="detail-item"><label>Current Price</label><span className="current-price">${curPrice.toLocaleString()}</span></div>
                                        <div className="detail-item"><label>Bids</label><span>{bids.length}</span></div>
                                        {auction.endTime && (
                                            <div className="detail-item"><label>Ends</label><span>{new Date(auction.endTime).toLocaleDateString()}</span></div>
                                        )}
                                    </div>

                                    {/* BID INPUT */}
                                    {isLive && (
                                        <div className="bidding-section">
                                            <h4>Place Your Bid</h4>
                                            <div className="bid-input-group">
                                                <input
                                                    type="number"
                                                    step="1"
                                                    min={curPrice + 1}
                                                    placeholder={`Min $${(curPrice + 1).toLocaleString()}`}
                                                    value={bidAmounts[auction.auctionId] || ''}
                                                    onChange={e => setBidAmounts(b => ({
                                                        ...b, [auction.auctionId]: e.target.value
                                                    }))}
                                                />
                                                <button
                                                    className="btn-bid"
                                                    onClick={() => handlePlaceBid(auction.auctionId)}
                                                    disabled={placing[auction.auctionId]}
                                                >
                                                    {placing[auction.auctionId]
                                                        ? <IconLoader size={14} className="spin" />
                                                        : <><IconArrowUp size={14} /> Bid</>}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {auction.status === 'UPCOMING' && (
                                        <div className="info-banner amber">
                                            <IconClock size={14} />
                                            Opens {auction.startTime ? new Date(auction.startTime).toLocaleString() : 'soon'}
                                        </div>
                                    )}

                                    {auction.status === 'ENDED' && (
                                        <div className="info-banner muted">
                                            <IconCheckCircle size={14} />
                                            Auction ended
                                            {bids.length > 0 && (
                                                <span className="winner-note">
                                                    — Won by {bids[bids.length - 1]?.user?.name ?? 'Unknown'} at ${(bids[bids.length - 1]?.bidAmount || 0).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* BID HISTORY */}
                                    {bids.length > 0 && (
                                        <div className="bids-section">
                                            <h4>Bid History</h4>
                                            {bids.slice().reverse().slice(0, 5).map(bid => (
                                                <div key={bid.bidId} className="bid-item">
                                                    <span className={bid.user?.userId === user.userId ? 'bid-mine' : ''}>
                                                        {bid.user?.name ?? 'Unknown'}
                                                        {bid.user?.userId === user.userId && <span className="you-tag">You</span>}
                                                    </span>
                                                    <span className="bid-amount">${(bid.bidAmount || 0).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <ToastContainer toasts={toasts} />
        </div>
    );
};

export default BuyerDashboard;
