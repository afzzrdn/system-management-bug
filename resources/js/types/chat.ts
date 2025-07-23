export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  type?: 'text' | 'image' | 'ticket-summary';
}
