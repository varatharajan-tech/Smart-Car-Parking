# 🚗 A smart car parking app built with Expo & React Native — find, book, and manage parking spots in real time.

<div align="center">

![Smart Parking Banner](https://img.shields.io/badge/Smart-Parking-blue?style=for-the-badge&logo=car&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54.0-black?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A modern, intelligent parking management system built for the future of urban mobility.**

[🌐 Live Demo]([https://smart-car-parking.onrender.com]) • [🐛 Report Bug](https://github.com/varatharajan-tech/Smart-Car-Parking/issues) • [💡 Request Feature](https://github.com/varatharajan-tech/Smart-Car-Parking/issues)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [How the App Works](#-how-the-app-works)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [App Structure](#-app-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🧠 About the Project

The **Smart Car Parking System** is a full-featured mobile and web application designed to solve one of urban life's most common frustrations — finding a parking spot. The app provides real-time visibility into parking availability, allows users to reserve spots in advance, and guides them directly to their parking location using an interactive map.

Whether you're in a shopping mall, office complex, or public parking area, this app makes parking effortless and stress-free.

---

## ⚙️ How the App Works

### 🔄 Complete User Flow
```
User Opens App
      │
      ▼
📍 Location Detected
      │
      ▼
🗺️ Map Loads with Nearby Parking Areas
      │
      ▼
🅿️ User Selects a Parking Lot
      │
      ▼
📊 Real-time Slot Availability Shown
   (Green = Available | Red = Occupied)
      │
      ▼
✅ User Books a Slot
      │
      ▼
🧾 Booking Confirmation Generated
      │
      ▼
🧭 Navigation to Parking Spot
      │
      ▼
🚗 User Parks Vehicle
      │
      ▼
⏱️ Timer Starts (Parking Duration Tracked)
      │
      ▼
💳 Payment Processed on Exit
      │
      ▼
🏁 Session Ends — Slot Released
```

---

### 📱 Screen-by-Screen Breakdown

#### 1️⃣ Home / Dashboard Screen
- Displays a live map centered on the user's current location
- Shows nearby parking lots as map markers
- Color-coded markers indicate availability:
  - 🟢 **Green** — Available spots
  - 🟡 **Yellow** — Almost full
  - 🔴 **Red** — Fully occupied

#### 2️⃣ Parking Lot Detail Screen
- Shows the selected parking lot's full details:
  - Total slots vs available slots
  - Pricing per hour
  - Distance from user
  - Ratings and reviews
  - Operating hours

#### 3️⃣ Slot Selection Screen
- Visual grid layout of all parking slots
- Tap any green slot to select it
- Clearly shows which slots are taken

#### 4️⃣ Booking Confirmation Screen
- Summary of selected slot, time, and price
- Confirm booking with a single tap
- Generates a unique booking ID / QR code

#### 5️⃣ Navigation Screen
- Integrated map navigation to guide the user to their exact parking spot
- Turn-by-turn directions using device maps

#### 6️⃣ Active Parking Screen
- Live timer showing parking duration
- Estimated cost updating in real time
- Option to extend parking time

#### 7️⃣ History Screen
- Full log of past parking sessions
- Date, location, duration, and amount paid

#### 8️⃣ Profile Screen
- User account details
- Saved vehicles
- Payment methods
- Settings & preferences

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📍 **Live Location Detection** | Automatically detects user's location on launch |
| 🗺️ **Interactive Map** | Real-time map showing all nearby parking zones |
| 🅿️ **Slot Availability** | Live green/red slot status updated in real time |
| 📅 **Advance Booking** | Reserve a parking spot before you arrive |
| ⏱️ **Duration Tracking** | Automatic timer that tracks your parking time |
| 💳 **Payment Integration** | Seamless in-app payment on exit |
| 🧾 **Digital Receipt** | Instant booking confirmation and receipt |
| 📜 **Parking History** | Complete log of all past sessions |
| 🔔 **Notifications** | Alerts for booking confirmation and expiry |
| 🌙 **Dark Mode** | Full dark and light theme support |
| 📱 **Cross-Platform** | Works on iOS, Android, and Web |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Expo** | ~54.0 | App framework & build tooling |
| **React Native** | 0.81.5 | Cross-platform mobile UI |
| **TypeScript** | ~5.9 | Type-safe development |
| **Expo Router** | ~6.0 | File-based navigation system |

### UI & Styling
| Technology | Version | Purpose |
|---|---|---|
| **React Native Maps** | 1.20.1 | Interactive map component |
| **Expo Linear Gradient** | ~15.0 | Gradient backgrounds |
| **Expo Blur** | ~15.0 | Blur effects |
| **Lucide React Native** | ^0.475 | Icon library |
| **Expo Vector Icons** | ^15.0 | Extended icon set |

### State & Data Management
| Technology | Version | Purpose |
|---|---|---|
| **Zustand** | ^5.0 | Global state management |
| **TanStack Query** | ^5.83 | Server state & data fetching |
| **Async Storage** | 2.2.0 | Local data persistence |

### Device Features
| Technology | Purpose |
|---|---|
| **Expo Location** | GPS & location services |
| **Expo Haptics** | Touch feedback |
| **Expo Image Picker** | Profile photo upload |
| **Expo Notifications** | Push notifications |

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your phone (for testing)

### 📦 Installation
```bash
# 1. Clone the repository
git clone https://github.com/varatharajan-tech/Smart-Car-Parking.git

# 2. Navigate into the project
cd Smart-Car-Parking

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

### 📲 Running on Your Device

After running `npm start`, a QR code will appear in the terminal.

| Platform | Steps |
|---|---|
| **Android** | Open Expo Go app → Scan QR code |
| **iOS** | Open Camera app → Scan QR code |
| **Web** | Press `W` in the terminal |
| **Android Emulator** | Press `A` in the terminal |
| **iOS Simulator** | Press `I` in the terminal |

---

## 📁 App Structure
```
Smart-Car-Parking/
│
├── 📂 app/                    # All screens (Expo Router)
│   ├── (tabs)/                # Bottom tab screens
│   │   ├── index.tsx          # Home / Map screen
│   │   ├── booking.tsx        # Bookings screen
│   │   ├── history.tsx        # Parking history
│   │   └── profile.tsx        # User profile
│   ├── parking/
│   │   └── [id].tsx           # Parking lot detail screen
│   └── _layout.tsx            # Root layout
│
├── 📂 components/             # Reusable UI components
│   ├── ParkingCard.tsx        # Parking lot card
│   ├── SlotGrid.tsx           # Slot availability grid
│   ├── MapMarker.tsx          # Custom map marker
│   └── BookingModal.tsx       # Booking confirmation modal
│
├── 📂 store/                  # Zustand global state
│   ├── useAuthStore.ts        # Authentication state
│   ├── useParkingStore.ts     # Parking data state
│   └── useBookingStore.ts     # Booking state
│
├── 📂 hooks/                  # Custom React hooks
│   ├── useLocation.ts         # GPS location hook
│   └── useParkingData.ts      # Parking data fetching
│
├── 📂 constants/              # App-wide constants
│   ├── Colors.ts              # Theme colors
│   └── Config.ts              # App configuration
│
├── 📂 assets/                 # Static assets
│   └── images/                # Icons & images
│
├── app.json                   # Expo configuration
├── package.json               # Dependencies
└── tsconfig.json              # TypeScript config
```

---

## 🌐 Deployment

### Web (Render)
The web version is live and deployed on Render as a static site.
```bash
# Build for web
npx expo export -p web
```

🔗 **Live URL:** [https://smart-car-parking.onrender.com](https://smart-car-parking.onrender.com)

### Mobile (EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 🤝 Contributing

Contributions are always welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.

---

## 👨‍💻 Author

<div align="center">

**Varatharajan K**

[![GitHub](https://img.shields.io/badge/GitHub-varatharajan--tech-black?style=for-the-badge&logo=github)](https://github.com/varatharajan-tech)





*Built with ❤️ using Expo & React Native*

</div>
