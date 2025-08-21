"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, User, Bot, Search } from "lucide-react"
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
      content: "こんにちは！スカウト候補検索です。どのような人材をお探しですか？",
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
        content: `以下の条件で人材を検索しました：\n\n${conditionsText || "条件を解析中..."}\n\n条件に合致する候補者を検索中です...`,
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
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-52 bg-teal-50 flex flex-col">
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Scout Base Chat</h2>
          <Button 
            className="w-full justify-start gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm"
          >
            <Search size={16} />
            検索
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium text-gray-900">スカウト候補検索</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
              β版
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            採用要件にマッチする候補者を調査します。
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">クライアント名:</label>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white">
                <option>株式会社A</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">媒体:</label>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white">
                <option>Wantedly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 bg-teal-600 flex-shrink-0">
                  <AvatarFallback className="bg-teal-600 text-white">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex-1">
                {message.sender === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-teal-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-lg">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{message.content}</p>
                    {message.parsedConditions && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border">
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
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-teal-600">
                <AvatarFallback className="bg-teal-600 text-white">
                  <Bot size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
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
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            例: 「BtoB営業の経験がある30代の方を都内で探しています」
          </p>
        </div>
      </div>
    </div>
  )
}