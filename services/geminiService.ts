
import { AIDiagnosticResponse, PartnershipPattern, ValidationResult } from "../types";

// 定義済みの提携パターン
const PARTNERSHIP_PATTERNS: PartnershipPattern[] = [
  {
    id: "basic",
    name: "基本自動化パック",
    description: "よくある質問の自動返信を実現。シンプルで導入しやすいパターンです。",
    features: [
      "よくある質問の自動返信（最大10パターン）",
      "LINEまたはメールのいずれか1系統",
      "基本的なFAQ管理",
      "導入サポート（3日間）"
    ],
    priceRange: "〜10万円",
    suitability: 0
  },
  {
    id: "standard",
    name: "標準自動化パック",
    description: "複数チャネル対応と高度な自動化機能。多くの事業者に最適なバランス型です。",
    features: [
      "複数チャネル対応（LINE/メール/フォームから2系統）",
      "よくある質問の自動返信（最大30パターン）",
      "営業時間外の自動対応",
      "重要度判定による通知機能",
      "導入サポート（5日間）"
    ],
    priceRange: "10万円〜20万円",
    suitability: 0
  },
  {
    id: "premium",
    name: "プレミアム自動化パック",
    description: "完全自動化とカスタマイズ対応。本格的な業務効率化を実現します。",
    features: [
      "全チャネル対応（LINE/メール/フォーム）",
      "無制限の自動返信パターン",
      "AIによる文脈理解と柔軟な応答",
      "CRM連携機能",
      "カスタムワークフロー構築",
      "導入サポート（10日間）+ 運用サポート（3ヶ月）"
    ],
    priceRange: "20万円〜",
    suitability: 0
  }
];

// 無意味な入力パターン（バリデーション用）
const MEANINGLESS_PATTERNS = [
  /^[あいうえお]{1,5}$/i, // 「ああ」「あいう」など
  /^[a-z]{1,5}$/i, // 「aaa」「test」など
  /^[0-9]{1,5}$/, // 「123」など
  /^[あ-ん]{1,3}$/, // ひらがな1-3文字のみ
  /^(あ+|い+|う+|え+|お+)$/i, // 同じ文字の繰り返し
];

// 問い合わせ関連キーワード（意味のある内容かどうかの判定用）
const INQUIRY_KEYWORDS = [
  // 質問系
  '送料', '価格', '料金', 'いくら', '値段', '費用', 'お値段', '値段は',
  '営業時間', '時間', '何時', 'いつ', '開店', '閉店', '定休日',
  '場所', '住所', 'アクセス', 'どこ', '場所は', '所在地',
  'キャンセル', '返金', '返品', '交換', '変更', '修正',
  '予約', '予約は', '予約できますか', '予約したい',
  '在庫', '在庫は', '在庫ありますか', 'ありますか',
  '対応', '問い合わせ', 'お問い合わせ', '質問', '聞きたい',
  'LINE', 'メール', 'フォーム', '連絡', '連絡先',
  'サービス', '商品', '商品について', '商品は',
  '使い方', '使用方法', '使い方は', '方法',
  '期限', '期間', 'いつまで', '期限は',
  '条件', '要件', '必要', '必要です',
  // その他
  'お願い', 'お願いします', 'よろしく', 'お願いいたします',
  '教えて', '教えてください', '知りたい', '知りたいです',
];

/**
 * 入力テキストのバリデーション
 */
