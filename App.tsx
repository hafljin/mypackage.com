
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  Clock, 
  ShieldCheck, 
  ChevronDown,
  Mail,
  Smartphone,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { analyzeInquiry } from './services/geminiService';

// --- Sub-components ---

// Fix: Making children optional in the type definition resolves JSX property missing errors.
const Section = ({ children, className = "", id = "" }: { children?: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={`py-16 md:py-24 px-6 md:px-12 ${className}`}>
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  </section>
);

// Fix: Making children optional in the type definition resolves JSX property missing errors.
const Heading = ({ children, level = 2, className = "" }: { children?: React.ReactNode, level?: 1 | 2 | 3, className?: string }) => {
  if (level === 1) return <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${className}`}>{children}</h1>;
  if (level === 2) return <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-center ${className}`}>{children}</h2>;
  return <h3 className={`text-xl font-bold mb-4 ${className}`}>{children}</h3>;
};

// Fix: Making children optional in the type definition resolves JSX property missing errors.
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

// --- Main App ---

export default function App() {
  const [inquiryText, setInquiryText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleAnalyze = async () => {
    if (!inquiryText.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeInquiry(inquiryText);
    setAnalysis(result);
    setIsAnalyzing(false);
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
            最短3日で“ほぼ自動化”します
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
            <CTAButton>無料相談（チャット完結）</CTAButton>
            <CTAButton secondary>今の対応内容を送る</CTAButton>
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

      {/* 4. Package Content */}
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

      {/* AI Diagnostic (Bonus Feature) */}
      <Section className="bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto">
          <Heading className="text-white">【AI診断】今の対応を分析してみる</Heading>
          <p className="text-center mb-8 text-indigo-100">
            実際にお客様に送っている返信や、よく来る問い合わせを入力してください。<br />
            自動化のプロが（AIの力を借りて）無料でアドバイスします。
          </p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <textarea 
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              placeholder="例：『送料はいくらですか？』『予約のキャンセルはできますか？』などのよくある質問を入力..."
              className="w-full h-32 p-4 rounded-xl bg-white text-slate-900 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !inquiryText}
              className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? "分析中..." : "無料で自動化アドバイスを受ける"}
            </button>
            {analysis && (
              <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h5 className="font-bold text-blue-300 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 分析結果アドバイス:
                </h5>
                <div className="text-indigo-50 leading-relaxed whitespace-pre-wrap">{analysis}</div>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* 5. Targets */}
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

      {/* 6. Steps */}
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

      {/* 7. Profile */}
      <Section className="bg-slate-900 text-white rounded-t-[4rem]">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl transform rotate-3 relative border-4 border-slate-700 flex-shrink-0">
            <img src="https://picsum.photos/400/400" alt="Profile" className="w-full h-full object-cover grayscale" />
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
                  「大企業向けの高額ツールは必要ありません。あなたの今の運用に合わせた、無理のない自動化を提案します。」
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. Final CTA */}
      <Section className="bg-blue-600 text-white text-center">
        <Heading className="text-white mb-6">まずは“今の状態”を教えてください</Heading>
        <p className="mb-12 text-blue-100 text-lg">
          相談は無料、チャットのみで完結します。<br />
          強引な営業もありません。お気軽にご連絡ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-white text-blue-600 font-bold text-xl rounded-full shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
            無料相談（チャット完結） <ArrowRight className="w-6 h-6" />
          </button>
          <button className="px-10 py-5 bg-blue-700 text-white font-bold text-xl rounded-full border-2 border-white/20 hover:bg-blue-800 transition-all">
            今の問い合わせ内容を送る
          </button>
        </div>
      </Section>

      <footer className="py-8 text-center text-slate-400 text-sm bg-slate-950 border-t border-slate-900">
        &copy; {new Date().getFullYear()} 問い合わせ対応自動化パック. All rights reserved.
      </footer>
    </div>
  );
}
