# BidPulse Frontend

Simple React frontend for BidPulse auction platform demonstrating backend API integration and user flow.

## Features

- **Authentication**: Login/Register with JWT token storage
- **Role-Based Dashboards**:
  - **Admin**: Verify auctions
  - **Seller**: Create auctions, view bids
  - **Buyer**: Browse auctions, place bids
- **Protected Routes**: Role-based access control

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx    # Route protection component
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── AdminDashboard.jsx     # Admin dashboard
│   ├── SellerDashboard.jsx    # Seller dashboard
│   └── BuyerDashboard.jsx     # Buyer dashboard
├── styles/
│   ├── Auth.css               # Authentication pages styles
│   └── Dashboard.css          # Dashboard pages styles
├── App.jsx                    # Main app with routing
└── main.jsx                   # Entry point
```

## Backend API Integration Points

All pages have placeholder comments marked with `// TODO:` showing where to integrate backend APIs:

### User APIs
- `POST /users/add` - Register new user
- `POST /auth/login` - User login (needs to be implemented in backend)

### Auction APIs
- `GET /auctions/get` - Fetch all auctions
- `POST /auctions/add` - Create new auction
- `PUT /auctions/put/{id}` - Update auction
- `PUT /auctions/verify/{id}` - Verify auction (admin only)

### Bid APIs
- `GET /bids/get` - Fetch all bids
- `POST /bids/add` - Place new bid

## Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Testing Different Roles

In `Login.jsx`, change the `mockUser.role` value to test different dashboards:
- `role: 'admin'` → Admin Dashboard
- `role: 'seller'` → Seller Dashboard
- `role: 'buyer'` → Buyer Dashboard

## Security Features Demonstrated

- JWT token storage in localStorage
- Protected routes with role validation
- Automatic redirection based on authentication state
- Role-based dashboard access

## Next Steps

1. Implement actual backend API calls (replace mock data)
2. Add WebSocket for real-time bid updates
3. Implement auction lifecycle automation
4. Add bid validation logic
5. Implement winner determination
