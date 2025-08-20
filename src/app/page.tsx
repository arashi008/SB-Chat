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
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SB</span>
            </div>
            <span className="font-semibold text-sidebar-foreground">ScoutBase</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Home size={18} />
            ダッシュボード
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Users size={18} />
            スカウト
          </Button>
          <Button
            variant="default"
            className="w-full justify-start gap-3 bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <Search size={18} />
            検索
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Briefcase size={18} />
            タレントピック
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Settings size={18} />
            設定
          </Button>
        </nav>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Scout Base Chat</h1>
              <p className="text-sm text-muted-foreground">
                採用要件にマッチするタレントを、自動で気になるリスト化します。
              </p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              β版
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[70%] p-3 ${
                  message.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-card"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.parsedConditions && (
                  <div className="mt-2 pt-2 border-t border-border/20">
                    <div className="flex flex-wrap gap-1">
                      {message.parsedConditions.jobCategories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {message.parsedConditions.locations.map((location) => (
                        <Badge key={location} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                      {message.parsedConditions.ageRange && (
                        <Badge variant="outline" className="text-xs">
                          {message.parsedConditions.ageRange.min}-{message.parsedConditions.ageRange.max}歳
                        </Badge>
                      )}
                      {message.parsedConditions.experience.map((exp) => (
                        <Badge key={exp} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 bg-muted">
                  <AvatarFallback>
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card p-4">
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
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card">
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
              className="bg-primary hover:bg-primary/90"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">例: 「BtoB営業の経験がある30代の方を都内で探しています」</p>
        </div>
      </div>
    </div>
  )
}