import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, StartReservationRequest, ReservationSession, AllSessionsResponse } from '../../services/api.service';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-chatbot-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-page.html',
  styleUrl: './chatbot-page.scss'
})
export class ChatbotPage implements OnInit, OnDestroy {
  // Chat messages with API integration
  messages = [
    {
      role: 'assistant',
      content: "Hello there! 🌟\nI'm your reservation assistant, ready to help you book tickets and make reservations. I can help you find events, select tickets, and complete your bookings.\nWhat would you like to reserve today?",
      timestamp: new Date()
    }
  ];

  currentMessage: string = '';
  isLoading: boolean = false;
  showSaveDialog: boolean = false;
  showChatHistory: boolean = false;
  chatTitle: string = '';
  
  // API integration properties
  currentSessionId: string | null = null;
  statusPollingSubscription: Subscription | null = null;
  errorMessage: string = '';

  // Saved chats from API
  savedChats: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadSavedChats();
  }

  ngOnDestroy() {
    if (this.statusPollingSubscription) {
      this.statusPollingSubscription.unsubscribe();
    }
  }

  // API integration methods
  sendMessage() {
    if (!this.currentMessage.trim() || this.isLoading) {
      return;
    }

    // Add user message to chat
    this.messages.push({
      role: 'user',
      content: this.currentMessage,
      timestamp: new Date()
    });

    const userMessage = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;
    this.errorMessage = '';

    // Start reservation process
    const request: StartReservationRequest = {
      user_prompt: userMessage
    };

    this.apiService.startReservation(request).subscribe({
      next: (response) => {
        this.currentSessionId = response.session_id;
        this.startStatusPolling();
      },
      error: (error) => {
        console.error('Error starting reservation:', error);
        
        let errorMsg = 'Failed to start reservation. Please try again.';
        if (error.status === 500) {
          errorMsg = 'The reservation service is currently unavailable. Please check if Chrome browser is installed and try again later.';
        } else if (error.status === 404) {
          errorMsg = 'Reservation service not found. Please contact support.';
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
        
        // Add error message to chat
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error while trying to process your reservation request. Please try again or contact support if the problem persists.',
          timestamp: new Date()
        });
      }
    });
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private startStatusPolling() {
    if (!this.currentSessionId) return;

    this.statusPollingSubscription = interval(2000).pipe(
      switchMap(() => this.apiService.getReservationStatus(this.currentSessionId!)),
      catchError(error => {
        console.error('Error polling status:', error);
        return of(null);
      })
    ).subscribe({
      next: (session: ReservationSession | null) => {
        if (session) {
          this.handleSessionUpdate(session);
        }
      }
    });
  }

  private handleSessionUpdate(session: ReservationSession) {
    // Update loading state based on status
    if (session.status === 'completed' || session.status === 'error') {
      this.isLoading = false;
      if (this.statusPollingSubscription) {
        this.statusPollingSubscription.unsubscribe();
        this.statusPollingSubscription = null;
      }
    }

    // Handle different statuses
    switch (session.status) {
      case 'working':
        // Agent is working, keep showing loading
        break;
      case 'waiting_for_input':
        this.isLoading = false;
        this.messages.push({
          role: 'assistant',
          content: 'I need more information to help you. Could you please provide more details?',
          timestamp: new Date()
        });
        break;
      case 'completed':
        this.messages.push({
          role: 'assistant',
          content: session.result ? JSON.stringify(session.result) : 'Reservation completed successfully!',
          timestamp: new Date()
        });
        break;
      case 'error':
        this.errorMessage = session.error || 'An error occurred during reservation';
        this.messages.push({
          role: 'assistant',
          content: 'I encountered an error while processing your request. Please try again.',
          timestamp: new Date()
        });
        break;
      case 'navigating':
        this.messages.push({
          role: 'assistant',
          content: 'I\'m navigating to find the best options for you...',
          timestamp: new Date()
        });
        break;
      case 'selecting':
        this.messages.push({
          role: 'assistant',
          content: 'I\'m selecting the best tickets for you...',
          timestamp: new Date()
        });
        break;
      case 'payment_reached':
        this.messages.push({
          role: 'assistant',
          content: 'I\'ve found your tickets and they\'re ready for payment!',
          timestamp: new Date()
        });
        break;
    }
  }

  clearChat() {
    // Stop any ongoing polling
    if (this.statusPollingSubscription) {
      this.statusPollingSubscription.unsubscribe();
      this.statusPollingSubscription = null;
    }

    // Clear current session
    if (this.currentSessionId) {
      this.apiService.deleteReservationSession(this.currentSessionId).subscribe({
        next: () => console.log('Session deleted'),
        error: (error) => console.error('Error deleting session:', error)
      });
      this.currentSessionId = null;
    }

    // Reset chat
    this.messages = [{
      role: 'assistant',
      content: "Hello there! 🌟\nI'm your reservation assistant, ready to help you book tickets and make reservations. I can help you find events, select tickets, and complete your bookings.\nWhat would you like to reserve today?",
      timestamp: new Date()
    }];
    this.errorMessage = '';
    this.isLoading = false;
  }

  saveChat() {
    if (!this.hasMessagesToSave()) {
      return;
    }
    this.showSaveDialog = true;
  }

  confirmSaveChat() {
    // In a real implementation, you would save to backend
    // For now, just close the dialog
    this.showSaveDialog = false;
    this.chatTitle = '';
    console.log('Chat saved with title:', this.chatTitle);
  }

  cancelSaveChat() {
    this.showSaveDialog = false;
    this.chatTitle = '';
  }

  loadChat(chatId: string) {
    // In a real implementation, you would load from backend
    console.log('Load chat clicked:', chatId);
    this.showChatHistory = false;
  }

  deleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    // In a real implementation, you would delete from backend
    console.log('Delete chat clicked:', chatId);
  }

  private loadSavedChats() {
    this.apiService.getAllReservationSessions().subscribe({
      next: (response: AllSessionsResponse) => {
        this.savedChats = Object.keys(response.sessions).map(sessionId => ({
          id: sessionId,
          title: response.sessions[sessionId].user_prompt,
          created_at: new Date(response.sessions[sessionId].created_at * 1000).toISOString(),
          message_count: 1 // Simplified for now
        }));
      },
      error: (error) => {
        console.error('Error loading saved chats:', error);
        // Keep empty array on error
        this.savedChats = [];
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  hasMessagesToSave(): boolean {
    return this.messages.length > 1;
  }

  toggleChatHistory() {
    this.showChatHistory = !this.showChatHistory;
  }
}