export const validateInquiry = (text: string): ValidationResult => {
  const trimmedText = text.trim();
  
  // 空文字チェック
  if (!trimmedText) {
    return {
      isValid: false,
      errorMessage: "問い合わせ内容を入力してください。"
    };
  }
  
  // 最低文字数チェック（20文字以上）
  if (trimmedText.length < 20) {
    return {
      isValid: false,
      errorMessage: "問い合わせ内容は20文字以上で入力してください。\n例：「送料はいくらですか？」「予約のキャンセルはできますか？」など"
    };
  }
  
  // 無意味な入力パターンチェック
  for (const pattern of MEANINGLESS_PATTERNS) {
    if (pattern.test(trimmedText)) {
      return {
        isValid: false,
        errorMessage: "問い合わせ内容を具体的に入力してください。\n例：「送料はいくらですか？」「予約のキャンセルはできますか？」など"
      };
    }
  }
  
  // 意味のある内容かどうかのチェック（キーワードが1つ以上含まれているか）
  const hasInquiryKeyword = INQUIRY_KEYWORDS.some(keyword => 
    trimmedText.includes(keyword)
  );
  
  if (!hasInquiryKeyword && trimmedText.length < 50) {
    return {
      isValid: false,
      errorMessage: "問い合わせ内容をより具体的に入力してください。\n例：「送料はいくらですか？」「予約のキャンセルはできますか？」など"
    };
  }
  
  return { isValid: true };
};

