import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(private apiService: ApiService, private router: Router) {}

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
      image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop&q=80',
      title: 'City Treasures',
      route: 'city-treasures'
    },
    {
      image: 'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=600&h=400&fit=crop&q=80',
      title: 'The Refined Side',
      route: 'refined-side'
    },
    {
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop&q=80',
      title: 'The Fun Side',
      route: 'fun-side'
    },
    {
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop&q=80',
      title: 'SportSphere',
      route: 'sport-sphere'
    }
  ];

  otherBeat = [
    {
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop&q=80',
      title: 'City Stays',
      route: 'city-stays'
    },
    {
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop&q=80',
      title: 'Taste District',
      route: 'taste-district'
    },
    {
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600&h=400&fit=crop&q=80',
      title: 'HEALTH and beauty',
      route: 'health-beauty'
    }
  ];

  onSearch(event: any) {
    const input = event.target as HTMLInputElement;
    console.log('Search:', input.value);
  }

  onEventClick(event: Event) {
    console.log('Event clicked:', event);
    if (event.place_id) {
      this.router.navigate(['/event', event.place_id, event.id]);
    } else {
      console.error('Event missing place_id:', event);
    }
  }

  onCategoryClick(category: any) {
    console.log('Category clicked:', category);
    if (category.route) {
      this.router.navigate(['/places-list', category.route]);
    }
  }
}
