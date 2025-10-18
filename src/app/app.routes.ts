import { Routes } from '@angular/router';
import { LoadingComponent } from './pages/loading/loading.component';
import { ChatbotPage } from './pages/chatbot-page/chatbot-page';
import { HomeComponent } from './pages/home/home';
import { EventComponent } from './pages/events/event';
import { PlacesListComponent } from './pages/places-list/places-list';
import { PlacePageComponent } from './pages/places-page/place-page';

export const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotPage },
  { path: 'home', component: HomeComponent },
  { path: 'event/:placeId/:eventId', component: EventComponent },
  { path: 'places-list/:category', component: PlacesListComponent },
  { path: 'places-page/:id', component: PlacePageComponent },
];
