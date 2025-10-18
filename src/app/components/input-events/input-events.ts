import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-events',
  standalone: true,
  imports: [FormsModule],
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

      <p class="tickets-remaining">!{{ ticketsLeft }} tickets left!</p>
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
      margin: 0 0 39px 0;
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
  ticketNumber: string = '';
  ticketsLeft: number = 30;

  onInputChange() {
    console.log('Ticket number:', this.ticketNumber);
  }
}