// 診断結果テンプレート（20パターン）
const DIAGNOSTIC_TEMPLATES: Array<{
  keywords: string[];
  message: string;
  analysis: string;
  patterns: string[];
}> = [
  {
    keywords: ['送料', '配送料', '送料は', '配送費'],
    message: "分析が完了しました！送料に関する問い合わせは自動返信で対応できる典型的なパターンですね。基本自動化パックで効率的に対応できます。",
    analysis: "送料に関する問い合わせは、よくある質問として自動化に最適です。事前に設定した回答を自動返信することで、対応時間を大幅に短縮できます。",
    patterns: ['basic', 'standard']
  },
  {
    keywords: ['予約', '予約は', '予約したい', '予約できますか'],
    message: "分析が完了しました！予約に関する問い合わせは、自動返信と通知機能の組み合わせで効率化できます。標準自動化パックがおすすめです。",
    analysis: "予約に関する問い合わせは、自動返信で基本情報を提供しつつ、実際の予約処理が必要な場合は担当者に通知する仕組みが効果的です。",
    patterns: ['standard', 'basic']
  },
  {
    keywords: ['キャンセル', '返金', '返品', '交換'],
    message: "分析が完了しました！キャンセル・返金に関する問い合わせは、自動返信でポリシーを伝え、重要度に応じて担当者に通知する仕組みが最適です。",
    analysis: "キャンセルや返金に関する問い合わせは、まず自動返信で対応ポリシーを伝え、複雑なケースは担当者に通知する二段階の対応が効果的です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['営業時間', '時間', '何時', '開店', '閉店'],
    message: "分析が完了しました！営業時間に関する問い合わせは、最も自動化しやすいパターンです。基本自動化パックで十分に対応できます。",
    analysis: "営業時間に関する問い合わせは、固定情報のため自動返信に最適です。24時間いつでも正確な情報を提供できるため、顧客満足度も向上します。",
    patterns: ['basic', 'standard']
  },
  {
    keywords: ['在庫', '在庫は', '在庫ありますか', 'ありますか'],
    message: "分析が完了しました！在庫確認の問い合わせは、自動返信で基本情報を提供し、リアルタイム確認が必要な場合は担当者に通知する仕組みが効果的です。",
    analysis: "在庫に関する問い合わせは、自動返信で在庫確認方法を案内し、リアルタイム確認が必要な場合は担当者に通知する二段階の対応が最適です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['LINE', 'ライン', 'line@'],
    message: "分析が完了しました！LINEからの問い合わせが多い場合、LINE専用の自動返信機能が効果的です。標準自動化パックでLINE対応を自動化できます。",
    analysis: "LINEからの問い合わせは、チャット形式で迅速な対応が求められます。自動返信機能により、営業時間外でも即座に回答でき、顧客満足度が向上します。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['メール', 'email', 'e-mail'],
    message: "分析が完了しました！メールでの問い合わせが多い場合、自動返信と重要度判定機能の組み合わせで効率化できます。標準自動化パックがおすすめです。",
    analysis: "メールでの問い合わせは、自動返信で基本情報を提供し、重要度の高いメールのみ担当者に通知する仕組みにより、対応漏れを防ぎつつ効率化できます。",
    patterns: ['standard', 'basic']
  },
  {
    keywords: ['フォーム', 'お問い合わせフォーム', '問い合わせフォーム'],
    message: "分析が完了しました！フォームからの問い合わせは、自動返信と分類機能の組み合わせで効率化できます。標準自動化パックで対応可能です。",
    analysis: "フォームからの問い合わせは、自動返信で受付完了を通知し、内容に応じて分類して担当者に通知する仕組みが効果的です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['複数', '複数の', 'いろいろ', '様々', '色々'],
    message: "分析が完了しました！複数のチャネルや多様な問い合わせがある場合、全チャネル対応と高度な自動化機能が必要です。プレミアム自動化パックが最適です。",
    analysis: "複数のチャネルや多様な問い合わせがある場合、統一的な自動化システムにより、対応品質を一定に保ちながら効率化できます。",
    patterns: ['premium', 'standard']
  },
  {
    keywords: ['カスタマイズ', '連携', 'api', 'システム', '統合'],
    message: "分析が完了しました！既存システムとの連携やカスタマイズが必要な場合、プレミアム自動化パックで完全対応できます。",
    analysis: "既存システムとの連携やカスタマイズが必要な場合、柔軟な設定とAPI連携機能により、既存の業務フローに最適化した自動化が可能です。",
    patterns: ['premium', 'standard']
  },
  {
    keywords: ['使い方', '使用方法', '使い方は', '方法', 'どうやって'],
    message: "分析が完了しました！使い方に関する問い合わせは、自動返信でFAQを提供することで効率化できます。基本自動化パックで対応可能です。",
    analysis: "使い方に関する問い合わせは、よくある質問として自動返信でFAQを提供することで、対応時間を短縮しつつ顧客サポートを向上できます。",
    patterns: ['basic', 'standard']
  },
  {
    keywords: ['商品', '商品について', '商品は', '製品'],
    message: "分析が完了しました！商品に関する問い合わせは、自動返信で基本情報を提供し、詳細な質問は担当者に通知する仕組みが効果的です。",
    analysis: "商品に関する問い合わせは、自動返信で基本情報を提供し、複雑な質問やカスタマイズの相談は担当者に通知する二段階の対応が最適です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['期限', '期間', 'いつまで', '期限は', '有効期限'],
    message: "分析が完了しました！期限に関する問い合わせは、自動返信で正確な情報を提供できます。基本自動化パックで十分に対応できます。",
    analysis: "期限に関する問い合わせは、固定情報のため自動返信に最適です。24時間いつでも正確な情報を提供できるため、顧客の不安を解消できます。",
    patterns: ['basic', 'standard']
  },
  {
    keywords: ['対応', '対応は', '対応できますか', '対応して'],
    message: "分析が完了しました！対応に関する問い合わせは、自動返信で対応可能な内容を案内し、必要に応じて担当者に通知する仕組みが効果的です。",
    analysis: "対応に関する問い合わせは、自動返信で対応可能な内容を案内し、複雑なケースは担当者に通知する仕組みにより、効率的に対応できます。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['忙しい', '時間がない', '人手不足', '対応できない'],
    message: "分析が完了しました！対応に追われている状況こそ、自動化の効果が最も発揮されます。標準自動化パックで業務負荷を大幅に軽減できます。",
    analysis: "対応に追われている状況では、自動返信により基本的な問い合わせを自動化し、重要な問い合わせのみに集中できるようになります。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['24時間', '営業時間外', '夜間', '休日'],
    message: "分析が完了しました！営業時間外の問い合わせ対応は、自動返信機能により24時間対応が可能になります。標準自動化パックがおすすめです。",
    analysis: "営業時間外の問い合わせは、自動返信により即座に回答でき、顧客満足度が向上します。翌営業日に担当者がフォローアップする仕組みが効果的です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['同じ', '繰り返し', '何度も', '毎回'],
    message: "分析が完了しました！同じ質問が繰り返される場合、自動返信で対応することで大幅な時間短縮が可能です。基本自動化パックから始めるのがおすすめです。",
    analysis: "同じ質問が繰り返される場合、自動返信により対応時間を大幅に短縮できます。よくある質問を自動化することで、本業に集中できるようになります。",
    patterns: ['basic', 'standard']
  },
  {
    keywords: ['対応漏れ', '返信遅れ', '忘れる', '見落とし'],
    message: "分析が完了しました！対応漏れや返信遅れを防ぐため、自動返信と通知機能の組み合わせが効果的です。標準自動化パックで対応漏れを防止できます。",
    analysis: "対応漏れや返信遅れを防ぐため、自動返信で基本対応を確実に行い、重要な問い合わせは通知機能で担当者に確実に伝える仕組みが効果的です。",
    patterns: ['standard', 'premium']
  },
  {
    keywords: ['効率化', '自動化', '楽に', '簡単に'],
    message: "分析が完了しました！効率化を目指す場合、段階的な自動化が効果的です。まずは基本自動化パックから始めて、必要に応じて拡張することをおすすめします。",
    analysis: "効率化を目指す場合、まずはよくある質問を自動化し、徐々に範囲を広げていく段階的なアプローチが効果的です。",
    patterns: ['basic', 'standard', 'premium']
  },
  {
    keywords: ['小規模', '個人', '少人数', '一人'],
    message: "分析が完了しました！小規模事業者向けに、無理のない範囲で自動化を進めることが重要です。基本自動化パックから始めるのがおすすめです。",
    analysis: "小規模事業者では、まずは基本的な自動返信から始め、徐々に機能を拡張していく段階的なアプローチが効果的です。",
    patterns: ['basic', 'standard']
  }
];

