# LocalLink - Home Services Platform

![LocalLink Logo](/Frontend/public/favicon.svg)

LocalLink is a modern web application that connects users with local home service providers. From plumbing and electrical work to cleaning and salon services, LocalLink provides a seamless platform for booking and managing home services.

## Features

- **Interactive UI**: Engaging and responsive user interface with sleek animations
- **PWA Support**: Install as a Progressive Web App for offline access
- **Service Booking**: Easy booking flow for various home services
- **Real-time Tracking**: Track service professionals in real-time
- **Reviews & Ratings**: Provide and view feedback for service quality
- **Secure Payments**: Integrated payment gateway for secure transactions
- **Dark/Light Mode**: Premium theme system with electric violet, neon cyan, and hot pink colors

## Technology Stack

- **Frontend**: React, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **Payment Processing**: Stripe Integration
- **PWA**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ankitjakhar123/Local-Link-Project.git
cd Local-Link-Project
```

2. Install dependencies
```bash
# Frontend
cd Frontend
npm install

# Backend (when available)
cd ../Backend
npm install
```

3. Start the development server
```bash
# Frontend
cd Frontend
npm run dev

# Backend (when available)
cd ../Backend
npm run dev
```

## Project Structure

```
Local-Link-Project/
├── Frontend/               # React frontend
│   ├── public/             # Public assets and PWA files
│   └── src/                # Source files
│       ├── components/     # Reusable components
│       ├── context/        # Context providers
│       ├── data/           # Static data
│       └── pages/          # Page components
└── Backend/                # Node.js backend (in development)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 