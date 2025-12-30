# SolarWise LK

A comprehensive solar energy platform for Sri Lanka, providing package comparisons, ROI calculations, and expert guidance for solar installations.

## 🌞 About

SolarWise LK is a full-stack web application designed to help Sri Lankan consumers make informed decisions about solar energy installations. The platform features:

- **Package Comparison**: Compare solar packages from leading providers (Hayleys, JLanka, WinSolar, etc.)
- **ROI Calculator**: Calculate return on investment with accurate CEB tariff block mappings
- **Hardware Database**: Browse and review solar panels, inverters, and batteries
- **AI Chatbot**: Get expert advice from our electrical engineer AI assistant
- **User Reviews**: Read and share experiences with solar installations
- **Admin Panel**: Manage providers, packages, and user reviews

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **Radix UI** components
- **Wouter** for routing
- **React Query** for state management
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **tRPC** for type-safe APIs
- **Drizzle ORM** with MySQL
- **JWT** authentication
- **AWS S3** for file storage

### Development Tools
- **TypeScript** for type safety
- **Vitest** for testing
- **ESLint** & **Prettier** for code quality
- **pnpm** for package management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm package manager
- MySQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RajanthaR/web-manus-solarwise-lk.git
cd web-manus-solarwise-lk
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Set up the database:
```bash
pnpm run db:push
```

5. Start the development server:
```bash
pnpm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
web-manus-solarwise-lk/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── _core/         # Core hooks and utilities
│   │   └── ...
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── _core/            # Core server logic
│   ├── routers/          # tRPC routers
│   └── ...
├── shared/               # Shared types and utilities
├── drizzle/              # Database schema and migrations
└── scripts/              # Build and deployment scripts
```

## 🗄️ Database Schema

The application uses MySQL with the following main entities:
- **Providers**: Solar installation companies
- **Packages**: Solar packages (on-grid, off-grid, hybrid)
- **Hardware**: Panels, inverters, and batteries
- **Reviews**: User reviews and ratings
- **Users**: User authentication and profiles

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run test` - Run tests
- `pnpm run check` - Type checking
- `pnpm run format` - Format code with Prettier
- `pnpm run db:push` - Generate and apply database migrations

## 🌐 Features

### Package Comparison
- Side-by-side comparison of solar packages
- Sort by ROI, hardware quality, and price
- Detailed breakdown of components and specifications

### ROI Calculator
- Accurate calculations based on CEB tariff blocks
- Consider system size, location, and consumption patterns
- Visualize savings over time

### Hardware Reviews
- Comprehensive database of solar equipment
- Quality scoring system with pros/cons analysis
- Real user reviews and ratings

### AI Assistant
- Electrical engineer persona for expert advice
- Knowledge base integration with product data
- Real-time tariff and regulation updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Copyright © 2025 Rajantha R Ambegala. All rights reserved.

This project is proprietary software and may not be distributed or modified without explicit permission from the copyright holder.

## 👤 Author

**Rajantha R Ambegala**
- GitHub: [@RajanthaR](https://github.com/RajanthaR/)
- Email: rajantha.rc@gmail.com

## 🙏 Acknowledgments

- Solar providers in Sri Lanka for package data
- Ceylon Electricity Board for tariff information
- The open-source community for the amazing tools and libraries
