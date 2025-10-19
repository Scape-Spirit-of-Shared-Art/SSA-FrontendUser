import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { InputEventsComponent } from '../../components/input-events/input-events';
import { ApiService, Event } from '../../services/api.service';
import { FavoriteService, FavoriteEvent } from '../../services/favorite.service';

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
  isEventFavorite = false;

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute,
    private router: Router,
    private favoriteService: FavoriteService
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
        this.isEventFavorite = this.favoriteService.isEventFavorite(eventId, placeId);
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

  toggleEventFavorite() {
    if (this.event) {
      const favoriteEvent: FavoriteEvent = {
        id: this.event.id,
        place_id: this.event.place_id || 0,
        name: this.event.name,
        bio: this.event.bio,
        address: this.event.address,
        date: this.event.date,
        images_paths: this.event.images_paths,
        website: this.event.website,
        email: this.event.email,
        phone_number: this.event.phone_number
      };
      
      this.isEventFavorite = this.favoriteService.toggleEventFavorite(favoriteEvent);
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

  // Handle booking completion
  onBookingComplete(bookingResult: any) {
    console.log('Booking completed:', bookingResult);
    // You can add additional logic here, such as showing a success message
    // or redirecting to a confirmation page
    alert('Tickets booked successfully!');
  }

  // Handle booking errors
  onBookingError(error: string) {
    console.error('Booking error:', error);
    alert(`Booking failed: ${error}`);
  }
}
