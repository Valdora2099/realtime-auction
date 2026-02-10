import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const BuyerDashboard = () => {
    const [auctions, setAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState({});
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
                    isVerified: true,
                    seller: { name: 'John Doe' },
                    bids: [
                        { bidId: 1, bidAmount: 600, user: { name: 'Alice' } },
                        { bidId: 2, bidAmount: 750, user: { name: 'Bob' } }
                    ]
                },
                {
                    auctionId: 2,
                    itemName: 'Antique Vase',
                    description: 'Ming Dynasty vase',
                    startingPrice: 1000,
                    currentPrice: 1200,
                    status: 'LIVE',
                    isVerified: true,
                    seller: { name: 'Jane Smith' },
                    bids: [
                        { bidId: 3, bidAmount: 1200, user: { name: 'Charlie' } }
                    ]
                },
                {
                    auctionId: 3,
                    itemName: 'Classic Guitar',
                    description: 'Vintage acoustic guitar',
                    startingPrice: 800,
                    currentPrice: 800,
                    status: 'UPCOMING',
                    isVerified: true,
                    seller: { name: 'Mike Johnson' },
                    bids: []
                }
            ];

            setAuctions(mockAuctions);
        } catch (err) {
            console.error('Failed to fetch auctions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceBid = async (auctionId) => {
        const amount = bidAmount[auctionId];
        if (!amount) {
            alert('Please enter a bid amount');
            return;
        }

        try {
            // TODO: Replace with actual backend API call
            // const response = await fetch('http://localhost:8080/bids/add', {
            //   method: 'POST',
            //   headers: { 
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`
            //   },
            //   body: JSON.stringify({
            //     bidAmount: amount,
            //     auction: { auctionId },
            //     user: { userId: user.userId }
            //   })
            // });

            console.log('Placing bid:', { auctionId, amount });

            // Update local state
            setAuctions(auctions.map(auction =>
                auction.auctionId === auctionId
                    ? {
                        ...auction,
                        currentPrice: amount,
                        bids: [...auction.bids, {
                            bidId: Date.now(),
                            bidAmount: amount,
                            user: { name: user.name }
                        }]
                    }
                    : auction
            ));

            setBidAmount({ ...bidAmount, [auctionId]: '' });
            alert('Bid placed successfully!');
        } catch (err) {
            console.error('Failed to place bid:', err);
            alert('Failed to place bid');
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
                <h1>Buyer Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="dashboard-section">
                    <h2>Available Auctions</h2>
                    <p className="section-subtitle">Browse and bid on live auctions</p>

                    <div className="auction-list">
                        {auctions.length === 0 ? (
                            <p className="empty-state">No auctions available</p>
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
                                            <span className="current-price">${auction.currentPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Total Bids:</label>
                                            <span>{auction.bids?.length || 0}</span>
                                        </div>
                                    </div>

                                    {/* Bidding Section */}
                                    {auction.status === 'LIVE' && (
                                        <div className="bidding-section">
                                            <h4>Place Your Bid</h4>
                                            <div className="bid-input-group">
                                                <input
                                                    type="number"
                                                    placeholder={`Min: $${auction.currentPrice + 1}`}
                                                    value={bidAmount[auction.auctionId] || ''}
                                                    onChange={(e) => setBidAmount({
                                                        ...bidAmount,
                                                        [auction.auctionId]: e.target.value
                                                    })}
                                                    min={auction.currentPrice + 1}
                                                />
                                                <button
                                                    onClick={() => handlePlaceBid(auction.auctionId)}
                                                    className="btn-bid"
                                                >
                                                    Place Bid
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bids History */}
                                    {auction.bids && auction.bids.length > 0 && (
                                        <div className="bids-section">
                                            <h4>Bid History</h4>
                                            {auction.bids.slice().reverse().map(bid => (
                                                <div key={bid.bidId} className="bid-item">
                                                    <span>{bid.user.name}</span>
                                                    <span className="bid-amount">${bid.bidAmount}</span>
                                                </div>
                                            ))}
                                        </div>
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

export default BuyerDashboard;
