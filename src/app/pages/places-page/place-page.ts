import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { ApiService, Place, Event } from '../../services/api.service';
import { FavoriteService, FavoriteEvent, FavoritePlace } from '../../services/favorite.service';

interface Room {
  id: number;
  name: string;
  capacity: string;
  type: string;
  hasVideo: boolean;
  label?: number | string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface Floor {
  name: string;
  rooms: (number | string)[];
  roomData?: any[];
}

@Component({
  selector: 'app-place-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './place-page.html',
  styleUrl: './place-page.css'
})
export class PlacePageComponent implements OnInit, OnDestroy {
  place: Place | null = null;
  events: Event[] = [];
  loading = true;
  error: string | null = null;
  isPlaceFavorite = false;
  
  floors: Floor[] = [];
  rooms: Room[] = [];
  selectedFloorIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const placeId = +params['id'];
      this.loadPlaceData(placeId);
    });
  }

  loadPlaceData(placeId: number) {
    this.loading = true;
    this.error = null;

    this.apiService.getPlaceById(placeId).subscribe({
      next: (response) => {
        this.place = response.place;
        this.events = response.place.events || [];
        this.isPlaceFavorite = this.favoriteService.isPlaceFavorite(placeId);
        this.processFloorPlanData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading place:', error);
        this.error = 'Failed to load place data';
        this.loading = false;
      }
    });
  }

  processFloorPlanData(): void {
    if (!this.place) return;

    // Handle different floor plan data formats
    let floormapsData;
    if (typeof this.place.floormaps === 'string') {
      try {
        floormapsData = JSON.parse(this.place.floormaps);
      } catch {
        console.error('Error parsing floormaps:', this.place.floormaps);
        floormapsData = null;
      }
    } else {
      floormapsData = this.place.floormaps;
    }

    // Process floor plan data
    if (floormapsData) {
      // Check if it's multi-floor format
      if (floormapsData.floors && Array.isArray(floormapsData.floors)) {
        // Multi-floor format - store floors with their room data
        this.floors = floormapsData.floors.map((floor: any) => ({
          name: floor.name || 'FLOOR',
          rooms: floor.rooms ? floor.rooms.map((room: any) => room.label || room.id) : [],
          roomData: floor.rooms || []
        }));
        
        // Initialize rooms array - will be populated per floor
        this.rooms = [];
      }
      // Check if it's legacy single-floor format
      else if (floormapsData.rooms && Array.isArray(floormapsData.rooms)) {
        // Legacy single-floor format
        this.floors = [{ 
          name: 'GROUND FLOOR', 
          rooms: floormapsData.rooms.map((room: any) => room.label || room.id),
          roomData: floormapsData.rooms
        }];
        
        this.rooms = floormapsData.rooms.map((room: any) => ({
          id: room.id || room.label,
          name: room.name || `Room ${room.label || room.id}`,
          capacity: this.getRoomCapacity(room),
          type: this.getRoomType(room),
          hasVideo: this.hasVideoCapability(room),
          label: room.label,
          x: room.x,
          y: room.y,
          w: room.w,
          h: room.h
        }));
      } else {
        // No valid floor plan data
        this.floors = [];
        this.rooms = [];
      }
    } else {
      // No floor plan data
      this.floors = [];
      this.rooms = [];
    }
  }

  getRoomCapacity(room: any): string {
    const capacity = room.capacity || 0;
    if (capacity === null || capacity === undefined || isNaN(capacity)) {
      return '0/0';
    }
    const currentOccupancy = Math.floor(capacity * 0.7); // Mock 70% occupancy
    return `${currentOccupancy}/${capacity}`;
  }

  getRoomType(room: any): string {
    const capacity = room.capacity || 0;
    if (capacity === null || capacity === undefined || isNaN(capacity)) {
      return 'new';
    }
    if (capacity > 40) return 'main';
    if (capacity > 20) return 'art';
    return 'new';
  }

  hasVideoCapability(room: any): boolean {
    return Math.random() > 0.5; // 50% chance of having video
  }

  getRoomsForFloor(floor: Floor): Room[] {
    if (floor.roomData && Array.isArray(floor.roomData)) {
      return floor.roomData.map((room: any) => ({
        id: room.id || room.label,
        name: room.name || `Room ${room.label || room.id}`,
        capacity: this.getRoomCapacity(room),
        type: this.getRoomType(room),
        hasVideo: this.hasVideoCapability(room),
        label: room.label,
        x: room.x,
        y: room.y,
        w: room.w,
        h: room.h
      }));
    }
    return this.rooms;
  }

  getRoomPosition(room: any): { x: number, y: number, w: number, h: number } {
    let position: { x: number, y: number, w: number, h: number };
    
    if (room.x !== undefined && room.y !== undefined && room.w !== undefined && room.h !== undefined) {
      // Scale existing positions to fit in our container
      const scale = 0.8; // Scale down to fit better
      position = { 
        x: room.x * scale, 
        y: room.y * scale, 
        w: Math.max(room.w * scale, 30), 
        h: Math.max(room.h * scale, 25) 
      };
    } else {
      // Default positioning for rooms without position data - designed to fit in 1000x300 container
      const roomId = room.label || room.id;
      const defaultPositions: { [key: string]: { x: number, y: number, w: number, h: number } } = {
        1: { x: 400, y: 50, w: 120, h: 150 },   // Center room
        2: { x: 50, y: 200, w: 150, h: 60 },    // Bottom left
        3: { x: 750, y: 100, w: 120, h: 100 },  // Right side
        4: { x: 600, y: 50, w: 100, h: 80 },    // Top right
        5: { x: 600, y: 150, w: 100, h: 80 },   // Bottom right
        6: { x: 50, y: 120, w: 150, h: 60 },    // Left side
        7: { x: 250, y: 50, w: 80, h: 80 },     // Top center
        8: { x: 250, y: 150, w: 80, h: 80 },    // Bottom center
        9: { x: 20, y: 50, w: 120, h: 100 }     // Far left
      };
      position = defaultPositions[roomId] || { x: 50, y: 50, w: 80, h: 60 };
    }
    
    // Scale positions for mobile devices
    const isMobile = window.innerWidth <= 420;
    if (isMobile) {
      const scale = window.innerWidth <= 340 ? 0.3 : window.innerWidth <= 380 ? 0.35 : 0.4;
      return {
        x: position.x * scale,
        y: position.y * scale,
        w: Math.max(position.w * scale, 25), // Minimum width
        h: Math.max(position.h * scale, 20)  // Minimum height
      };
    }
    
    return position;
  }

  selectFloor(index: number): void {
    this.selectedFloorIndex = index;
  }

  onEventClick(event: Event) {
    console.log('Event clicked:', event);
    if (this.place && event.place_id) {
      this.router.navigate(['/event', event.place_id, event.id]);
    }
  }

  onGetTickets() {
    if (this.place && this.place.website) {
      window.open(this.place.website, '_blank');
    }
  }

  onWebsiteClick() {
    if (this.place && this.place.website) {
      window.open(this.place.website, '_blank');
    }
  }

  // Helper method to get full image URL
  getPlaceImage(): string {
    if (this.place && this.place.image_path) {
      if (this.place.image_path.startsWith('http')) {
        return this.place.image_path;
      }
      return `http://localhost:8000${this.place.image_path}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/7c4a4693085ea05fe2f0c81de0b2b4f284588fea?width=762';
  }

  // Helper method to get event image
  getEventImage(event: Event): string {
    if (event.images_paths && Array.isArray(event.images_paths) && event.images_paths.length > 0) {
      const imagePath = event.images_paths[0];
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:8000${imagePath}`;
    }
    return 'https://api.builder.io/api/v1/image/assets/TEMP/2de7dbcbd7e38716604a08533dea9b97adb8649c?width=292';
  }

  // Helper method to format date for display
  formatEventDate(dateString?: string): { day: string, month: string } {
    if (!dateString) {
      return { day: 'TBD', month: '' };
    }
    
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString();
      const month = date.toLocaleDateString('en', { month: 'short' }).toLowerCase();
      return { day, month };
    } catch {
      return { day: 'TBD', month: '' };
    }
  }

  getOccupancyLevel(room: Room): 'low' | 'medium' | 'high' {
    const capacityParts = room.capacity.split('/');
    if (capacityParts.length !== 2) return 'low';
    
    const occupied = parseInt(capacityParts[0]) || 0;
    const total = parseInt(capacityParts[1]) || 1;
    const percentage = (occupied / total) * 100;
    
    if (percentage < 33) return 'low';
    if (percentage < 66) return 'medium';
    return 'high';
  }

  getUserIcons(count: number): number[] {
    return Array(Math.min(count, 3)).fill(0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Trigger change detection to recalculate room positions
    // This will be handled automatically by Angular's change detection
  }

  ngOnDestroy(): void {
    // Clean up if needed
  }

  // Favorite methods
  togglePlaceFavorite() {
    if (this.place) {
      const favoritePlace: FavoritePlace = {
        id: this.place.id,
        name: this.place.name,
        bio: this.place.bio,
        address: this.place.address,
        image_path: this.place.image_path,
        categories: this.place.categories,
        website: this.place.website,
        email: this.place.email,
        phone_number: this.place.phone_number
      };
      
      this.isPlaceFavorite = this.favoriteService.togglePlaceFavorite(favoritePlace);
    }
  }

  isEventFavorite(event: Event): boolean {
    return this.favoriteService.isEventFavorite(event.id, event.place_id || 0);
  }

  toggleEventFavorite(event: Event) {
    const favoriteEvent: FavoriteEvent = {
      id: event.id,
      place_id: event.place_id || 0,
      name: event.name,
      bio: event.bio,
      address: event.address,
      date: event.date,
      images_paths: event.images_paths,
      website: event.website,
      email: event.email,
      phone_number: event.phone_number
    };
    
    this.favoriteService.toggleEventFavorite(favoriteEvent);
  }
}
