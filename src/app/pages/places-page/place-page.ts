import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Event {
  id: number;
  title: string;
  location: string;
  date: { day: string; month: string };
  image: string;
}

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
  templateUrl: './place-page.component.html',
  styleUrl: './place-page.component.css'
})
export class PlacePageComponent {
  place = {
    name: 'Muzeul Cărții și Exilului Românesc',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/7c4a4693085ea05fe2f0c81de0b2b4f284588fea?width=762',
    description: 'Located in the historic Dianu House, this unique museum honors the cultural legacy of Romanian intellectuals who lived and created in exile. With rare manuscripts, personal archives, and over 40 curated collections the museum bridges Romania\'s postwar diaspora with its national heritage.',
    schedule: {
      weekdays: 'M-F: .......',
      saturday: 'S: ...........',
      sunday: 'S: ...........'
    },
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

  events: Event[] = [
    {
      id: 1,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292'
    },
    {
      id: 2,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292'
    },
    {
      id: 3,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/06b9ead9c2006c4a9eb50f9c4852d0b23743afee?width=292'
    },
    {
      id: 4,
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' },
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=292'
    }
  ];

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
  }

  onGetTickets() {
    if (this.place.contact.website.url) {
      window.open(this.place.contact.website.url, '_blank');
    }
  }

  onWebsiteClick() {
    window.open(this.place.contact.website.url, '_blank');
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
