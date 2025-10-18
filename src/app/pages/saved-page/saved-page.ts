import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FavoriteService, FavoriteEvent, FavoritePlace } from '../../services/favorite.service';

interface SavedEvent {
  id: number;
  title: string;
  location: string;
  date: { day: string; month: string };
  image: string;
  isFavorite: boolean;
}

interface SavedPlace {
  id: number;
  name: string;
  address: string;
  image: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-saved-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './saved-page.html',
  styleUrl: './saved-page.css'
})
export class SavedPageComponent implements OnInit, OnDestroy {
  city = 'CRAIOVA';
  searchQuery = '';

  savedEvents: SavedEvent[] = [];
  savedPlaces: SavedPlace[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFavorites();
    
    // Subscribe to favorite changes
    this.favoriteService.favoriteEvents$.subscribe(events => {
      this.savedEvents = events.map(event => this.convertToSavedEvent(event));
    });
    
    this.favoriteService.favoritePlaces$.subscribe(places => {
      this.savedPlaces = places.map(place => this.convertToSavedPlace(place));
    });
  }

  ngOnDestroy() {
    // Clean up subscriptions if needed
  }

  private loadFavorites() {
    this.savedEvents = this.favoriteService.getFavoriteEvents().map(event => this.convertToSavedEvent(event));
    this.savedPlaces = this.favoriteService.getFavoritePlaces().map(place => this.convertToSavedPlace(place));
  }

  private convertToSavedEvent(event: FavoriteEvent): SavedEvent {
    return {
      id: parseInt(event.id),
      title: event.name,
      location: event.address || 'Unknown location',
      date: this.formatEventDate(event.date),
      image: this.getEventImage(event),
      isFavorite: true
    };
  }

  private convertToSavedPlace(place: FavoritePlace): SavedPlace {
    return {
      id: place.id,
      name: place.name,
      address: place.address,
      image: this.getPlaceImage(place),
      isFavorite: true
    };
  }

  private formatEventDate(dateString?: string): { day: string, month: string } {
    if (!dateString) {
      return { day: 'TBD', month: '' };
    }
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString();
      const month = date.toLocaleDateString('en', { month: 'short' }).toLowerCase();
      return { day, month };
    } catch {
      return { day: 'TBD', month: '' };
    }
  }

  private getEventImage(event: FavoriteEvent): string {
    if (event.images_paths && Array.isArray(event.images_paths) && event.images_paths.length > 0) {
      const imagePath = event.images_paths[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:8000${imagePath}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292';
  }

  private getPlaceImage(place: FavoritePlace): string {
    if (place.image_path) {
      if (place.image_path.startsWith('http')) {
        return place.image_path;
      }
      return `http://localhost:8000${place.image_path}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238';
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    console.log('Search:', this.searchQuery);
  }

  onEventClick(event: SavedEvent) {
    // Find the original favorite event to get place_id
    const originalEvent = this.favoriteService.getFavoriteEvents().find(e => e.id === event.id.toString());
    if (originalEvent) {
      this.router.navigate(['/event', originalEvent.place_id, originalEvent.id]);
    }
  }

  onPlaceClick(place: SavedPlace) {
    this.router.navigate(['/places-page', place.id]);
  }

  toggleEventFavorite(event: SavedEvent) {
    // Find the original favorite event
    const originalEvent = this.favoriteService.getFavoriteEvents().find(e => e.id === event.id.toString());
    if (originalEvent) {
      this.favoriteService.toggleEventFavorite(originalEvent);
    }
  }

  togglePlaceFavorite(place: SavedPlace) {
    // Find the original favorite place
    const originalPlace = this.favoriteService.getFavoritePlaces().find(p => p.id === place.id);
    if (originalPlace) {
      this.favoriteService.togglePlaceFavorite(originalPlace);
    }
  }
}
