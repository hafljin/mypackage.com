
export interface DiagnosticResult {
  category: string;
  automationPotential: number;
  suggestion: string;
}

export interface InquirySample {
  text: string;
  channel: 'LINE' | 'Form' | 'Mail';
}
