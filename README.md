# BidPulse — Real-Time Auction Platform

BidPulse is a full-stack real-time auction system that allows users to create, join, and participate in live auctions with synchronized bidding powered by WebSockets and secure authentication using JWT.

---

## Features

- Secure JWT Authentication  
- Seller Auction Creation  
- Automated Auction Start and End  
- Real-Time Bidding with WebSockets  
- Backend Bid Validation Logic  
- Automatic Winner Selection  
- Live Notifications  
- Persistent Bid History  

---

## System Workflow (End-to-End)

### 1. User Authentication
- Users register as Buyer or Seller
- Login using email and password
- Backend validates credentials
- JWT token issued for secure access

Only authenticated users can access auctions and place bids.

---

### 2. Auction Creation (Seller)
- Seller submits item details
- Sets base price and duration
- Defines start and end time
- Auction saved as UPCOMING
- Scheduler automatically activates auction → LIVE

---

### 3. Live Auction Monitoring (Buyer)
- Buyers view all live auctions
- Real-time highest bid display
- Countdown timer visible
- Users join auction room via WebSocket

All users see synchronized auction data simultaneously.

---

### 4. Real-Time Bidding (Core Logic)
When a bid is placed:

1. Sent to backend via WebSocket  
2. Validations performed:
   - Auction must be LIVE
   - Bid must exceed highest bid
   - Minimum increment must be met
3. If valid:
   - Stored in database
   - Highest bid updated
   - Broadcast to all users instantly

This ensures fairness, prevents race conditions, and maintains bid consistency.

---

### 5. Auction Auto-Closure
At end time:

- Scheduler detects auction expiry
- Status changes to ENDED
- Bidding locked
- Highest bid retrieved
- Winner declared automatically
- Result saved

---

### 6. Post-Auction Flow
- Winner notified
- Seller receives result
- Outbid users alerted
- Bid history permanently stored

Optional extensions:
- Wallet system
- Payment simulation
- Transaction logs

---

## Tech Stack (Edit According to Your Project)

- Frontend: React / Next.js / Vue
- Backend: Node.js / Spring Boot / Django
- Database: MongoDB / PostgreSQL / MySQL
- Real-Time Communication: WebSockets / Socket.IO
- Authentication: JWT

---

## Project Structure

realtime-auction/
│
├── backend/
├── frontend/
├── database/
├── docs/
└── README.md


---

## Core Architecture Principles

- Event-driven backend
- Stateless authentication
- Real-time state synchronization
- Server-side validation authority
- Automated schedulers

---

## Design Goals

- Fair bidding system
- Real-time consistency
- High scalability
- Secure transactions
- Low latency updates

---

## One-Line Summary

BidPulse is a real-time auction system where users securely participate in live auctions with instant bid synchronization, automated winner selection, and backend-validated bidding logic.

---

## Setup Instructions

```bash
git clone https://github.com/Valdora2099/realtime-auction
cd realtime-auction

