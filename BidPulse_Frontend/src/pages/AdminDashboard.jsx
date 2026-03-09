import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuctions, getUsers, verifyAuction, deleteAuction, deleteUser, getBids, clearAuth } from '../api';
import {
    IconZap, IconPackage, IconUsers, IconGavel, IconCheckCircle, IconTrash,
    IconAlertCircle, IconLogOut, IconLoader, IconShield, IconBarChart,
    IconDollarSign, IconClock, IconFilter
} from '../components/Icons';
import BrandLogo from '../components/BrandLogo';
import { EmptyState, ToastContainer } from './SellerDashboard';
import '../styles/Dashboard.css';

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
const AdminDashboard = () => {
    const [auctions, setAuctions] = useState([]);
    const [users, setUsers] = useState([]);
    const [allBids, setAllBids] = useState([]);
    const [tab, setTab] = useState('auctions');
    const [aFilter, setAFilter] = useState('ALL');
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');
    const [verifying, setVerifying] = useState({});

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { toasts, push } = useToast();

    /* ── Fetch ─────────────────────────────────────────────── */
    const fetchData = useCallback(async () => {
        setLoading(true); setApiError('');
        try {
            const [aList, uList, bList] = await Promise.all([getAuctions(), getUsers(), getBids()]);
            setAuctions(aList);
            setUsers(uList);
            setAllBids(bList);
        } catch (err) {
            setApiError(err.message || 'Could not load data. Is the backend running?');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    /* ── Verify ────────────────────────────────────────────── */
    const handleVerify = async (auctionId, name) => {
        setVerifying(v => ({ ...v, [auctionId]: true }));
        try {
            await verifyAuction(auctionId, user.userId);
            setAuctions(prev => prev.map(a =>
                a.auctionId === auctionId ? { ...a, isVerified: true } : a
            ));
            push(`"${name}" verified successfully.`, 'success');
        } catch (err) {
            push(err.message || 'Verification failed.', 'error');
        } finally {
            setVerifying(v => ({ ...v, [auctionId]: false }));
        }
    };

    /* ── Delete auction ────────────────────────────────────── */
    const handleDeleteAuction = async (auctionId, name) => {
        try {
            await deleteAuction(auctionId);
            setAuctions(a => a.filter(x => x.auctionId !== auctionId));
            push(`"${name}" removed.`, 'info');
        } catch (err) {
            push(err.message || 'Failed to delete auction.', 'error');
        }
    };

    /* ── Delete user ───────────────────────────────────────── */
    const handleDeleteUser = async (userId, name) => {
        try {
            await deleteUser(userId);
            setUsers(u => u.filter(x => x.userId !== userId));
            push(`User "${name}" removed.`, 'info');
        } catch (err) {
            push(err.message || 'Failed to delete user.', 'error');
        }
    };

    const handleLogout = () => { clearAuth(); navigate('/login'); };

    /* ── Stats ──────────────────────────────────────────────── */
    const pendingCount = auctions.filter(a => !a.isVerified).length;
    const liveCount = auctions.filter(a => a.status === 'LIVE').length;

    /* ── Filtered list ──────────────────────────────────────── */
    const filteredAuctions =
        aFilter === 'ALL' ? auctions :
            aFilter === 'PENDING' ? auctions.filter(a => !a.isVerified) :
                auctions.filter(a => a.status === aFilter);

    const bidsForAuction = (auctionId) =>
        allBids.filter(b => b.auction?.auctionId === auctionId);

    if (loading) return (
        <div className="loading">
            <div className="loading-spinner" />
            <span className="loading-text">Loading admin panel…</span>
        </div>
    );

    return (
        <div className="dashboard-container">

            {/* NAV */}
            <header className="dashboard-header">
                <BrandLogo size={30} />
                <h1>Admin Dashboard</h1>
                <div className="user-info">
                    <div className="user-badge">
                        <div className="user-avatar admin-avatar">{user.name?.[0]?.toUpperCase() ?? 'A'}</div>
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
                    <StatCard Icon={IconPackage} value={auctions.length} label="Total Auctions" accent="purple" />
                    <StatCard Icon={IconClock} value={pendingCount} label="Pending Verify" accent="amber" />
                    <StatCard Icon={IconBarChart} value={liveCount} label="Live Now" accent="green" />
                    <StatCard Icon={IconUsers} value={users.length} label="Registered Users" accent="purple" />
                    <StatCard Icon={IconGavel} value={allBids.length} label="Total Bids" accent="green" />
                </div>

                {/* TABS */}
                <div className="tab-bar">
                    <button
                        className={`tab-btn ${tab === 'auctions' ? 'active' : ''}`}
                        onClick={() => setTab('auctions')}
                    >
                        <IconPackage size={15} /> Auctions
                        {pendingCount > 0 && <span className="tab-alert">{pendingCount}</span>}
                    </button>
                    <button
                        className={`tab-btn ${tab === 'users' ? 'active' : ''}`}
                        onClick={() => setTab('users')}
                    >
                        <IconUsers size={15} /> Users
                    </button>
                </div>

                {/* ── AUCTIONS TAB ────────────────────────────────── */}
                {tab === 'auctions' && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>Auction Management</h2>
                                <p className="section-subtitle">Review, verify and remove auction listings</p>
                            </div>
                            {pendingCount > 0 && (
                                <div className="alert-chip">
                                    <IconAlertCircle size={13} /> {pendingCount} pending verification
                                </div>
                            )}
                        </div>

                        {/* FILTER TABS */}
                        <div className="filter-tabs">
                            {[
                                { key: 'ALL', label: 'All', count: auctions.length },
                                { key: 'PENDING', label: 'Pending', count: pendingCount },
                                { key: 'LIVE', label: 'Live', count: auctions.filter(a => a.status === 'LIVE').length },
                                { key: 'UPCOMING', label: 'Upcoming', count: auctions.filter(a => a.status === 'UPCOMING').length },
                            ].map(f => (
                                <button key={f.key}
                                    className={`filter-tab ${aFilter === f.key ? 'active' : ''}`}
                                    onClick={() => setAFilter(f.key)}>
                                    {f.label}<span className="tab-count">{f.count}</span>
                                </button>
                            ))}
                        </div>

                        <div className="auction-list">
                            {filteredAuctions.length === 0 ? (
                                <EmptyState Icon={FilteredEmpty(aFilter)} title="Nothing here" sub="All clear in this category." />
                            ) : filteredAuctions.map((auction, i) => {
                                const bids = bidsForAuction(auction.auctionId);
                                return (
                                    <div key={auction.auctionId} className="auction-card"
                                        style={{
                                            animationDelay: `${i * 0.05}s`,
                                            borderColor: !auction.isVerified ? 'rgba(245,158,11,0.25)' : undefined,
                                        }}>
                                        <div className="auction-header">
                                            <h3>{auction.itemName}</h3>
                                            <div className="auction-badges">
                                                <span className={`status-badge ${(auction.status || '').toLowerCase()}`}>
                                                    {auction.status}
                                                </span>
                                                <span className={`verified-badge ${auction.isVerified ? 'yes' : 'no'}`}>
                                                    {auction.isVerified
                                                        ? <><IconCheckCircle size={11} /> Verified</>
                                                        : <><IconClock size={11} /> Unverified</>}
                                                </span>
                                            </div>
                                        </div>

                                        {auction.description && <p className="auction-description">{auction.description}</p>}

                                        <div className="auction-details">
                                            <div className="detail-item"><label>Seller</label><span>{auction.seller?.name ?? '—'}</span></div>
                                            <div className="detail-item"><label>Starting</label><span>${(auction.startingPrice || 0).toLocaleString()}</span></div>
                                            <div className="detail-item"><label>Current</label><span className="current-price">${(auction.currentPrice || auction.startingPrice || 0).toLocaleString()}</span></div>
                                            <div className="detail-item"><label>Bids</label><span>{bids.length}</span></div>
                                            {auction.endTime && (
                                                <div className="detail-item"><label>Ends</label><span>{new Date(auction.endTime).toLocaleDateString()}</span></div>
                                            )}
                                        </div>

                                        {bids.length > 0 && (
                                            <div className="bids-section">
                                                <h4>Top Bid</h4>
                                                {[...bids].reverse().slice(0, 1).map(bid => (
                                                    <div key={bid.bidId} className="bid-item">
                                                        <span>{bid.user?.name ?? 'Unknown'}</span>
                                                        <span className="bid-amount">${(bid.bidAmount || 0).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="card-actions">
                                            {!auction.isVerified && (
                                                <button
                                                    className="btn-verify"
                                                    onClick={() => handleVerify(auction.auctionId, auction.itemName)}
                                                    disabled={verifying[auction.auctionId]}
                                                >
                                                    {verifying[auction.auctionId]
                                                        ? <IconLoader size={13} className="spin" />
                                                        : <><IconCheckCircle size={13} /> Verify</>}
                                                </button>
                                            )}
                                            <button
                                                className="btn-icon-danger"
                                                onClick={() => handleDeleteAuction(auction.auctionId, auction.itemName)}
                                            >
                                                <IconTrash size={13} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── USERS TAB ───────────────────────────────────── */}
                {tab === 'users' && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2>User Management</h2>
                                <p className="section-subtitle">View and remove registered platform users</p>
                            </div>
                        </div>

                        <div className="data-table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.userId}>
                                            <td>
                                                <div className="table-user-cell">
                                                    <div className={`user-avatar sm ${u.role}`}>{u.name?.[0]?.toUpperCase()}</div>
                                                    <span>{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted">{u.email}</td>
                                            <td>
                                                <span className={`role-chip ${u.role}`}>
                                                    {u.role === 'admin' ? <IconShield size={11} />
                                                        : u.role === 'seller' ? <IconPackage size={11} />
                                                            : <IconGavel size={11} />}
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>
                                                {u.userId === user.userId
                                                    ? <span className="you-chip">You</span>
                                                    : (
                                                        <button
                                                            className="btn-icon-danger sm"
                                                            onClick={() => handleDeleteUser(u.userId, u.name)}
                                                        >
                                                            <IconTrash size={12} /> Remove
                                                        </button>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            <ToastContainer toasts={toasts} />
        </div>
    );
};

/* fallback icon helper */
const FilteredEmpty = (filter) => {
    if (filter === 'PENDING') return IconCheckCircle;
    return IconPackage;
};

export default AdminDashboard;