// キーワードベースの分析ロジック
const analyzeInquiryContent = (text: string): {
  complexity: 'simple' | 'medium' | 'complex';
  channelCount: number;
  keywords: string[];
  matchedTemplate?: typeof DIAGNOSTIC_TEMPLATES[0];
} => {
  const lowerText = text.toLowerCase();
  
  // チャネル関連のキーワード
  const channelKeywords = {
    line: ['line', 'ライン', 'line@'],
    mail: ['mail', 'メール', 'email', 'e-mail'],
    form: ['form', 'フォーム', 'お問い合わせフォーム', '問い合わせフォーム']
  };
  
  const channelCount = [
    channelKeywords.line.some(kw => lowerText.includes(kw)),
    channelKeywords.mail.some(kw => lowerText.includes(kw)),
    channelKeywords.form.some(kw => lowerText.includes(kw))
  ].filter(Boolean).length;
  
  // テンプレートマッチング（最も多くキーワードが一致するテンプレートを選択）
  let bestMatch: typeof DIAGNOSTIC_TEMPLATES[0] | undefined;
  let maxMatches = 0;
  
  for (const template of DIAGNOSTIC_TEMPLATES) {
    const matches = template.keywords.filter(kw => 
      lowerText.includes(kw.toLowerCase())
    ).length;
    
    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = template;
    }
  }
  
  // 複雑さを判定するキーワード
  const simpleKeywords = ['送料', '価格', '料金', 'いくら', '値段', '営業時間', '時間', '場所', '住所', 'アクセス', 'キャンセル', '返金', '返品', '交換'];
  const complexKeywords = ['カスタマイズ', '連携', 'api', 'システム', '統合', 'ワークフロー', 'crm', '複雑', '特殊', '独自'];
  
  const simpleCount = simpleKeywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
  const complexCount = complexKeywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
  
  let complexity: 'simple' | 'medium' | 'complex' = 'medium';
  if (complexCount > 0 || text.length > 500) {
    complexity = 'complex';
  } else if (simpleCount >= 2) {
    complexity = 'simple';
  }
  
  return {
    complexity,
    channelCount: channelCount || 1, // デフォルトは1
    keywords: [],
    matchedTemplate: bestMatch
  };
};

