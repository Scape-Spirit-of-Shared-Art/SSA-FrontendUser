import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class EventComponent {
  event = {
    title: 'CONCERT MARIA TANASE',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f5bbcd2f649e44129dac264705bdc23f1c4503db?width=768',
    description: 'Concertul dedicat Mariei Tănase este un omagiu vibrant adus celei mai emblematice voci a muzicii românești. Evenimentul reinterpretează cu rafinament cântece celebre precum „Cine iubește și lasă" sau „Mi-am pus busuioc în păr".',
    contact: {
      website: {
        label: 'website',
        url: 'https://craiovalive.ro/serie/festivalul-maria-tanase/'
      },
      email: 'muzeulolteniei@yahoo.com',
      phone: '0251419435',
      address: {
        street: 'Str. Matei Basarab, nr. 16,',
        city: 'Craiova, Dolj România'
      }
    }
  };

  onGetTickets() {
    if (this.event.contact.website.url) {
      window.open(this.event.contact.website.url, '_blank');
    }
  }

  onWebsiteClick() {
    window.open(this.event.contact.website.url, '_blank');
  }
}
