import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Event } from '../../services/api.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class EventComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // For now, we'll load the first available event
    // In a real app, you'd get the event ID from route parameters
    this.loadFirstEvent();
  }

  loadFirstEvent() {
    this.loading = true;
    this.error = null;
    
    this.apiService.getAllEvents().subscribe({
      next: (events) => {
        if (events.length > 0) {
          this.event = events[0];
        } else {
          this.error = 'No events available';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.error = 'Failed to load event';
        this.loading = false;
      }
    });
  }

  onGetTickets() {
    if (this.event && this.event.website) {
      window.open(this.event.website, '_blank');
    }
  }

  onWebsiteClick() {
    if (this.event && this.event.website) {
      window.open(this.event.website, '_blank');
    }
  }

  // Helper method to get event image
  getEventImage(): string {
    if (this.event && this.event.images_paths && Array.isArray(this.event.images_paths) && this.event.images_paths.length > 0) {
      const imagePath = this.event.images_paths[0];
      return `http://localhost:8000${imagePath}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/f5bbcd2f649e44129dac264705bdc23f1c4503db?width=768';
  }
}
