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
              allEvents.push(...place.events);
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
}
