import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Event, StartEventBookingRequest } from '../../services/api.service';

@Component({
  selector: 'app-input-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ticket-purchase-container">
      <h1 class="heading">Pick your number—we'll handle the rest.</h1>
      
      <div class="input-wrapper">
        <input 
          type="text" 
          [(ngModel)]="ticketNumber"
          placeholder="type here"
          class="ticket-input"
          (input)="onInputChange()"
        />
      </div>

      <p class="tickets-remaining">!{{ getTicketsLeft() }} tickets left!</p>
      
      <button 
        class="get-tickets-btn"
        (click)="onGetTickets()"
        [disabled]="!ticketNumber.trim() || isBooking"
      >
        {{ isBooking ? 'Processing...' : 'Get Tickets' }}
      </button>

      <div *ngIf="bookingStatus" class="booking-status">
        {{ bookingStatus }}
      </div>
    </div>
  `,
  styles: [`
    .ticket-purchase-container {
      width: 100%;
      max-width: 412px;
      height: 321px;
      margin: 0 auto;
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 15px 59px;
      box-sizing: border-box;
      font-family: 'Lexend Deca', -apple-system, Roboto, Helvetica, sans-serif;
    }

    .heading {
      width: 100%;
      max-width: 294px;
      color: #354B48;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      line-height: 110%;
      letter-spacing: 0.24px;
      text-transform: uppercase;
      margin: 0 0 56px 0;
    }

    .input-wrapper {
      width: 100%;
      max-width: 247px;
      margin-bottom: 11px;
    }

    .ticket-input {
      width: 100%;
      height: 50px;
      padding: 0 15px;
      border-radius: 25px;
      border: none;
      border-bottom: 1px solid #3A4F4C;
      background: #FEF5E6;
      color: #354B48;
      font-family: 'Lexend Deca', -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.16px;
      text-transform: lowercase;
      outline: none;
      box-sizing: border-box;
    }

    .ticket-input::placeholder {
      color: #354B48;
      opacity: 1;
    }

    .ticket-input:focus {
      box-shadow: 0 0 0 2px rgba(53, 75, 72, 0.2);
    }

    .tickets-remaining {
      color: #354B48;
      font-size: 24px;
      font-weight: 700;
      line-height: 110%;
      letter-spacing: 0.24px;
      text-transform: uppercase;
      margin: 0 0 20px 0;
    }

    .get-tickets-btn {
      width: 100%;
      max-width: 247px;
      height: 50px;
      background: #354B48;
      color: #FEF5E6;
      border: none;
      border-radius: 25px;
      font-family: 'Lexend Deca', -apple-system, Roboto, Helvetica, sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.16px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
    }

    .get-tickets-btn:hover:not(:disabled) {
      background: #2a3a38;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(53, 75, 72, 0.3);
    }

    .get-tickets-btn:disabled {
      background: #a0a0a0;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .get-tickets-btn:active:not(:disabled) {
      transform: translateY(0);
    }

    .booking-status {
      margin-top: 15px;
      padding: 10px;
      background: #f0f8ff;
      border: 1px solid #354B48;
      border-radius: 8px;
      color: #354B48;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      min-height: 20px;
    }


    /* Responsive */
    @media (max-width: 420px) {
      .ticket-purchase-container {
        padding: 15px 30px;
      }

      .heading {
        max-width: 100%;
      }
    }

    @media (max-width: 380px) {
      .heading {
        font-size: 22px;
      }

      .tickets-remaining {
        font-size: 22px;
      }
    }

    @media (max-width: 340px) {
      .ticket-purchase-container {
        padding: 15px 20px;
      }

      .heading {
        font-size: 20px;
      }

      .tickets-remaining {
        font-size: 20px;
      }

      .ticket-input {
        font-size: 15px;
      }

      .input-wrapper {
        max-width: 220px;
      }
    }
  `]
})
export class InputEventsComponent {
  @Input() event: Event | null = null;
  @Output() bookingComplete = new EventEmitter<any>();
  @Output() bookingError = new EventEmitter<string>();

  ticketNumber: string = '';
  ticketsLeft: number = 30;
  isBooking: boolean = false;
  bookingStatus: string = '';

  constructor(private apiService: ApiService) {}

  onInputChange() {
    console.log('Ticket number:', this.ticketNumber);
  }

  getTicketsLeft(): number {
    if (this.event && this.event.max_participants) {
      return this.event.max_participants;
    }
    return this.ticketsLeft;
  }

  onGetTickets() {
    if (this.ticketNumber.trim() && this.event && !this.isBooking) {
      const requestedTickets = parseInt(this.ticketNumber) || 1;
      const availableTickets = this.getTicketsLeft();
      
      if (requestedTickets > availableTickets) {
        this.bookingError.emit(`Cannot request ${requestedTickets} tickets. Only ${availableTickets} tickets available.`);
        return;
      }
      
      this.startBooking();
    }
  }

  private startBooking() {
    if (!this.event) {
      this.bookingError.emit('No event data available');
      return;
    }

    if (!this.event.website) {
      this.bookingError.emit('Event website URL is required for booking');
      return;
    }

    this.isBooking = true;
    this.bookingStatus = 'Starting booking...';

    const bookingRequest: StartEventBookingRequest = {
      event_url: this.event.website,
      ticket_count: parseInt(this.ticketNumber) || 1
    };

    console.log('Sending booking request:', bookingRequest);
    console.log('Event data:', this.event);

    this.apiService.startEventBooking(bookingRequest).subscribe({
      next: (response) => {
        this.bookingStatus = 'Booking started successfully!';
        console.log('Booking started:', response);
        
        // Poll for booking status
        this.pollBookingStatus(response.session_id);
      },
      error: (error) => {
        console.error('Error starting booking:', error);
        let errorMessage = 'Failed to start booking';
        
        if (error.status === 500) {
          errorMessage = 'Server error: Browser automation failed. Please ensure Google Chrome is installed.';
        } else if (error.status === 422) {
          errorMessage = 'Invalid request format. Please check your input.';
        } else if (error.error?.detail) {
          errorMessage = `Server error: ${error.error.detail}`;
        }
        
        this.bookingError.emit(errorMessage);
        this.isBooking = false;
        this.bookingStatus = '';
      }
    });
  }

  private pollBookingStatus(sessionId: string) {
    const pollInterval = setInterval(() => {
      this.apiService.getEventBookingStatus(sessionId).subscribe({
        next: (status) => {
          this.bookingStatus = `Status: ${status.status}`;
          
          if (status.status === 'completed') {
            clearInterval(pollInterval);
            this.isBooking = false;
            this.bookingComplete.emit(status);
            this.bookingStatus = 'Booking completed successfully!';
          } else if (status.status === 'failed' || status.error) {
            clearInterval(pollInterval);
            this.isBooking = false;
            this.bookingError.emit(status.error || 'Booking failed');
            this.bookingStatus = '';
          }
        },
        error: (error) => {
          console.error('Error checking booking status:', error);
          clearInterval(pollInterval);
          this.isBooking = false;
          this.bookingError.emit('Failed to check booking status');
          this.bookingStatus = '';
        }
      });
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (this.isBooking) {
        this.isBooking = false;
        this.bookingError.emit('Booking timeout');
        this.bookingStatus = '';
      }
    }, 300000);
  }
}
