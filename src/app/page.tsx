import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Search, ArrowRight, Zap, Users, TrendingUp, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Green Scout
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            AI検索条件拡張ツール
          </p>
          <p className="text-gray-500">
            ダイレクトスカウトの検索効率を劇的に向上
          </p>
        </div>

        {/* メイン機能カード */}
        <Card className="max-w-4xl mx-auto mb-12 bg-white/80 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">🚀 AIが候補者発見を最適化</CardTitle>
            <CardDescription className="text-lg">
              自然言語で条件を指定すると、AIが最適な拡張提案を行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">自然言語入力</h3>
                <p className="text-sm text-gray-600">
                  「年収600万以上のエンジニア」など、自然な言葉で検索条件を指定
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">AI拡張提案</h3>
                <p className="text-sm text-gray-600">
                  条件を分析し、候補者数を増やす最適な拡張提案を自動生成
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">効果測定</h3>
                <p className="text-sm text-gray-600">
                  候補者数の変化をリアルタイムで確認し、最適な条件を決定
                </p>
              </div>
            </div>

            {/* 期待効果 */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-center mb-4">🎯 期待効果</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>候補者発見率: <strong>+50-200%</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>検索時間: <strong>70%削減</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-600" />
                  <span>取りこぼし防止: <strong>大幅改善</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span>工数削減: <strong>採用効率化</strong></span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/demo">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  デモを体験する
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-2">
                ※実際のGreenデータとの連携は開発中です
              </p>
            </div>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="text-center text-gray-500 text-sm">
          <p>Green専用 ダイレクトスカウト検索条件拡張ツール</p>
          <p className="mt-1">社内提案用デモバージョン</p>
        </div>
      </div>
    </div>
  );
}