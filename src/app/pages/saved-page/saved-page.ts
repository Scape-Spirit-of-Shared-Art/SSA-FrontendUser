import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar';

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
export class SavedPageComponent {
  city = 'CRAIOVA';
  searchQuery = '';

  savedEvents: SavedEvent[] = [
    {
      id: 1,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      isFavorite: true
    },
    {
      id: 2,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      isFavorite: true
    },
    {
      id: 3,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      isFavorite: true
    },
    {
      id: 4,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      isFavorite: true
    }
  ];

  savedPlaces: SavedPlace[] = [
    {
      id: 1,
      name: 'Museum',
      address: 'Strada 24 Ianuarie 4, Craiova',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Museum',
      address: 'Strada 24 Ianuarie 4, Craiova',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Museum',
      address: 'Strada 24 Ianuarie 4, Craiova',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238',
      isFavorite: true
    },
    {
      id: 4,
      name: 'Museum',
      address: 'Strada 24 Ianuarie 4, Craiova',
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238',
      isFavorite: true
    }
  ];

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    console.log('Search:', this.searchQuery);
  }

  onEventClick(event: SavedEvent) {
    console.log('Event clicked:', event);
  }

  onPlaceClick(place: SavedPlace) {
    console.log('Place clicked:', place);
  }

  toggleEventFavorite(event: SavedEvent) {
    event.isFavorite = !event.isFavorite;
    console.log('Event favorite toggled:', event);
  }

  togglePlaceFavorite(place: SavedPlace) {
    place.isFavorite = !place.isFavorite;
    console.log('Place favorite toggled:', place);
  }
}
