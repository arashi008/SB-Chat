'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search, 
  Users, 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  Clock,
  DollarSign,
  Zap,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Bot,
  User,
  Send
} from 'lucide-react';

interface SearchCondition {
  type: string;
  value: string;
  icon: any;
}

interface ExpansionSuggestion {
  id: string;
  title: string;
  description: string;
  impact: '低' | '中' | '高';
  priority: 'high' | 'medium' | 'low';
  expectedIncrease: string;
  icon: any;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function DemoPage() {
  const [currentConditions, setCurrentConditions] = useState<SearchCondition[]>([
    { type: 'job', value: '法人営業', icon: Briefcase },
    { type: 'location', value: '東京都', icon: MapPin },
    { type: 'age', value: '25-35歳', icon: Clock },
    { type: 'experience', value: '3年以上', icon: TrendingUp }
  ]);
  
  const [candidateCount, setCandidateCount] = useState(127);
  const [isUpdating, setIsUpdating] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'こんにちは！Green Scout AI です。自然言語で検索条件を追加できます。例：「年収600万以上」「リモート可能」',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const [suggestions] = useState<ExpansionSuggestion[]>([
    {
      id: 'age_expand',
      title: '年齢範囲を拡張',
      description: '25-35歳 → 23-37歳に拡張して対象を広げる',
      impact: '中',
      priority: 'high',
      expectedIncrease: '+30-40%',
      icon: Clock
    },
    {
      id: 'job_related',
      title: '関連職種を追加',
      description: 'インサイドセールス、カスタマーサクセスを追加',
      impact: '中',
      priority: 'high',
      expectedIncrease: '+25-35%',
      icon: Briefcase
    },
    {
      id: 'location_expand',
      title: '通勤圏を拡張',
      description: '神奈川県、埼玉県、千葉県を追加',
      impact: '高',
      priority: 'medium',
      expectedIncrease: '+50-70%',
      icon: MapPin
    },
    {
      id: 'experience_reduce',
      title: '経験年数を緩和',
      description: '必要経験年数を3年→2年に緩和',
      impact: '中',
      priority: 'high',
      expectedIncrease: '+35-50%',
      icon: TrendingUp
    }
  ]);

  const demoResponses: Record<string, { response: string; condition?: SearchCondition; countChange: number }> = {
    '年収600万以上': {
      response: '年収600万円以上の条件を追加しました！現在の候補者数が減少しています。年収範囲を調整する拡張提案をご提示しますね。',
      condition: { type: 'salary', value: '600万円以上', icon: DollarSign },
      countChange: -0.4
    },
    'リモート可能': {
      response: 'リモートワーク可能な条件を追加しました！地域制限を緩和できるため、全国の優秀な候補者にアプローチできます。',
      condition: { type: 'workStyle', value: 'リモート可能', icon: MapPin },
      countChange: 0.3
    },
    'エンジニア': {
      response: 'エンジニア職種を検索条件に追加しました。フロントエンド、バックエンド、フルスタックなど関連職種の拡張提案を準備しています。',
      condition: { type: 'job', value: 'エンジニア', icon: Briefcase },
      countChange: -0.2
    },
    '30代': {
      response: '30代の年齢条件を設定しました。20代後半から30代前半への拡張で、経験豊富な候補者も含めることができます。',
      condition: { type: 'age', value: '30-39歳', icon: Clock },
      countChange: -0.3
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    // デモ用の遅延
    setTimeout(() => {
      let bestMatch = '';
      let maxScore = 0;
      
      Object.keys(demoResponses).forEach(key => {
        if (chatInput.includes(key)) {
          const score = key.length;
          if (score > maxScore) {
            maxScore = score;
            bestMatch = key;
          }
        }
      });

      const demoData = demoResponses[bestMatch] || {
        response: `「${chatInput}」の条件を理解しました。検索結果に基づいて最適な拡張提案を生成しています...`,
        countChange: 0
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: demoData.response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // 条件とカウント更新
      if (demoData.condition) {
        setCurrentConditions(prev => [...prev, demoData.condition!]);
      }
      
      if (demoData.countChange !== 0) {
        setIsUpdating(true);
        const newCount = Math.floor(candidateCount * (1 + demoData.countChange));
        setTimeout(() => {
          setCandidateCount(newCount);
          setIsUpdating(false);
        }, 1000);
      }
    }, 1500);
  };

  const handleSuggestionApply = (suggestionId: string) => {
    setIsUpdating(true);
    const increaseRatio = Math.random() * 0.6 + 0.2;
    const newCount = Math.floor(candidateCount * (1 + increaseRatio));
    
    setTimeout(() => {
      setCandidateCount(newCount);
      setIsUpdating(false);
    }, 1000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case '高': return 'bg-red-100 text-red-800';
      case '中': return 'bg-yellow-100 text-yellow-800';
      case '低': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                戻る
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Green Scout AI デモ
                </h1>
                <p className="text-sm text-gray-600">
                  検索条件拡張ツール
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* 候補者数表示 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className={`border rounded-lg p-6 transition-all duration-500 ${
              isUpdating 
                ? 'bg-yellow-50 border-yellow-200' 
                : candidateCount < 100 
                  ? 'bg-red-50 border-red-200' 
                  : candidateCount > 200 
                    ? 'bg-green-50 border-green-200'
                    : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isUpdating ? (
                    <Sparkles className="w-8 h-8 text-yellow-600 animate-spin" />
                  ) : (
                    <Users className={`w-8 h-8 ${
                      candidateCount < 100 ? 'text-red-600' :
                      candidateCount > 200 ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">現在の候補者数</h2>
                    {candidateCount < 100 && !isUpdating && (
                      <p className="text-red-600 text-sm">⚠️ 条件を緩和することをお勧めします</p>
                    )}
                  </div>
                </div>
                <span className={`text-5xl font-bold transition-colors ${
                  isUpdating ? 'text-yellow-600' :
                  candidateCount < 100 ? 'text-red-600' :
                  candidateCount > 200 ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {candidateCount}名
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左側：チャット */}
          <div>
            {/* AIチャット */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                  Green Scout AI
                </CardTitle>
                <CardDescription>自然言語で検索条件を追加・変更できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* メッセージ履歴 */}
                  <div className="h-80 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start gap-2 ${
                          message.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-green-600 text-white'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                        </div>
                        
                        <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-2 rounded-lg max-w-full text-sm ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-white border rounded-tl-none'
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* タイピング表示 */}
                    {isTyping && (
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                          <Bot className="w-3 h-3" />
                        </div>
                        <div className="bg-white border rounded-lg rounded-tl-none p-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 入力エリア */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="例: 年収600万以上"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* クイックアクション */}
                  <div className="flex flex-wrap gap-1">
                    {['年収600万以上', 'リモート可能', 'エンジニア', '30代'].map((text) => (
                      <Button
                        key={text}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setChatInput(text)}
                      >
                        {text}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右側：検索条件と拡張提案 */}
          <div>
            {/* 現在の検索条件 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="w-6 h-6" />
                  現在の検索条件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {currentConditions.map((condition, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <condition.icon className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="text-xs text-blue-600 font-medium uppercase">{condition.type}</div>
                        <div className="font-semibold">{condition.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI拡張提案 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="w-6 h-6 text-orange-600" />
                  AI拡張提案
                </CardTitle>
                <CardDescription>
                  条件を緩和して候補者を増やす提案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                        suggestion.priority === 'high' ? 'border-red-200 bg-red-50' :
                        suggestion.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                        'border-green-200 bg-green-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <suggestion.icon className="w-6 h-6 text-gray-700" />
                          <h3 className="font-bold text-lg text-gray-900">{suggestion.title}</h3>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {suggestion.expectedIncrease}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{suggestion.description}</p>
                      <Button
                        onClick={() => handleSuggestionApply(suggestion.id)}
                        className={`w-full ${
                          suggestion.priority === 'high' ? 'bg-red-600 hover:bg-red-700' :
                          suggestion.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        この提案を適用する
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}