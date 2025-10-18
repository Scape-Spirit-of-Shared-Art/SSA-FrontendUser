# Backend Setup Instructions

## Prerequisites

Make sure the SSA Backend is running before using the frontend application.

## Backend URL Configuration

The frontend is configured to connect to the backend at:
- **URL**: `http://localhost:8000`
- **API Base**: `http://localhost:8000`

This URL is configured in `/src/app/services/api.service.ts`.

## Starting the Backend

1. Navigate to the SSA-Backend directory:
   ```bash
   cd SSA-Backend
   ```

2. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate     # On Windows
   ```

3. Start the backend server:
   ```bash
   python backend_admin.py
   ```

The backend should be running on `http://localhost:8000` and you should see the API documentation at `http://localhost:8000/docs`.

## Frontend Features

The frontend now includes:

### Home Page (`/home`)
- **Real Events Display**: Fetches and displays all events from the backend
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Displays error messages with retry functionality
- **Empty State**: Shows message when no events are available
- **Event Cards**: Each event card shows:
  - Event image (from backend or fallback)
  - Event name
  - Event date (formatted from backend date)
  - Event address/location

### Event Detail Page (`/event`)
- **Dynamic Event Loading**: Loads the first available event from backend
- **Event Information**: Displays all event details including:
  - Event name and description
  - Program/schedule (if available)
  - Contact information (website, email, phone, address)
  - Event images
- **Loading/Error States**: Handles loading and error scenarios
- **Get Tickets**: Links to event website

## API Integration

The frontend uses the following backend endpoints:

- `GET /places` - Fetches all places with their events
- `GET /places/{id}/events` - Fetches events for a specific place
- `GET /places/{id}/events/{event_id}` - Fetches a specific event

## Image Handling

- Event images are served from the backend's `/uploads` directory
- If an event has no images, a fallback image is used
- Images are properly formatted with the backend URL when needed

## Error Handling

- Network errors are caught and displayed to users
- Retry functionality is available for failed requests
- Graceful fallbacks for missing data

## Development

To modify the backend URL, update the `baseUrl` property in `/src/app/services/api.service.ts`.

To add new API endpoints, extend the `ApiService` class with new methods.
