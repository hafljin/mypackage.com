
export interface DiagnosticResult {
  category: string;
  automationPotential: number;
  suggestion: string;
}

export interface InquirySample {
  text: string;
  channel: 'LINE' | 'Form' | 'Mail';
}

// 提携パターンの型定義
export interface PartnershipPattern {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceRange?: string;
  suitability: number; // 0-100の適合度
}

export interface DiagnosticResult {
  category: string;
  automationPotential: number;
  suggestion: string;
}

export interface InquirySample {
  text: string;
  channel: 'LINE' | 'Form' | 'Mail';
}

// 提携パターンの型定義
export interface PartnershipPattern {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceRange?: string;
  suitability: number; // 0-100の適合度
}

export interface AIDiagnosticResponse {
  aiMessage: string; // AI風の応答メッセージ
  patterns: PartnershipPattern[]; // 提案される提携パターン
  analysis: string; // 分析結果の詳細
}

// バリデーション結果
export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
