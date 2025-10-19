# SSA Frontend User

A modern Angular application for the Smart Space Assistant (SSA) user interface, built with Angular 20, TypeScript, and TailwindCSS. This application provides users with an intuitive interface to explore places, events, and manage reservations.

## 🚀 Tech Stack

- **Frontend Framework**: Angular 20.1.0
- **Language**: TypeScript 5.8.2
- **Styling**: TailwindCSS 3.4.11 with Typography Plugin
- **Build Tool**: Angular CLI with Vite
- **Package Manager**: npm
- **Testing**: Jasmine + Karma
- **PostCSS**: Autoprefixer for cross-browser compatibility

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── input-events/    # Event input component
│   │   └── navbar/          # Navigation bar component
│   ├── pages/               # Application pages
│   │   ├── chatbot-page/    # AI chatbot interface
│   │   ├── events/          # Event details page
│   │   ├── home/            # Home dashboard
│   │   ├── loading/         # Loading screen
│   │   ├── my-profile/      # User profile page
│   │   ├── places-list/     # Places listing page
│   │   ├── places-page/     # Individual place page
│   │   └── saved-page/      # Saved items page
│   ├── services/            # API and business logic services
│   │   ├── api.service.ts   # Backend API communication
│   │   └── favorite.service.ts # Favorites management
│   ├── app.config.ts        # App configuration
│   ├── app.routes.ts        # Route definitions
│   └── app.ts               # Main app component
├── index.html               # Main HTML entry point
├── main.ts                  # Application bootstrap
└── styles.css               # Global styles with TailwindCSS
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SSA-FrontendUser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   
   The application will be available at `http://localhost:4201`

## 🚀 Available Scripts

- `npm start` - Start development server on port 4201
- `npm run start:dev` - Start development server with development configuration
- `npm run build` - Build the application for production
- `npm run watch` - Build with watch mode for development
- `npm test` - Run unit tests with Jasmine and Karma

## 🌐 Environment Configuration

The application supports environment-specific configurations for different deployment stages. You can create environment files to manage API URLs and other configuration values:

### Development Environment
Create `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',
  // Add other development-specific configurations
};
```

### Production Environment
Create `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  // Add other production-specific configurations
};
```

### Using Environment Variables
Update your services to use environment configurations:
```typescript
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  // ... rest of your service
}
```

## 📱 Mobile App Development

This Angular application can be converted into a native mobile app using **Capacitor**:

### 1. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

### 2. Add Android Platform
```bash
npm install @capacitor/android
npx cap add android
```

### 3. Build and Sync
```bash
npm run build
npx cap sync
```

### 4. Generate APK
```bash
npx cap open android
```
This opens Android Studio where you can build and generate the APK file for installation on Android devices.

### 5. Build APK from Command Line
```bash
cd android
./gradlew assembleDebug
```
The APK will be generated in `android/app/build/outputs/apk/debug/`

## 🎨 Styling and Theming

The application uses TailwindCSS with custom color palette:

- **Scape Cream**: `#FEF5E6`
- **Scape Teal**: `#96BCA5`
- **Scape Green**: `#6D9386`
- **Scape Dark**: `#354B48`

Custom font family: **Lexend Deca**

## 🔧 API Integration

The application communicates with the SSA Backend API through the `ApiService`. Key features include:

- **Places Management**: Browse and view place details
- **Events System**: View events and event details
- **Reservations**: Start and manage reservation sessions
- **Event Booking**: Book tickets for events
- **Favorites**: Save and manage favorite places/events

## 🧪 Testing

Run the test suite:
```bash
npm test
```

The application uses Angular's testing framework with Jasmine and Karma for unit testing.

## 📦 Build and Deployment

### Development Build
```bash
npm run build
```

### Production Build
```bash
npm run build --configuration=production
```

The built files will be in the `dist/` directory, ready for deployment to any web server.

## 🔗 Backend Integration

This frontend application is designed to work with the SSA Backend API. Make sure the backend is running and accessible at the configured API URL.

## 📄 License

This project is part of the SSA (Smart Space Assistant) system developed for the Craiova Hackathon.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.