import { Routes } from '@angular/router';
import { LoadingComponent } from './pages/loading/loading.component';
import { ChatbotPage } from './pages/chatbot-page/chatbot-page';

export const routes: Routes = [
  { path: 'loading', component: LoadingComponent },
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'chatbot', component: ChatbotPage },
];
