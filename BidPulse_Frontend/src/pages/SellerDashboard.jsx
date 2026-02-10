import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const SellerDashboard = () => {
    const [myAuctions, setMyAuctions] = useState([]);
    const [otherAuctions, setOtherAuctions] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAuction, setNewAuction] = useState({
        itemName: '',
        description: '',
        startingPrice: '',
        startTime: '',
        endTime: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            // TODO: Replace with actual backend API calls
            // const response = await fetch('http://localhost:8080/auctions/get');
            // const data = await response.json();

            // Mock data for demonstration
            const mockMyAuctions = [
                {
                    auctionId: 1,
                    itemName: 'Vintage Camera',
                    description: 'Classic film camera',
                    startingPrice: 300,
                    currentPrice: 450,
                    status: 'LIVE',
                    isVerified: true,
                    bids: [
                        { bidId: 1, bidAmount: 350, user: { name: 'Alice' } },
                        { bidId: 2, bidAmount: 450, user: { name: 'Bob' } }
                    ]
                }
            ];

            const mockOtherAuctions = [
                {
                    auctionId: 2,
                    itemName: 'Antique Book',
                    description: 'First edition novel',
                    startingPrice: 200,
                    currentPrice: 200,
                    status: 'UPCOMING',
                    isVerified: true,
                    seller: { name: 'Jane Doe' }
                }
            ];

            setMyAuctions(mockMyAuctions);
            setOtherAuctions(mockOtherAuctions);
        } catch (err) {
            console.error('Failed to fetch auctions:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAuction = async (e) => {
        e.preventDefault();
        try {
            // TODO: Replace with actual backend API call
            // const response = await fetch('http://localhost:8080/auctions/add', {
            //   method: 'POST',
            //   headers: { 
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`
            //   },
            //   body: JSON.stringify({
            //     ...newAuction,
            //     seller: { userId: user.userId }
            //   })
            // });

            console.log('Creating auction:', newAuction);
            setShowCreateForm(false);
            setNewAuction({ itemName: '', description: '', startingPrice: '', startTime: '', endTime: '' });
            fetchAuctions();
        } catch (err) {
            console.error('Failed to create auction:', err);
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
                <h1>Seller Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </header>

            <main className="dashboard-content">
                {/* My Auctions Section */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>My Auctions</h2>
                        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-primary">
                            {showCreateForm ? 'Cancel' : 'Create New Auction'}
                        </button>
                    </div>

                    {showCreateForm && (
                        <form onSubmit={handleCreateAuction} className="create-auction-form">
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    value={newAuction.itemName}
                                    onChange={(e) => setNewAuction({ ...newAuction, itemName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={newAuction.description}
                                    onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Starting Price</label>
                                <input
                                    type="number"
                                    value={newAuction.startingPrice}
                                    onChange={(e) => setNewAuction({ ...newAuction, startingPrice: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={newAuction.startTime}
                                    onChange={(e) => setNewAuction({ ...newAuction, startTime: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="datetime-local"
                                    value={newAuction.endTime}
                                    onChange={(e) => setNewAuction({ ...newAuction, endTime: e.target.value })}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn-primary">Create Auction</button>
                        </form>
                    )}

                    <div className="auction-list">
                        {myAuctions.length === 0 ? (
                            <p className="empty-state">You haven't created any auctions yet</p>
                        ) : (
                            myAuctions.map(auction => (
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
                                            <label>Starting Price:</label>
                                            <span>${auction.startingPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Current Price:</label>
                                            <span>${auction.currentPrice}</span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Total Bids:</label>
                                            <span>{auction.bids?.length || 0}</span>
                                        </div>
                                    </div>

                                    {auction.bids && auction.bids.length > 0 && (
                                        <div className="bids-section">
                                            <h4>Recent Bids</h4>
                                            {auction.bids.map(bid => (
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

                {/* Other Auctions Section */}
                <section className="dashboard-section">
                    <h2>Other Auctions</h2>
                    <p className="section-subtitle">Browse auctions from other sellers</p>

                    <div className="auction-list">
                        {otherAuctions.length === 0 ? (
                            <p className="empty-state">No other auctions available</p>
                        ) : (
                            otherAuctions.map(auction => (
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
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SellerDashboard;
