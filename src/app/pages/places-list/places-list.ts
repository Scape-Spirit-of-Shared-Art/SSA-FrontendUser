import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Place } from '../../services/api.service';

interface CategoryConfig {
  title: string;
  heroImage: string;
  description: string;
  backendCategory: string;
}

@Component({
  selector: 'app-places-list',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './places-list.html',
  styleUrl: './places-list.css'
})
export class PlacesListComponent implements OnInit {
  category: CategoryConfig = {
    title: 'City Treasures',
    heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/2696ad16848c112168d3f041c372d22bb1f90d80?width=748',
    description: 'Craiova blends history and charm, with elegant architecture and vibrant culture. Explore its artistic soul through iconic spots like the Craiova Art Museum and discover stories woven into every courtyard and museum. A city where Oltenia\'s legacy lives on.',
    backendCategory: 'CITY_TREASURES'
  };

  places: Place[] = [];
  loading = true;
  error: string | null = null;

  // Category configurations mapping
  private categoryConfigs: { [key: string]: CategoryConfig } = {
    'city-treasures': {
      title: 'City Treasures',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/2696ad16848c112168d3f041c372d22bb1f90d80?width=748',
      description: 'Craiova blends history and charm, with elegant architecture and vibrant culture. Explore its artistic soul through iconic spots like the Craiova Art Museum and discover stories woven into every courtyard and museum. A city where Oltenia\'s legacy lives on.',
      backendCategory: 'CITY_TREASURES'
    },
    'refined-side': {
      title: 'The Refined Side',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/ed77f7494ccff826462966e31decd5e901b98327?width=748',
      description: 'Discover Craiova\'s sophisticated side through elegant venues, cultural institutions, and refined experiences. From art galleries to upscale dining, explore the city\'s most polished offerings that showcase its cultural richness and artistic heritage.',
      backendCategory: 'REFINED_SIDE'
    },
    'fun-side': {
      title: 'The Fun Side',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/2974cfacb7173024ab189548b19d8001cf64f14d?width=748',
      description: 'Experience Craiova\'s vibrant entertainment scene! From lively bars and clubs to fun activities and social venues, discover where the city comes alive with energy, music, and unforgettable moments of joy and excitement.',
      backendCategory: 'FUN_SIDE'
    },
    'sport-sphere': {
      title: 'SportSphere',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/8971eb81adb72a4c7a75dc57ed94f911265771bf?width=748',
      description: 'Get active in Craiova\'s sports and fitness scene! From modern gyms and sports facilities to outdoor activities and recreational centers, find your perfect way to stay fit and energized in the city.',
      backendCategory: 'SPORT_SPHERE'
    },
    'city-stays': {
      title: 'City Stays',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/b79347eeb3ec9c730bc7811b4e800a7bd80c2e62?width=748',
      description: 'Find your perfect accommodation in Craiova! From cozy boutique hotels to modern stays, discover comfortable and welcoming places to rest and recharge while exploring all that the city has to offer.',
      backendCategory: 'CITY_STAYS'
    },
    'taste-district': {
      title: 'Taste District',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/6860545cc94bfe1e0939088a41ad7b9c3bf99711?width=748',
      description: 'Savor the flavors of Craiova! From traditional Romanian cuisine to international delights, explore the city\'s diverse culinary scene. Discover restaurants, cafes, and local specialties that will delight your taste buds.',
      backendCategory: 'TASTE_DISTRICT'
    },
    'health-beauty': {
      title: 'Health & Beauty',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/5ab49cf1ccfe030515228cc8bde2e20c4af45baa?width=748',
      description: 'Pamper yourself in Craiova\'s wellness and beauty scene! From relaxing spas and wellness centers to modern beauty salons, discover places dedicated to your health, relaxation, and personal care.',
      backendCategory: 'HEALTH_AND_BEAUTY'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const categoryParam = params['category'];
      this.loadCategoryData(categoryParam);
    });
  }

  private loadCategoryData(categoryParam: string) {
    // Get category configuration
    const categoryConfig = this.categoryConfigs[categoryParam];
    if (!categoryConfig) {
      this.error = 'Category not found';
      this.loading = false;
      return;
    }

    this.category = categoryConfig;
    this.loadPlaces();
  }

  loadPlaces() {
    this.loading = true;
    this.error = null;

    this.apiService.getAllPlaces().subscribe({
      next: (response) => {
        // Filter places by category
        this.places = response.places.filter(place => 
          place.categories.includes(this.category.backendCategory)
        );
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading places:', error);
        this.error = 'Failed to load places';
        this.loading = false;
      }
    });
  }

  onPlaceClick(place: Place) {
    console.log('Place clicked:', place);
    // Navigate to the place detail page
    this.router.navigate(['/places-page', place.id]);
  }

  getBusyIcons(level: number): number[] {
    return Array(level).fill(0);
  }

  // Helper method to get busy level based on events or other criteria
  getBusyLevel(place: Place): number {
    // Simple logic: more events = busier
    if (place.events && place.events.length > 0) {
      return Math.min(place.events.length, 3);
    }
    return 1; // Default to quiet
  }

  getBusyText(level: number): string {
    switch (level) {
      case 1: return 'quiet';
      case 2: return 'moderate';
      case 3: return 'busy';
      default: return 'quiet';
    }
  }

  // Helper method to get full image URL
  getPlaceImage(place: Place): string {
    if (place.image_path) {
      // If the image path already includes the full URL, return as is
      if (place.image_path.startsWith('http')) {
        return place.image_path;
      }
      // Otherwise, construct the full URL with the backend base URL
      return `http://localhost:8000${place.image_path}`;
    }
    // Fallback to default image
    return 'https://api.builder.io/api/v1/image/assets/TEMP/510fd54b2f316f335b4be7647c6fd757c6149416?width=238';
  }
}
