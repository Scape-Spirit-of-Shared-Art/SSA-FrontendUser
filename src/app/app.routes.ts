import { Routes } from '@angular/router';
import { LoadingComponent } from './pages/loading/loading.component';
import { ChatbotPage } from './pages/chatbot-page/chatbot-page';
import { HomeComponent } from './pages/home/home';
import { EventComponent } from './pages/events/event';

export const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotPage },
  { path: 'home', component: HomeComponent },
  { path: 'event/:placeId/:eventId', component: EventComponent },
];
