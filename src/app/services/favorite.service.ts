import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FavoriteEvent {
  id: string;
  place_id: number;
  name: string;
  bio?: string;
  address?: string;
  date?: string;
  images_paths?: string[];
  website?: string;
  email?: string;
  phone_number?: string;
}

export interface FavoritePlace {
  id: number;
  name: string;
  bio: string;
  address: string;
  image_path: string; // Keep as image_path for favorite service compatibility
  categories: string[];
  website?: string;
  email?: string;
  phone_number?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly EVENTS_KEY = 'favorite_events';
  private readonly PLACES_KEY = 'favorite_places';
  
  private favoriteEventsSubject = new BehaviorSubject<FavoriteEvent[]>([]);
  private favoritePlacesSubject = new BehaviorSubject<FavoritePlace[]>([]);

  public favoriteEvents$ = this.favoriteEventsSubject.asObservable();
  public favoritePlaces$ = this.favoritePlacesSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Load events
    const eventsJson = localStorage.getItem(this.EVENTS_KEY);
    if (eventsJson) {
      try {
        const events = JSON.parse(eventsJson);
        this.favoriteEventsSubject.next(events);
      } catch (error) {
        console.error('Error parsing favorite events from localStorage:', error);
        this.favoriteEventsSubject.next([]);
      }
    }

    // Load places
    const placesJson = localStorage.getItem(this.PLACES_KEY);
    if (placesJson) {
      try {
        const places = JSON.parse(placesJson);
        this.favoritePlacesSubject.next(places);
      } catch (error) {
        console.error('Error parsing favorite places from localStorage:', error);
        this.favoritePlacesSubject.next([]);
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(this.favoriteEventsSubject.value));
    localStorage.setItem(this.PLACES_KEY, JSON.stringify(this.favoritePlacesSubject.value));
  }

  // Event methods
  addEventToFavorites(event: FavoriteEvent): void {
    const currentEvents = this.favoriteEventsSubject.value;
    const exists = currentEvents.some(e => e.id === event.id && e.place_id === event.place_id);
    
    if (!exists) {
      const updatedEvents = [...currentEvents, event];
      this.favoriteEventsSubject.next(updatedEvents);
      this.saveToStorage();
    }
  }

  removeEventFromFavorites(eventId: string, placeId: number): void {
    const currentEvents = this.favoriteEventsSubject.value;
    const updatedEvents = currentEvents.filter(e => !(e.id === eventId && e.place_id === placeId));
    this.favoriteEventsSubject.next(updatedEvents);
    this.saveToStorage();
  }

  isEventFavorite(eventId: string, placeId: number): boolean {
    const currentEvents = this.favoriteEventsSubject.value;
    return currentEvents.some(e => e.id === eventId && e.place_id === placeId);
  }

  toggleEventFavorite(event: FavoriteEvent): boolean {
    if (this.isEventFavorite(event.id, event.place_id)) {
      this.removeEventFromFavorites(event.id, event.place_id);
      return false;
    } else {
      this.addEventToFavorites(event);
      return true;
    }
  }

  // Place methods
  addPlaceToFavorites(place: FavoritePlace): void {
    const currentPlaces = this.favoritePlacesSubject.value;
    const exists = currentPlaces.some(p => p.id === place.id);
    
    if (!exists) {
      const updatedPlaces = [...currentPlaces, place];
      this.favoritePlacesSubject.next(updatedPlaces);
      this.saveToStorage();
    }
  }

  removePlaceFromFavorites(placeId: number): void {
    const currentPlaces = this.favoritePlacesSubject.value;
    const updatedPlaces = currentPlaces.filter(p => p.id !== placeId);
    this.favoritePlacesSubject.next(updatedPlaces);
    this.saveToStorage();
  }

  isPlaceFavorite(placeId: number): boolean {
    const currentPlaces = this.favoritePlacesSubject.value;
    return currentPlaces.some(p => p.id === placeId);
  }

  togglePlaceFavorite(place: FavoritePlace): boolean {
    if (this.isPlaceFavorite(place.id)) {
      this.removePlaceFromFavorites(place.id);
      return false;
    } else {
      this.addPlaceToFavorites(place);
      return true;
    }
  }

  // Get current values
  getFavoriteEvents(): FavoriteEvent[] {
    return this.favoriteEventsSubject.value;
  }

  getFavoritePlaces(): FavoritePlace[] {
    return this.favoritePlacesSubject.value;
  }

  // Clear all favorites
  clearAllFavorites(): void {
    this.favoriteEventsSubject.next([]);
    this.favoritePlacesSubject.next([]);
    this.saveToStorage();
  }
}
