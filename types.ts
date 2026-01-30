// LINEボットのメッセージ型定義
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// LINEボットの応答型定義
export interface BotResponse {
  message: string;
  timestamp: Date;
}

// 営業時間情報
export interface BusinessHours {
  dayOfWeek: string;
  open: string;
  close: string;
  isHoliday: boolean;
}