// パターン推奨ロジック
const recommendPatterns = (analysis: ReturnType<typeof analyzeInquiryContent>): string[] => {
  // テンプレートにマッチした場合は、テンプレートの推奨パターンを使用
  if (analysis.matchedTemplate) {
    return analysis.matchedTemplate.patterns;
  }
  
  // テンプレートにマッチしない場合は、従来のロジックを使用
  const { complexity, channelCount } = analysis;
  
  if (complexity === 'simple' && channelCount === 1) {
    return ['basic', 'standard'];
  } else if (complexity === 'complex' || channelCount >= 3) {
    return ['premium', 'standard', 'basic'];
  } else {
    return ['standard', 'basic', 'premium'];
  }
};

// メッセージ生成
const generateMessage = (analysis: ReturnType<typeof analyzeInquiryContent>, patterns: string[]): string => {
  // テンプレートにマッチした場合は、テンプレートのメッセージを使用
  if (analysis.matchedTemplate) {
    return analysis.matchedTemplate.message;
  }
  
  // テンプレートにマッチしない場合は、従来のロジックを使用
  const mainPattern = patterns[0];
  
  if (mainPattern === 'basic') {
    return "分析が完了しました！シンプルな自動返信で対応できる内容が多いですね。基本自動化パックが最適です。";
  } else if (mainPattern === 'premium') {
    return "分析が完了しました！複数のチャネルや高度な機能が必要な内容ですね。プレミアム自動化パックで完全対応できます。";
  } else {
    return "分析が完了しました！バランスの取れた自動化で効率化できそうです。標準自動化パックがおすすめです。";
  }
};

// 分析結果の詳細生成
const generateAnalysis = (analysis: ReturnType<typeof analyzeInquiryContent>): string => {
  // テンプレートにマッチした場合は、テンプレートの分析を使用
  if (analysis.matchedTemplate) {
    return analysis.matchedTemplate.analysis;
  }
  
  // テンプレートにマッチしない場合は、従来のロジックを使用
  const { complexity, channelCount } = analysis;
  
  let analysisText = "問い合わせ内容を分析した結果、";
  
  if (channelCount >= 2) {
    analysisText += "複数のチャネル（LINE/メール/フォーム）からの問い合わせがあることが分かりました。";
  } else {
    analysisText += "主に1つのチャネルからの問い合わせが多いことが分かりました。";
  }
  
  if (complexity === 'simple') {
    analysisText += "よくある質問が多く、シンプルな自動返信で対応できる内容です。";
  } else if (complexity === 'complex') {
    analysisText += "複雑な要件やカスタマイズが必要な内容が含まれています。";
  } else {
    analysisText += "標準的な自動化機能で対応できる内容です。";
  }
  
  analysisText += "自動化により、対応時間の短縮と品質の向上が期待できます。";
  
  return analysisText;
};

/**
 * Analyzes the inquiry text using rule-based logic and provides response with partnership patterns.
 * AI APIは使用せず、キーワードベースの分析を行います。
 */
