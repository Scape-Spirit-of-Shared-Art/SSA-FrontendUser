import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Place } from '../../services/api.service';
import { FavoriteService, FavoritePlace } from '../../services/favorite.service';

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
      description: 'Art, Culture, and Elegance: Craiova invites you to explore its unique blend of refinement and culture. From the grand performances at the Philharmonic to the charming art galleries, the city combines tradition with sophistication. Immerse yourself in artistic performances and moments of inspiration in a city that breathes culture.',
      backendCategory: 'REFINED_SIDE'
    },
    'fun-side': {
      title: 'The Fun Side',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/2974cfacb7173024ab189548b19d8001cf64f14d?width=748',
      description: 'Water Parks, Amusement Parks, and More: Craiova offers an exciting escape into fun and adventure. With thrilling water parks and vibrant amusement centers, it\'s a place where families and adrenaline seekers can enjoy unforgettable moments. Dive into the playful atmosphere and make the most of your leisure time in the heart of the city.',
      backendCategory: 'FUN_SIDE'
    },
    'sport-sphere': {
      title: 'SportSphere',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/8971eb81adb72a4c7a75dc57ed94f911265771bf?width=748',
      description: 'Stadiums, Sports Events, and Energetic Activities:Craiova is the perfect destination for sports enthusiasts, featuring modern arenas and top-tier sports facilities. Whether you\'re passionate about football, basketball, or athletics, the city offers an unforgettable atmosphere filled with emotion and adrenaline. Experience the excitement of live competitions and support your favorite teams in a city dedicated to sports.',
      backendCategory: 'SPORT_SPHERE'
    },
    'city-stays': {
      title: 'City Stays',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/b79347eeb3ec9c730bc7811b4e800a7bd80c2e62?width=748',
      description: 'Accommodation, Hotels, and Relaxation:Craiova offers a wide range of accommodation options, from elegant hotels to co mfortable guesthouses. Whether you\'re here for business or leisure, the city provides ideal places to relax after a day of exploring. Enjoy a pleasant stay in the heart of a vibrant and welcoming city.',
      backendCategory: 'CITY_STAYS'
    },
    'taste-district': {
      title: 'Taste District',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/6860545cc94bfe1e0939088a41ad7b9c3bf99711?width=748',
      description: ' Restaurants, Cafes, and Culinary Delights: Craiova is a place where gastronomy becomes a true experience. From elegant restaurants to cozy cafes, the city offers a wide variety of dishes, blending traditional Romanian cuisine with international flavors. Discover authentic tastes and innovative dishes that reflect the region\'s rich cultural heritage.',
      backendCategory: 'TASTE_DISTRICT'
    },
    'health-beauty': {
      title: 'Health & Beauty',
      heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/5ab49cf1ccfe030515228cc8bde2e20c4af45baa?width=748',
      description: 'Healthcare, Beauty Salons, and Wellness Centers: Craiova places great importance on health and personal care, with modern hospitals, top-notch beauty salons, and wellness centers. Whether you need medical assistance or want to unwind in a beauty spa, the city provides everything you need to feel good and rejuvenated.',
      backendCategory: 'HEALTH_AND_BEAUTY'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private favoriteService: FavoriteService
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

  // Favorite methods
  isPlaceFavorite(place: Place): boolean {
    return this.favoriteService.isPlaceFavorite(place.id);
  }

  togglePlaceFavorite(place: Place) {
    const favoritePlace: FavoritePlace = {
      id: place.id,
      name: place.name,
      bio: place.bio,
      address: place.address,
      image_path: place.image_path,
      categories: place.categories,
      website: place.website,
      email: place.email,
      phone_number: place.phone_number
    };
    
    this.favoriteService.togglePlaceFavorite(favoritePlace);
  }
}
