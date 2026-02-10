import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            // TODO: Replace with actual backend API call
            // const response = await fetch('http://localhost:8080/auctions/get');
            // const data = await response.json();

            // Mock data for demonstration
            const mockAuctions = [
                {
                    auctionId: 1,
                    itemName: 'Vintage Watch',
                    description: 'Rare vintage watch from 1960s',
                    startingPrice: 500,
                    currentPrice: 750,
                    status: 'LIVE',
                    isVerified: false,
                    seller: { name: 'John Doe', userId: 2 }
                },
                {
                    auctionId: 2,
                    itemName: 'Antique Vase',
                    description: 'Ming Dynasty vase',
                    startingPrice: 1000,
                    currentPrice: 1000,
                    status: 'UPCOMING',
                    isVerified: true,
                    seller: { name: 'Jane Smith', userId: 3 }
                }
            ];

            setAuctions(mockAuctions);
        } catch (err) {
            console.error('Failed to fetch auctions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (auctionId) => {
        try {
            // TODO: Replace with actual backend API call
            // const response = await fetch(`http://localhost:8080/auctions/verify/${auctionId}`, {
            //   method: 'PUT',
            //   headers: { 
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`
            //   }
            // });

            console.log('Verifying auction:', auctionId);

            // Update local state
            setAuctions(auctions.map(auction =>
                auction.auctionId === auctionId
                    ? { ...auction, isVerified: true }
                    : auction
            ));
        } catch (err) {
            console.error('Failed to verify auction:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="dashboard-section">
                    <h2>Auction Verification</h2>
                    <p className="section-subtitle">Review and verify pending auctions</p>

                    <div className="auction-list">
                        {auctions.length === 0 ? (
                            <p className="empty-state">No auctions to verify</p>
                        ) : (
                            auctions.map(auction => (
                                <div key={auction.auctionId} className="auction-card">
                                    <div className="auction-header">
                                        <h3>{auction.itemName}</h3>
                                        <span className={`status-badge ${auction.status.toLowerCase()}`}>
                                            {auction.status}
                                        </span>
                                    </div>

                                    <p className="auction-description">{auction.description}</p>

                                    <div className="auction-details">
                                        <div className="detail-item">
                                            <label>Seller:</label>
                                            <span>{auction.seller.name}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Starting Price:</label>
                                            <span>${auction.startingPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Current Price:</label>
                                            <span>${auction.currentPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Verified:</label>
                                            <span>{auction.isVerified ? '✅ Yes' : '❌ No'}</span>
                                        </div>
                                    </div>

                                    {!auction.isVerified && (
                                        <button
                                            onClick={() => handleVerify(auction.auctionId)}
                                            className="btn-verify"
                                        >
                                            Verify Auction
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