export const analyzeInquiry = async (text: string): Promise<AIDiagnosticResponse> => {
  // バリデーション
  const validation = validateInquiry(text);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || "入力内容が不正です。");
  }
  
  // 少し遅延を入れて、実際の分析処理をシミュレート
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // ルールベースの分析
    const analysis = analyzeInquiryContent(text);
    const recommendedPatternIds = recommendPatterns(analysis);
    
    // パターンを取得して適合度を設定
    const patterns = recommendedPatternIds.map((id: string, index: number) => {
      const pattern = PARTNERSHIP_PATTERNS.find(p => p.id === id);
      if (pattern) {
        return {
          ...pattern,
          suitability: 100 - (index * 20) // 最初の推奨が100%、次が80%、次が60%
        };
      }
      return null;
    }).filter((p: PartnershipPattern | null) => p !== null) as PartnershipPattern[];

    return {
      aiMessage: generateMessage(analysis, recommendedPatternIds),
      patterns: patterns.length > 0 ? patterns : [PARTNERSHIP_PATTERNS[1]],
      analysis: generateAnalysis(analysis)
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      aiMessage: "申し訳ございませんが、分析中にエラーが発生しました。直接ご相談いただけますと幸いです。",
      patterns: [],
      analysis: "分析中にエラーが発生しました。直接ご相談ください。"
    };
  }
};

// 定義済みの提携パターン
const PARTNERSHIP_PATTERNS: PartnershipPattern[] = [
  {
    id: "basic",
    name: "基本自動化パック",
    description: "よくある質問の自動返信を実現。シンプルで導入しやすいパターンです。",
    features: [
      "よくある質問の自動返信（最大10パターン）",
      "LINEまたはメールのいずれか1系統",
      "基本的なFAQ管理",
      "導入サポート（3日間）"
    ],
    priceRange: "〜10万円",
    suitability: 0
  },
  {
    id: "standard",
    name: "標準自動化パック",
    description: "複数チャネル対応と高度な自動化機能。多くの事業者に最適なバランス型です。",
    features: [
      "複数チャネル対応（LINE/メール/フォームから2系統）",
      "よくある質問の自動返信（最大30パターン）",
      "営業時間外の自動対応",
      "重要度判定による通知機能",
      "導入サポート（5日間）"
    ],
    priceRange: "10万円〜20万円",
    suitability: 0
  },
  {
    id: "premium",
    name: "プレミアム自動化パック",
    description: "完全自動化とカスタマイズ対応。本格的な業務効率化を実現します。",
    features: [
      "全チャネル対応（LINE/メール/フォーム）",
      "無制限の自動返信パターン",
      "AIによる文脈理解と柔軟な応答",
      "CRM連携機能",
      "カスタムワークフロー構築",
      "導入サポート（10日間）+ 運用サポート（3ヶ月）"
    ],
    priceRange: "20万円〜",
    suitability: 0
  }
];

// キーワードベースの分析ロジック
const analyzeInquiryContent = (text: string): {
  complexity: 'simple' | 'medium' | 'complex';
  channelCount: number;
  keywords: string[];
} => {
  const lowerText = text.toLowerCase();
  
  // チャネル関連のキーワード
  const channelKeywords = {
    line: ['line', 'ライン', 'line@'],
    mail: ['mail', 'メール', 'email', 'e-mail'],
    form: ['form', 'フォーム', 'お問い合わせフォーム', '問い合わせフォーム']
  };
  
  const channelCount = [
    channelKeywords.line.some(kw => lowerText.includes(kw)),
    channelKeywords.mail.some(kw => lowerText.includes(kw)),
    channelKeywords.form.some(kw => lowerText.includes(kw))
  ].filter(Boolean).length;
  
  // 複雑さを判定するキーワード
  const simpleKeywords = ['送料', '価格', '料金', 'いくら', '値段', '営業時間', '時間', '場所', '住所', 'アクセス', 'キャンセル', '返金', '返品', '交換'];
  const complexKeywords = ['カスタマイズ', '連携', 'api', 'システム', '統合', 'ワークフロー', 'crm', '複雑', '特殊', '独自'];
  
  const simpleCount = simpleKeywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
  const complexCount = complexKeywords.filter(kw => lowerText.includes(kw.toLowerCase())).length;
  
  let complexity: 'simple' | 'medium' | 'complex' = 'medium';
  if (complexCount > 0 || text.length > 500) {
    complexity = 'complex';
  } else if (simpleCount >= 2) {
    complexity = 'simple';
  }
  
  return {
    complexity,
    channelCount: channelCount || 1, // デフォルトは1
    keywords: []
  };
};

