# PvP Scalpel – Frontend

Fan-made World of Warcraft PvP statistics dashboard built using React.

🔗 [Live Preview](https://www.pvpscalpel.com)

## About

PvP Scalpel is a frontend React application that displays real-time PvP statistics and rankings for WoW players. It connects to a custom backend that fetches and stores data from the official Blizzard WoW API. Users can view profiles, top player rankings, and more in a sleek, responsive UI.

> **Note:** The application is still under development. Bug reports and feedback are welcome.

---

## Features

- 🧙 WoW PvP leaderboard with role/class-based filtering
- 🔐 User authentication (JWT-based)
- 📸 Profile picture uploads (secure validation supported on backend)
- 🌐 Connected to Blizzard's WoW API via backend service
- ⚛️ Built with React + Vite
- 🌙 Dark mode UI

---

## Tech Stack

- **Frontend:** React, Vite, JavaScript (ES6+)
- **Routing:** React Router
- **State Management:** Context API (Redux coming soon)
- **Styling:** CSS modules / global styles
- **Backend (connected to):** Node.js + Express + MongoDB

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

git clone https://github.com/lStanev00/PvP-Scalpel-FrontEnd

cd PvP-Scalpel-FrontEnd

npm install


### Run the Application

npm run dev

### Folder Structure

src/
├── assets/             # Images & static assets
├── components/         # Reusable UI components
├── pages/              # Route pages (Home, Login, Leaderboard, etc.)
├── services/           # API requests
├── App.jsx             # Main app layout & routing
└── main.jsx            # Root entry



## Made with love for the WoW PvP community.


### 🔐 Privacy & Session Tracking Disclaimer

This application tracks user sessions for authentication, security, and account protection purposes.

I (the author) collect basic device and browser information during login, including:
- Browser type and version
- Operating system platform
- Language and timezone
- Device memory and CPU information

This information may be stored temporarily and used to:
- Detect suspicious login attempts
- Help users manage active sessions across devices
- Improve security through browser fingerprinting

I (the author) do **not** use this data for advertising or tracking users outside of this platform. Data is handled securely and is not shared with third parties.

By using this application, you consent to this usage for session and security management.