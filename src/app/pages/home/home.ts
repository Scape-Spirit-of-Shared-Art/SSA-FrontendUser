import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  events = [
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' }
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292',
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' }
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/569dbac6e9593bc7b669160f4237d2fa8cc487b4?width=292',
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' }
    },
    {
      image: 'https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=292',
      title: 'nume eveniment',
      location: 'locatie',
      date: { day: '18', month: 'oct' }
    }
  ];

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

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    console.log('Search:', input.value);
  }

  onEventClick(event: any) {
    console.log('Event clicked:', event);
  }

  onCategoryClick(category: any) {
    console.log('Category clicked:', category);
  }
}
