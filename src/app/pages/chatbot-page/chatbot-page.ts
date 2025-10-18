import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-page.html',
  styleUrl: './chatbot-page.scss'
})
export class ChatbotPage {
  // Static data for design demonstration
  messages = [
    {
      role: 'assistant',
      content: "Hello there! 🌟\nI'm your travel and future planning assistant, ready to help you design your next adventure or brainstorm exciting plans. Whether you're looking for vacation ideas, future goals, or just some fun suggestions, I'm here for it all!\nWhat's your next big idea? Let's get started!",
      timestamp: new Date()
    },
    {
      role: 'user',
      content: "I'm planning a trip to Japan next spring!",
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: "That sounds amazing! Japan in spring is absolutely beautiful with the cherry blossoms in full bloom. 🌸\n\nHere are some fantastic places to consider:\n\n• Tokyo - Modern city life and amazing food\n• Kyoto - Traditional temples and gardens\n• Osaka - Great street food and nightlife\n• Nara - Friendly deer and ancient temples\n\nWhat type of experiences are you most interested in?",
      timestamp: new Date()
    }
  ];

  currentMessage: string = '';
  isLoading: boolean = false;
  userGoatImageUrl: string = 'https://api.builder.io/api/v1/image/assets/TEMP/profile1.jpg';
  showSaveDialog: boolean = false;
  showChatHistory: boolean = false;
  chatTitle: string = '';

  // Mock saved chats for design
  savedChats = [
    {
      id: '1',
      title: 'Japan Travel Planning',
      created_at: '2024-01-15T10:30:00Z',
      message_count: 12
    },
    {
      id: '2', 
      title: 'Career Goals Discussion',
      created_at: '2024-01-14T15:45:00Z',
      message_count: 8
    }
  ];

  // Placeholder methods for design demonstration
  sendMessage() {
    console.log('Send message clicked');
  }

  onKeyPress(event: KeyboardEvent) {
    console.log('Key pressed');
  }

  clearChat() {
    console.log('Clear chat clicked');
  }

  saveChat() {
    console.log('Save chat clicked');
  }

  confirmSaveChat() {
    console.log('Confirm save chat clicked');
  }

  cancelSaveChat() {
    console.log('Cancel save chat clicked');
  }

  loadChat(chatId: string) {
    console.log('Load chat clicked:', chatId);
  }

  deleteChat(chatId: string, event: Event) {
    event.stopPropagation();
    console.log('Delete chat clicked:', chatId);
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
