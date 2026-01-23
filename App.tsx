
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
  UserCheck,
  Sparkles
} from 'lucide-react';
import { analyzeBySelection, DIAGNOSTIC_OPTIONS } from './services/geminiService';
import { AIDiagnosticResponse } from './types';

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
  const [selectedInquiryTypes, setSelectedInquiryTypes] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [diagnosticResult, setDiagnosticResult] = useState<AIDiagnosticResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const toggleInquiryType = (id: string) => {
    setSelectedInquiryTypes(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const hasSelection = selectedInquiryTypes.length > 0 || selectedChannels.length > 0;

  const handleAnalyze = async () => {
    if (!hasSelection) return;
    setIsAnalyzing(true);
    setDiagnosticResult(null);
    try {
      const result = await analyzeBySelection({
        inquiryTypes: selectedInquiryTypes,
        channels: selectedChannels,
      });
      setDiagnosticResult(result);
    } catch (error) {
      setDiagnosticResult({
        aiMessage: "申し訳ございません。診断中にエラーが発生しました。",
        patterns: [],
        analysis: "",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedInquiryTypes([]);
    setSelectedChannels([]);
    setDiagnosticResult(null);
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
            <CTAButton secondary>無料相談（チャット完結）</CTAButton>
            <CTAButton secondary>お見積もりはこちら</CTAButton>
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

      {/* 自動診断（選択式） */}
      <Section className="bg-indigo-900 text-white">
        <div className="max-w-3xl mx-auto">
          <Heading className="text-white">【自動診断】今の対応を分析してみる</Heading>
          <p className="text-center mb-8 text-indigo-100">
            当てはまるものを選んで「診断する」を押してください。<br />
            どのパックが合うか、無料でアドバイスします。
          </p>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            {!diagnosticResult ? (
              <>
                {/* 問い合わせの種類 */}
                <div className="mb-6">
                  <p className="text-indigo-200 font-bold mb-3">お客様からよくある問い合わせ（複数可）</p>
                  <div className="flex flex-wrap gap-2">
                    {DIAGNOSTIC_OPTIONS.inquiryTypes.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleInquiryType(opt.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedInquiryTypes.includes(opt.id)
                            ? 'bg-white text-indigo-900'
                            : 'bg-white/10 text-indigo-100 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* チャネル */}
                <div className="mb-6">
                  <p className="text-indigo-200 font-bold mb-3">主にどのチャネルから来ますか？（複数可）</p>
                  <div className="flex flex-wrap gap-2">
                    {DIAGNOSTIC_OPTIONS.channels.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleChannel(opt.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedChannels.includes(opt.id)
                            ? 'bg-white text-indigo-900'
                            : 'bg-white/10 text-indigo-100 border border-white/20 hover:bg-white/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !hasSelection}
                  className="w-full py-4 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? "診断中..." : "診断する"}
                </button>
              </>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* 診断結果 */}
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-400/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-blue-200" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-blue-200 mb-2">診断結果</h5>
                      <p className="text-indigo-50 leading-relaxed">{diagnosticResult.aiMessage}</p>
                    </div>
                  </div>
                </div>

                {diagnosticResult.analysis && (
                  <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <h5 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> 詳細分析
                    </h5>
                    <p className="text-indigo-50 leading-relaxed">{diagnosticResult.analysis}</p>
                  </div>
                )}

                {diagnosticResult.patterns && diagnosticResult.patterns.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="font-bold text-blue-300 text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> おすすめの提携パターン
                    </h5>
                    <div className="grid gap-4">
                      {diagnosticResult.patterns.map((pattern, idx) => (
                        <div 
                          key={pattern.id}
                          className={`p-6 rounded-2xl border-2 transition-all ${
                            idx === 0 
                              ? 'bg-blue-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20' 
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h6 className="font-bold text-lg text-white">{pattern.name}</h6>
                                {idx === 0 && (
                                  <span className="px-2 py-1 bg-blue-400 text-blue-900 text-xs font-bold rounded-full">
                                    最適
                                  </span>
                                )}
                              </div>
                              <p className="text-indigo-100 text-sm mb-3">{pattern.description}</p>
                              {pattern.suitability > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-indigo-200">適合度</span>
                                    <span className="text-sm font-bold text-blue-300">{pattern.suitability}%</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                      className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${pattern.suitability}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            {pattern.priceRange && (
                              <div className="text-right ml-4">
                                <div className="text-xs text-indigo-200 mb-1">価格目安</div>
                                <div className="text-lg font-bold text-blue-300">{pattern.priceRange}</div>
                              </div>
                            )}
                          </div>
                          <ul className="space-y-2 mt-4">
                            {pattern.features.map((feature, featureIdx) => (
                              <li key={featureIdx} className="flex items-start gap-2 text-sm text-indigo-100">
                                <CheckCircle2 className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 border-2 border-white/30 text-indigo-100 font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  診断をやり直す
                </button>
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
            <img 
              src="/profile.jpg" 
              alt="対応する人" 
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // 画像が読み込めない場合、プレースホルダーを表示
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

      {/* 8. Final CTA */}
      <Section className="bg-blue-600 text-white text-center">
        <Heading className="text-white mb-6">まずは“今の状態”を教えてください</Heading>
        <p className="mb-12 text-blue-100 text-lg">
          相談は無料、チャットのみで完結します。<br />
          強引な営業もありません。お気軽にご連絡ください。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-blue-700 text-white font-bold text-xl rounded-full border-2 border-white/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
            無料相談（チャット完結） <ArrowRight className="w-6 h-6" />
          </button>
          <button className="px-10 py-5 bg-blue-700 text-white font-bold text-xl rounded-full border-2 border-white/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
            お見積もりはこちら
          </button>
        </div>
        <p className="mt-4 text-blue-200 text-sm">
          ※返信例やよく来る質問を送っていただくと、より正確なお見積もりが可能です。
        </p>
      </Section>

      <footer className="py-8 text-center text-slate-400 text-sm bg-slate-950 border-t border-slate-900">
        &copy; {new Date().getFullYear()} 問い合わせ対応自動化パック. All rights reserved.
      </footer>
    </div>
  );
}
