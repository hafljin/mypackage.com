import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Mail,
  Smartphone,
  ClipboardList,
  UserCheck,
  Send,
  Bot,
  User,
  Sparkles
} from 'lucide-react';
import { getBotResponse } from './services/geminiService';
import { ChatMessage } from './types';

// --- Sub-components ---

const Section = ({ children, className = "", id = "" }: { children?: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-16 md:py-24 px-6 md:px-12 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);

const Heading = ({ children, level = 2, className = "" }: { children?: React.ReactNode, level?: 1 | 2 | 3, className?: string }) => {
  if (level === 1) return <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${className}`}>{children}</h1>;
  if (level === 2) return <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${className}`}>{children}</h2>;
  return <h3 className={`text-xl font-bold mb-4 ${className}`}>{children}</h3>;
};

const CTAButton = ({ 
  children, 
  secondary = false, 
  onClick 
}: { 
  children?: React.ReactNode, 
  secondary?: boolean, 
  onClick?: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`
      inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl
      ${secondary 
        ? "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50" 
        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
      }
    `}
  >
    {children}
  </button>
);

// --- Chat Component ---

const ChatDemo = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'いらっしゃいませ！当店へのお問い合わせありがとうございます。\n営業時間、予約、メニュー、アクセスなど、お気軽にお尋ねください。',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // メッセージコンテナの最下部までスクロール
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const botResponse = await getBotResponse(inputText);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse.message,
        sender: 'bot',
        timestamp: botResponse.timestamp,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting bot response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    '営業時間を教えて',
    '今日は営業していますか？',
    '予約したいです',
    'メニューを見たい',
    'アクセスを教えて',
  ];

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden max-w-3xl mx-auto">
      {/* チャットヘッダー */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">店舗ボット（デモ）</h3>
          <p className="text-xs text-blue-100">オンライン</p>
        </div>
        <div className="ml-auto">
          <span className="px-3 py-1 bg-blue-500/30 rounded-full text-xs font-medium">モック版</span>
        </div>
      </div>

      {/* メッセージリスト */}
      <div ref={messagesContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }`}
            >
              {message.sender === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>

            <div
              className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.text}
              </p>
              <p
                className={`text-xs mt-2 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString('ja-JP', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* クイック返信 */}
      <div className="px-6 py-3 bg-white border-t border-slate-200">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(reply)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* 入力エリア */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const scrollToDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-white rounded-full blur-3xl transform rotate-12"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-blue-300 rounded-full blur-3xl transform -rotate-12"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 mb-6 bg-blue-500/30 backdrop-blur-md rounded-full text-sm font-medium border border-white/20">
            小規模事業者・店舗向け
          </div>
          <Heading level={1} className="mb-8">
            問い合わせ対応に追われて、<br className="hidden md:block" />
            <span className="text-blue-200">本業が止まっていませんか？</span>
          </Heading>
          <p className="text-xl md:text-2xl mb-10 text-blue-50/90 leading-relaxed font-medium">
            LINE／フォーム／メールの問い合わせ対応を<br />
            最短3日で"ほぼ自動化"します
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <CheckCircle2 className="text-blue-300 w-6 h-6 flex-shrink-0" />
              <span className="font-medium">よくある質問は自動回答</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <CheckCircle2 className="text-blue-300 w-6 h-6 flex-shrink-0" />
              <span className="font-medium">営業時間外も一次対応</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <CheckCircle2 className="text-blue-300 w-6 h-6 flex-shrink-0" />
              <span className="font-medium">人を増やさず運用改善</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <CTAButton onClick={scrollToDemo}>
              <Sparkles className="w-5 h-5 mr-2" />
              デモを試す
            </CTAButton>
            <CTAButton secondary>無料相談（チャット完結）</CTAButton>
          </div>
          <p className="mt-4 text-blue-100 text-sm italic">※電話やMTGは不要です。チャットのみで完結します。</p>
        </div>
      </header>

      {/* 2. Empathy Section */}
      <Section className="bg-white">
        <Heading>こんな状態、ありませんか？</Heading>
        <div className="max-w-2xl mx-auto bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <div className="space-y-4">
            {[
              "問い合わせ対応で作業が止まる",
              "同じ質問に何度も答えている",
              "LINE・フォーム・メールがバラバラ",
              "忙しい時間帯に限って問い合わせが来る",
              "対応漏れ・返信遅れが怖い"
            ].map((item, idx) => (
              <button 
                key={idx}
                onClick={() => toggleCheck(idx)}
                className="flex items-center gap-4 w-full text-left p-4 rounded-xl transition-colors hover:bg-white"
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${checkedItems.includes(idx) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                  {checkedItems.includes(idx) && <CheckCircle2 className="text-white w-4 h-4" />}
                </div>
                <span className={`text-lg ${checkedItems.includes(idx) ? 'text-blue-900 font-bold' : 'text-slate-600'}`}>{item}</span>
              </button>
            ))}
          </div>
          {checkedItems.length >= 3 && (
            <div className="mt-8 p-6 bg-blue-600 text-white rounded-2xl animate-bounce text-center font-bold">
              3つ以上当てはまる方は、このパッケージの対象です！
            </div>
          )}
        </div>
      </Section>

      {/* 3. Solution (Before/After) */}
      <Section className="bg-slate-50">
        <Heading>その問い合わせ対応, こう変えます</Heading>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h4 className="text-xl font-bold mb-6 text-red-500 flex items-center gap-2">
              <Clock className="w-5 h-5" /> 現在の状態（Before）
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-slate-500">
                <span className="text-red-400 font-bold text-lg leading-none">×</span>
                <span>人が全部対応（休みがない）</span>
              </li>
              <li className="flex gap-3 text-slate-500">
                <span className="text-red-400 font-bold text-lg leading-none">×</span>
                <span>内容が属人化（あなたしか返せない）</span>
              </li>
              <li className="flex gap-3 text-slate-500">
                <span className="text-red-400 font-bold text-lg leading-none">×</span>
                <span>忙しいほど品質が落ちる</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5" /> 導入後（After）
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span>よくある内容は自動返信（24時間稼働）</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span>必要なものだけ人に通知（集中できる）</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-300 flex-shrink-0" />
                <span>忙しくても対応品質が一定</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 4. Demo Section */}
      {showDemo && (
        <Section id="demo" className="bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
          <div className="text-center mb-12">
            <Heading>【デモ】実際に試してみる</Heading>
            <p className="text-slate-600 text-lg mb-4">
              飲食店の営業時間問い合わせボットのデモです。<br />
              実際にメッセージを送って、自動応答を体験してください。
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              現在はモック版 / 本番はGPT-5 nano使用予定
            </div>
          </div>
          
          <ChatDemo />

          <div className="mt-8 text-center text-slate-500 text-sm space-y-2">
            <p>💡 試してみよう: 「営業時間を教えて」「今日は営業していますか？」「予約したいです」</p>
            <p className="text-xs">※ このデモはモック版です。本番環境ではGPT-5 nanoを使用して、より自然で柔軟な応答が可能になります。</p>
          </div>
        </Section>
      )}

      {/* 5. Package Content */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <Heading>提供内容：問い合わせ対応自動化パック</Heading>
          <p className="text-slate-500">難しい技術のことは不要。運用に合わせた最適な仕組みを構築します。</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: "ヒアリング", desc: "チャットベースで現在の内容を把握" },
            { icon: ClipboardList, title: "FAQ整理", desc: "自動化向けに内容を再設計" },
            { icon: Zap, title: "1系統自動化", desc: "LINE/フォーム/メールのいずれか1つ" },
            { icon: ShieldCheck, title: "簡単管理", desc: "誰でも使えるシンプルな管理画面" },
            { icon: Smartphone, title: "運用ガイド", desc: "明日から使える簡単な使い方の説明" },
            { icon: UserCheck, title: "安心サポート", desc: "導入後の微調整まで対応" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all hover:shadow-md">
              <item.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h4 className="font-bold text-lg mb-2">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Targets */}
      <Section className="bg-slate-50">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-6 text-blue-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-blue-600" /> 対象となる方
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl shadow-sm">
                <span>小規模事業者・個人店舗</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl shadow-sm">
                <span>人手不足・とにかく忙しい</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700 bg-white p-4 rounded-xl shadow-sm">
                <span>問い合わせが定型化している</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-6 text-slate-400 flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center font-bold text-lg leading-none">×</span> お力になれない方
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 border border-slate-200 p-4 rounded-xl">
                <span>大規模コールセンター</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 border border-slate-200 p-4 rounded-xl">
                <span>複雑すぎる業務フロー</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 border border-slate-200 p-4 rounded-xl">
                <span>電話対応のみを希望</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7. Steps */}
      <Section className="bg-white">
        <Heading>導入までの流れ</Heading>
        <div className="relative mt-16">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-blue-100 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
            {[
              { num: "01", label: "チャットで相談", desc: "まずは無料相談から" },
              { num: "02", label: "現状の共有", desc: "今の対応内容を教えてください" },
              { num: "03", label: "プラン提案", desc: "最適な自動化案を提示" },
              { num: "04", label: "実装（最短3日）", desc: "こちらで構築を進めます" },
              { num: "05", label: "確認・微調整", desc: "実際の動作を確認して完了" }
            ].map((step, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 shadow-lg shadow-blue-200">
                  {step.num}
                </div>
                <h5 className="font-bold mb-2">{step.label}</h5>
                <p className="text-slate-500 text-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 8. Profile */}
      <Section className="bg-slate-900 text-white rounded-t-[4rem]">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 relative border-4 border-slate-700 flex-shrink-0">
            <img 
              src="/profile.jpg" 
              alt="対応する人" 
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOWbvueJhzwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>
          <div>
            <h4 className="text-3xl font-bold mb-6">対応する人</h4>
            <div className="space-y-4 text-slate-300">
              <p className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>現役エンジニア（業務効率化・自動化が専門）</span>
              </p>
              <p className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <span>チャットベースで迅速・丁寧に対応</span>
              </p>
              <p className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>小規模事業者向けの実装に特化</span>
              </p>
              <div className="pt-6 border-t border-slate-800 mt-6">
                <p className="text-sm italic">
                  「今の運用に合わせた、無理のない自動化を提案します。」
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 9. Final CTA */}
      <Section className="bg-blue-600 text-white text-center">
        <Heading className="text-white mb-6">まずは"今の状態"を教えてください</Heading>
        <p className="mb-12 text-blue-100 text-lg">
          相談は無料、チャットのみで完結します。<br />
          強引な営業もありません。お気軽にご連絡ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={scrollToDemo}
            className="px-10 py-5 bg-blue-700 text-white font-bold text-xl rounded-full border-2 border-white/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6" />
            まずはデモを試す
          </button>
          <button className="px-10 py-5 bg-blue-700 text-white font-bold text-xl rounded-full border-2 border-white/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
            無料相談（チャット完結） <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </Section>

      <footer className="py-8 text-center text-slate-400 text-sm bg-slate-950 border-t border-slate-900">
        &copy; {new Date().getFullYear()} 問い合わせ対応自動化パック. All rights reserved.
      </footer>

      <style>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
}
