"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, User, Bot, Search, Users, TrendingUp, Zap, Home, Briefcase, Settings } from "lucide-react"
import { parseConditionsImproved, type ParsedConditions } from "@/lib/keyword-mappings"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  parsedConditions?: ParsedConditions
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "こんにちは！Scout Base Chatです。どのような候補者をお探しですか？自然言語で検索条件を教えてください。",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [candidateCount, setCandidateCount] = useState(127)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    const parsedConditions = parseConditionsImproved(inputValue)

    // Simulate candidate count change based on conditions
    let newCount = candidateCount
    if (inputValue.includes("年収") || inputValue.includes("万円")) {
      newCount = Math.max(20, Math.floor(candidateCount * 0.4))
    } else if (inputValue.includes("リモート")) {
      newCount = Math.floor(candidateCount * 1.3)
    } else if (parsedConditions.jobCategories.length > 0) {
      newCount = Math.floor(candidateCount * 0.7)
    }

    setTimeout(() => {
      const conditionsText = [
        parsedConditions.jobCategories.length > 0 ? `職種: ${parsedConditions.jobCategories.join(", ")}` : "",
        parsedConditions.locations.length > 0 ? `勤務地: ${parsedConditions.locations.join(", ")}` : "",
        parsedConditions.ageRange ? `年齢: ${parsedConditions.ageRange.min}〜${parsedConditions.ageRange.max}歳` : "",
        parsedConditions.experience.length > 0 ? `経験: ${parsedConditions.experience.join(", ")}` : ""
      ].filter(Boolean).join("\n")

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `検索条件を設定しました！\n\n${conditionsText || "条件を解析中..."}\n\n現在 **${newCount}名** の候補者が見つかりました。\n\n${
          newCount < 50 ? "⚠️ 候補者が少ないため、条件の拡張をお勧めします。" :
          newCount > 200 ? "✅ 十分な候補者が見つかりました！" : 
          "💡 さらに条件を追加して絞り込むことも可能です。"
        }`,
        sender: "ai",
        timestamp: new Date(),
        parsedConditions,
      }

      setMessages((prev) => [...prev, aiResponse])
      setCandidateCount(newCount)
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logo and horizontal navigation */}
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SB</span>
            </div>
            <span className="font-semibold text-foreground">ScoutBase</span>
          </div>
        </div>
        
        {/* Horizontal Navigation */}
        <div className="flex gap-1 px-4 pb-2">
          <Button variant="ghost" className="gap-2 text-sm">
            <Home size={16} />
            ダッシュボード
          </Button>
          <Button variant="ghost" className="gap-2 text-sm">
            <Users size={16} />
            スカウト
          </Button>
          <Button variant="outline" className="gap-2 text-sm bg-primary/5 border-primary/20">
            <Search size={16} />
            検索
          </Button>
          <Button variant="ghost" className="gap-2 text-sm">
            <Briefcase size={16} />
            タレントピック
          </Button>
          <Button variant="ghost" className="gap-2 text-sm">
            <Settings size={16} />
            設定
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scout Base Chat</h1>
          <p className="text-muted-foreground">
            採用要件にマッチするタレントを、自動で気になるリスト化します。
          </p>
          <Badge variant="secondary" className="mt-2">
            β版
          </Badge>
        </div>

        {/* Messages */}
        <div className="space-y-6 mb-8">
          {messages.map((message) => (
            <div key={message.id}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="リストに追加するタレントの採用要件を入力してください。"
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            例: 「BtoB営業の経験がある30代の方を都内で探しています」
          </p>
        </div>
      </div>
    </div>
  )
}