# WayPoint

Mobile pet grooming management application built with Expo, React Native, and Firebase.

## Features

- User authentication with Firebase Auth
- Offline-first architecture with data synchronization
- Todo management and task scheduling
- Modern UI with theme support
- Secure data storage and Firebase integration

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- (Optional) Firebase Emulators for local development

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/waypoint.git
cd waypoint
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Then edit `.env` file with your own values.

4. Start the development server
```bash
npx expo start
```

### Firebase Setup

This project uses Firebase for authentication, data storage, and cloud functions. To set up:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication services (Email/Password)
3. Create Firestore database
4. Add your Firebase configuration values to `.env` file

## Development

### Project Structure

- `app/` - Application source code (uses Expo Router)
  - `(tabs)/` - Tab-based navigation screens
  - `auth/` - Authentication screens
  - `components/` - Reusable UI components
  - `context/` - React context providers
  - `models/` - TypeScript interfaces and models
  - `services/` - API services and data access
  - `utils/` - Utility functions and helpers

### Firebase Emulators (Optional)

For local development without using actual Firebase services:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase project: `firebase init`
3. Start emulators: `firebase emulators:start`
4. Set `EXPO_PUBLIC_APP_ENV=development` in your `.env` file

## Troubleshooting

### Authentication Issues

If you encounter "auth/network-request-failed" errors:
- Verify your Firebase configuration values in `.env`
- Make sure Firebase Authentication is properly enabled in Firebase Console
- Set `EXPO_PUBLIC_APP_ENV=production` to use real Firebase services instead of emulators

### Metro Build Errors

If you encounter build errors with module resolution:
- Try clearing the Metro bundler cache: `npx expo start --clear`
- Update metro.config.mjs if new directories need to be excluded from routing

### Missing Default Export Warnings

You may see warnings about missing default exports in various utility files:
```
Route "./utils/storage.ts" is missing the required default export. Ensure a React component is exported as default.
```

These warnings occur because Expo Router treats any file in the app directory as a potential route. They don't affect app functionality but can be addressed in several ways:
1. Add default exports to each utility file
2. Use the index files in each directory that re-export with default exports
3. Further update metro.config.mjs to better exclude utility files from routing
4. You can ignore these warnings as they don't impact app functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.
