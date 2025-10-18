import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Event {
  id: string;
  name: string;
  bio: string;
  max_participants: number;
  website: string;
  email: string;
  phone_number: string;
  address: string;
  program: string[];
  images_paths: string[];
  date?: string;
  place_id?: number; // Add place ID to track which place the event belongs to
}

export interface Place {
  id: number;
  name: string;
  bio: string;
  website: string;
  email: string;
  phone_number: string;
  address: string;
  floormaps: any;
  categories: string[];
  password: string;
  monday_friday: string;
  saturday: string;
  sunday: string;
  events: Event[];
  image_path: string;
}

// Reservation interfaces
export interface StartReservationRequest {
  user_prompt: string;
}

export interface StartReservationResponse {
  session_id: string;
  status: string;
  message: string;
}

export interface ReservationSession {
  session_id: string;
  status: string;
  user_prompt: string;
  waiting_for_input: boolean;
  created_at: number;
  updated_at: number;
  result?: any;
  error?: string;
}

export interface AllSessionsResponse {
  total_sessions: number;
  sessions: { [sessionId: string]: any };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000'; // Backend admin API URL

  constructor(private http: HttpClient) {}

  // Get all places with their events
  getAllPlaces(): Observable<{places: Place[]}> {
    return this.http.get<{places: Place[]}>(`${this.baseUrl}/places`);
  }

  // Get all events from all places
  getAllEvents(): Observable<Event[]> {
    return new Observable(observer => {
      this.getAllPlaces().subscribe({
        next: (response) => {
          const allEvents: Event[] = [];
          response.places.forEach(place => {
            if (place.events && place.events.length > 0) {
              // Add place_id to each event
              const eventsWithPlaceId = place.events.map(event => ({
                ...event,
                place_id: place.id
              }));
              allEvents.push(...eventsWithPlaceId);
            }
          });
          observer.next(allEvents);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Get a specific place by ID
  getPlaceById(id: number): Observable<{place: Place}> {
    return this.http.get<{place: Place}>(`${this.baseUrl}/places/${id}`);
  }

  // Get events for a specific place
  getPlaceEvents(placeId: number): Observable<{events: Event[]}> {
    return this.http.get<{events: Event[]}>(`${this.baseUrl}/places/${placeId}/events`);
  }

  // Get a specific event
  getEvent(placeId: number, eventId: string): Observable<{event: Event}> {
    return this.http.get<{event: Event}>(`${this.baseUrl}/places/${placeId}/events/${eventId}`);
  }

  // Reservation API methods
  startReservation(request: StartReservationRequest): Observable<StartReservationResponse> {
    return this.http.post<StartReservationResponse>(`${this.baseUrl}/reservations/start`, request);
  }

  getReservationStatus(sessionId: string): Observable<ReservationSession> {
    return this.http.get<ReservationSession>(`${this.baseUrl}/reservations/${sessionId}/status`);
  }

  deleteReservationSession(sessionId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.baseUrl}/reservations/${sessionId}`);
  }

  getAllReservationSessions(): Observable<AllSessionsResponse> {
    return this.http.get<AllSessionsResponse>(`${this.baseUrl}/reservations/`);
  }
}
