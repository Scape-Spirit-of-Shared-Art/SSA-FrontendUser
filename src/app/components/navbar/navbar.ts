import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  onHomeClick() {
    console.log('Home clicked');
  }

  onNotificationsClick() {
    console.log('Notifications clicked');
  }

  onMapClick() {
    console.log('Map clicked');
  }

  onProfileClick() {
    console.log('Profile clicked');
  }
}
