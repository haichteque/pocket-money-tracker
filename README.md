# Pocket Money Tracker 💸

A clean, dark-themed mobile app for tracking budget entries and expenses — built with **React Native** and **Expo**.

Create budget entries (e.g. "Pocket money for July"), set a budget amount, then log individual expenses against it. A live budget bar shows you how much you've spent and how much remains at a glance.

---

## Features

- 📋 **Budget entries** — Create named entries with a total budget and currency
- 💰 **Expense tracking** — Log individual expenses with a name and cost
- 📊 **Live budget bar** — Visual indicator of remaining vs spent budget
- 🌍 **Multi-currency support** — Choose from a list of supported currencies
- 🗑️ **Delete entries & expenses** — Full CRUD support
- 💾 **Persistent storage** — Data saved locally via AsyncStorage
- 🌑 **Dark mode UI** — Fully dark themed interface

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Expo](https://expo.dev) (SDK 57) |
| Language | TypeScript |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| Storage | [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) |
| State | React Context API |

## Project Structure

```
src/
├── app/                  # File-based routes (Expo Router)
│   ├── index.tsx         # Home screen — list of all entries
│   ├── create.tsx        # Create a new budget entry
│   ├── entry/[id].tsx    # Entry detail — expenses list + add expense
│   └── edit/[id].tsx     # Edit an existing entry
├── components/           # Reusable UI components
├── constants/            # Theme tokens (colors, spacing, fonts)
├── context/              # EntriesContext — global state & persistence
├── utils/                # Helper functions (formatting, calculations)
└── types.ts              # TypeScript interfaces (Entry, Expense)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your phone, or an Android/iOS emulator

### Run locally

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS) to open the app on your device.

## Building the APK

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for cloud builds.

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build a preview APK (Android)
eas build -p android --profile preview
```

The APK download link will be available in your [Expo dashboard](https://expo.dev) once the build completes (~10–15 min).

## License

[MIT](./LICENSE)
