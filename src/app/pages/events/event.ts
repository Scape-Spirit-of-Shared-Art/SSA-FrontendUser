import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { InputEventsComponent } from '../../components/input-events/input-events';
import { ApiService, Event } from '../../services/api.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, NavbarComponent, InputEventsComponent],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class EventComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  showTicketInput = false;

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Get place ID and event ID from route parameters
    this.route.params.subscribe(params => {
      const placeId = +params['placeId'];
      const eventId = params['eventId'];
      
      if (placeId && eventId) {
        this.loadEvent(placeId, eventId);
      } else {
        this.error = 'Invalid event parameters';
        this.loading = false;
      }
    });
  }

  loadEvent(placeId: number, eventId: string) {
    this.loading = true;
    this.error = null;
    
    this.apiService.getEvent(placeId, eventId).subscribe({
      next: (response) => {
        this.event = response.event;
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
    this.showTicketInput = true;
  }

  onWebsiteClick() {
    if (this.event && this.event.website) {
      window.open(this.event.website, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/home']);
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