// パターン推奨ロジック
const recommendPatterns = (analysis: ReturnType<typeof analyzeInquiryContent>): string[] => {
  const { complexity, channelCount } = analysis;
  
  if (complexity === 'simple' && channelCount === 1) {
    return ['basic', 'standard'];
  } else if (complexity === 'complex' || channelCount >= 3) {
    return ['premium', 'standard', 'basic'];
  } else {
    return ['standard', 'basic', 'premium'];
  }
};

// メッセージ生成
const generateMessage = (analysis: ReturnType<typeof analyzeInquiryContent>, patterns: string[]): string => {
  const { complexity, channelCount } = analysis;
  const mainPattern = patterns[0];
  
  if (mainPattern === 'basic') {
    return "分析が完了しました！シンプルな自動返信で対応できる内容が多いですね。基本自動化パックが最適です。";
  } else if (mainPattern === 'premium') {
    return "分析が完了しました！複数のチャネルや高度な機能が必要な内容ですね。プレミアム自動化パックで完全対応できます。";
  } else {
    return "分析が完了しました！バランスの取れた自動化で効率化できそうです。標準自動化パックがおすすめです。";
  }
};

// 分析結果の詳細生成
const generateAnalysis = (analysis: ReturnType<typeof analyzeInquiryContent>): string => {
  const { complexity, channelCount } = analysis;
  
  let analysisText = "問い合わせ内容を分析した結果、";
  
  if (channelCount >= 2) {
    analysisText += "複数のチャネル（LINE/メール/フォーム）からの問い合わせがあることが分かりました。";
  } else {
    analysisText += "主に1つのチャネルからの問い合わせが多いことが分かりました。";
  }
  
  if (complexity === 'simple') {
    analysisText += "よくある質問が多く、シンプルな自動返信で対応できる内容です。";
  } else if (complexity === 'complex') {
    analysisText += "複雑な要件やカスタマイズが必要な内容が含まれています。";
  } else {
    analysisText += "標準的な自動化機能で対応できる内容です。";
  }
  
  analysisText += "自動化により、対応時間の短縮と品質の向上が期待できます。";
  
  return analysisText;
};

/**
 * Analyzes the inquiry text using rule-based logic and provides response with partnership patterns.
 * AI APIは使用せず、キーワードベースの分析を行います。
 */
export const analyzeInquiry = async (text: string): Promise<AIDiagnosticResponse> => {
  // 少し遅延を入れて、実際の分析処理をシミュレート
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // ルールベースの分析
    const analysis = analyzeInquiryContent(text);
    const recommendedPatternIds = recommendPatterns(analysis);
    
    // パターンを取得して適合度を設定
    const patterns = recommendedPatternIds.map((id: string, index: number) => {
      const pattern = PARTNERSHIP_PATTERNS.find(p => p.id === id);
      if (pattern) {
        return {
          ...pattern,
          suitability: 100 - (index * 20) // 最初の推奨が100%、次が80%、次が60%
        };
      }
      return null;
    }).filter((p: PartnershipPattern | null) => p !== null) as PartnershipPattern[];

    return {
      aiMessage: generateMessage(analysis, recommendedPatternIds),
      patterns: patterns.length > 0 ? patterns : [PARTNERSHIP_PATTERNS[1]],
      analysis: generateAnalysis(analysis)
    };
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      aiMessage: "申し訳ございませんが、分析中にエラーが発生しました。直接ご相談いただけますと幸いです。",
      patterns: [],
      analysis: "分析中にエラーが発生しました。直接ご相談ください。"
    };
  }
};
