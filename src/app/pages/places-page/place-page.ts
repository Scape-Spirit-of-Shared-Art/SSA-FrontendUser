import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Place, Event } from '../../services/api.service';

interface FloorSection {
  number: number;
  capacity: number;
  occupied: number;
  position: 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'center';
}

@Component({
  selector: 'app-place-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './place-page.html',
  styleUrl: './place-page.css'
})
export class PlacePageComponent implements OnInit {
  place: Place | null = null;
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const placeId = +params['id'];
      this.loadPlaceData(placeId);
    });
  }

  loadPlaceData(placeId: number) {
    this.loading = true;
    this.error = null;

    this.apiService.getPlaceById(placeId).subscribe({
      next: (response) => {
        this.place = response.place;
        this.events = response.place.events || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading place:', error);
        this.error = 'Failed to load place data';
        this.loading = false;
      }
    });
  }

  floorSections: FloorSection[] = [
    { number: 1, capacity: 10, occupied: 1, position: 'center' },
    { number: 3, capacity: 10, occupied: 2, position: 'right-top' },
    { number: 4, capacity: 10, occupied: 2, position: 'right-top' },
    { number: 5, capacity: 10, occupied: 1, position: 'right-bottom' },
    { number: 6, capacity: 10, occupied: 3, position: 'left-top' },
    { number: 7, capacity: 10, occupied: 1, position: 'left-top' },
    { number: 8, capacity: 10, occupied: 2, position: 'left-bottom' },
    { number: 9, capacity: 10, occupied: 2, position: 'left-bottom' }
  ];

  onEventClick(event: Event) {
    console.log('Event clicked:', event);
    if (this.place && event.place_id) {
      this.router.navigate(['/event', event.place_id, event.id]);
    }
  }

  onGetTickets() {
    if (this.place && this.place.website) {
      window.open(this.place.website, '_blank');
    }
  }

  onWebsiteClick() {
    if (this.place && this.place.website) {
      window.open(this.place.website, '_blank');
    }
  }

  // Helper method to get full image URL
  getPlaceImage(): string {
    if (this.place && this.place.image_path) {
      if (this.place.image_path.startsWith('http')) {
        return this.place.image_path;
      }
      return `http://localhost:8000${this.place.image_path}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/7c4a4693085ea05fe2f0c81de0b2b4f284588fea?width=762';
  }

  // Helper method to get event image
  getEventImage(event: Event): string {
    if (event.images_paths && Array.isArray(event.images_paths) && event.images_paths.length > 0) {
      const imagePath = event.images_paths[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:8000${imagePath}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292';
  }

  // Helper method to format date for display
  formatEventDate(dateString?: string): { day: string, month: string } {
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

  getOccupancyLevel(section: FloorSection): 'low' | 'medium' | 'high' {
    const percentage = (section.occupied / section.capacity) * 100;
    if (percentage < 33) return 'low';
    if (percentage < 66) return 'medium';
    return 'high';
  }

  getUserIcons(count: number): number[] {
    return Array(Math.min(count, 3)).fill(0);
  }
}
