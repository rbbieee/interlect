export class ChatHistory {
  chatId: number;
  message: string;
  timestamp: Date;

  constructor(chatId: number, message: string, timestamp: Date) {
    this.chatId = chatId;
    this.message = message;
    this.timestamp = timestamp;
  }

  saveMessage(message: string): void {}

  getConversation(): ChatHistory[] {
    return [];
  }

  clearHistory(): void {}
}
