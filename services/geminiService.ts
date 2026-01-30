import { BotResponse, BusinessHours, ChatMessage } from "../types";

// モック用の営業時間データ
const BUSINESS_HOURS: BusinessHours[] = [
  { dayOfWeek: '月曜日', open: '11:00', close: '22:00', isHoliday: false },
  { dayOfWeek: '火曜日', open: '11:00', close: '22:00', isHoliday: false },
  { dayOfWeek: '水曜日', open: '11:00', close: '22:00', isHoliday: false },
  { dayOfWeek: '木曜日', open: '11:00', close: '22:00', isHoliday: false },
  { dayOfWeek: '金曜日', open: '11:00', close: '22:00', isHoliday: false },
  { dayOfWeek: '土曜日', open: '11:00', close: '23:00', isHoliday: false },
  { dayOfWeek: '日曜日', open: '11:00', close: '23:00', isHoliday: false },
];

// 定休日
const REGULAR_HOLIDAYS = ['第3水曜日'];

/**
 * ユーザーメッセージを分析してボットの応答を返す（モック版）
 * 本番環境ではGPT-5 nanoを使用予定
 */
export const getBotResponse = async (userMessage: string): Promise<BotResponse> => {
  // 実際のAI処理をシミュレートするため、少し遅延
  await new Promise(resolve => setTimeout(resolve, 500));

  const message = userMessage.toLowerCase();
  let responseText = '';

  // 営業時間の問い合わせ
  if (
    message.includes('営業時間') ||
    message.includes('何時') ||
    message.includes('いつ') ||
    message.includes('開いてる') ||
    message.includes('やってる') ||
    message.includes('時間')
  ) {
    responseText = generateBusinessHoursResponse();
  }
  // 定休日の問い合わせ
  else if (
    message.includes('定休日') ||
    message.includes('休み') ||
    message.includes('休日')
  ) {
    responseText = `定休日は${REGULAR_HOLIDAYS.join('、')}です。\n\n通常営業時間:\n${formatBusinessHours()}`;
  }
  // 今日の営業時間
  else if (
    message.includes('今日') ||
    message.includes('本日')
  ) {
    responseText = generateTodayBusinessHours();
  }
  // 明日の営業時間
  else if (message.includes('明日')) {
    responseText = generateTomorrowBusinessHours();
  }
  // 予約の問い合わせ
  else if (
    message.includes('予約') ||
    message.includes('席')
  ) {
    responseText = '予約は電話またはLINEで承っております。\nお電話: 03-1234-5678\nまたはこのLINEでご希望の日時と人数をお知らせください。\n\n営業時間:\n' + formatBusinessHours();
  }
  // メニューの問い合わせ
  else if (
    message.includes('メニュー') ||
    message.includes('料理')
  ) {
    responseText = 'メニューは以下のリンクからご覧いただけます。\nhttps://example.com/menu\n\n営業時間:\n' + formatBusinessHours();
  }
  // 場所・アクセスの問い合わせ
  else if (
    message.includes('場所') ||
    message.includes('アクセス') ||
    message.includes('どこ') ||
    message.includes('住所')
  ) {
    responseText = '〒100-0001\n東京都千代田区千代田1-1-1\n\n最寄り駅: ◯◯駅から徒歩5分\n\n営業時間:\n' + formatBusinessHours();
  }
  // あいさつ
  else if (
    message.includes('こんにちは') ||
    message.includes('こんばんは') ||
    message.includes('おはよう') ||
    message.includes('はじめまして')
  ) {
    responseText = 'いらっしゃいませ！当店へのお問い合わせありがとうございます。\n営業時間、予約、メニュー、アクセスなど、お気軽にお尋ねください。';
  }
  // その他・デフォルト応答
  else {
    responseText = 'ご質問ありがとうございます。\n\n以下のような内容についてお答えできます：\n・営業時間\n・定休日\n・予約\n・メニュー\n・アクセス\n\nお気軽にお尋ねください！';
  }

  return {
    message: responseText,
    timestamp: new Date(),
  };
};

/**
 * 営業時間を整形して返す
 */
const formatBusinessHours = (): string => {
  return BUSINESS_HOURS.map(day => {
    if (day.isHoliday) {
      return `${day.dayOfWeek}: 定休日`;
    }
    return `${day.dayOfWeek}: ${day.open} - ${day.close}`;
  }).join('\n');
};

/**
 * 営業時間の応答を生成
 */
const generateBusinessHoursResponse = (): string => {
  return `営業時間のご案内です。\n\n${formatBusinessHours()}\n\n定休日: ${REGULAR_HOLIDAYS.join('、')}`;
};

/**
 * 今日の営業時間を生成
 */
const generateTodayBusinessHours = (): string => {
  const today = new Date();
  const dayOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'][today.getDay()];
  const todayHours = BUSINESS_HOURS.find(h => h.dayOfWeek === dayOfWeek);

  if (todayHours) {
    if (todayHours.isHoliday) {
      return `本日は定休日です。申し訳ございません。\n\n営業時間:\n${formatBusinessHours()}`;
    }
    return `本日の営業時間は${todayHours.open}〜${todayHours.close}です。\n\nご来店お待ちしております！`;
  }

  return generateBusinessHoursResponse();
};

/**
 * 明日の営業時間を生成
 */
const generateTomorrowBusinessHours = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'][tomorrow.getDay()];
  const tomorrowHours = BUSINESS_HOURS.find(h => h.dayOfWeek === dayOfWeek);

  if (tomorrowHours) {
    if (tomorrowHours.isHoliday) {
      return `明日は定休日です。申し訳ございません。\n\n営業時間:\n${formatBusinessHours()}`;
    }
    return `明日の営業時間は${tomorrowHours.open}〜${tomorrowHours.close}です。\n\nご来店お待ちしております！`;
  }

  return generateBusinessHoursResponse();
};

/**
 * NOTE: 本番環境ではこの関数をGPT-5 nano APIに置き換える
 * 
 * 例:
 * export const getBotResponseWithAI = async (userMessage: string): Promise<BotResponse> => {
 *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
 *     },
 *     body: JSON.stringify({
 *       model: 'gpt-5-nano',
 *       messages: [
 *         {
 *           role: 'system',
 *           content: `あなたは飲食店のLINEボットです。営業時間: ${formatBusinessHours()}, 定休日: ${REGULAR_HOLIDAYS.join('、')}`
 *         },
 *         { role: 'user', content: userMessage }
 *       ]
 *     })
 *   });
 *   
 *   const data = await response.json();
 *   return {
 *     message: data.choices[0].message.content,
 *     timestamp: new Date()
 *   };
 * };
 */
