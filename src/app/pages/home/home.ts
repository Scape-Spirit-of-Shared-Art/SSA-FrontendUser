import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Event } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'Failed to load events';
        this.loading = false;
      }
    });
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

  // Helper method to get event image
  getEventImage(event: Event): string {
    if (event.images_paths && Array.isArray(event.images_paths) && event.images_paths.length > 0) {
      const imagePath = event.images_paths[0];
      return `http://localhost:8000${imagePath}`;
    }
    // Use the same fallback image that's currently showing
    return 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292';
  }

  cityLayers = [
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/85d9efefd748842a32f5c5ebbb323a7a21470f76?width=334',
      title: 'City Treasures'
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/ed77f7494ccff826462966e31decd5e901b98327?width=334',
      title: 'The Refined Side'
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2974cfacb7173024ab189548b19d8001cf64f14d?width=334',
      title: 'The Fun Side'
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/8971eb81adb72a4c7a75dc57ed94f911265771bf?width=334',
      title: 'SportSphere'
    }
  ];

  otherBeat = [
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/b79347eeb3ec9c730bc7811b4e800a7bd80c2e62?width=104',
      title: 'City Stays'
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/6860545cc94bfe1e0939088a41ad7b9c3bf99711?width=104',
      title: 'Taste District'
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/5ab49cf1ccfe030515228cc8bde2e20c4af45baa?width=104',
      title: 'HEALTH and beauty'
    }
  ];

  onSearch(event: any) {
    const input = event.target as HTMLInputElement;
    console.log('Search:', input.value);
  }

  onEventClick(event: Event) {
    console.log('Event clicked:', event);
    // You can add navigation to event details here
    // For example: this.router.navigate(['/event', event.id]);
  }

  onCategoryClick(category: any) {
    console.log('Category clicked:', category);
  }
}
