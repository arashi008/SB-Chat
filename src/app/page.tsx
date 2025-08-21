"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  showResults?: boolean
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

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "以下の条件で人材を検索しました：",
        sender: "ai",
        timestamp: new Date(),
        parsedConditions,
        showResults: true,
      }

      setMessages((prev) => [...prev, aiResponse])
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
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-52 bg-teal-50 p-4">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Scout Base Chat</h2>
        <Button className="w-full justify-start gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm rounded">
          <Search size={16} />
          検索
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-medium">スカウト候補検索</h1>
            <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">β版</Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">採用要件にマッチする候補者を調査します。......</p>
        </div>

        {/* Filters */}
        <div className="border-b p-4 bg-gray-50">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm">クライアント名:</span>
              <select className="border rounded px-3 py-1 text-sm bg-white">
                <option>株式会社A</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">媒体:</span>
              <select className="border rounded px-3 py-1 text-sm bg-white">
                <option>Wantedly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.sender === "ai" ? (
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 bg-teal-600 flex-shrink-0">
                      <AvatarFallback className="bg-teal-600 text-white">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 mb-3">{message.content}</div>
                      {message.showResults && (
                        <div className="border rounded p-4 bg-white max-w-md">
                          <div className="text-sm space-y-1 mb-3">
                            <div>職種: corporate_sales</div>
                            <div>勤務地: tokyo</div>
                            <div>年齢: 30〜39歳</div>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            条件に合致する候補者を検索中です...
                          </div>
                          <div className="flex gap-2">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">corporate_sales</span>
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">tokyo</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 justify-end">
                    <div className="bg-teal-600 text-white rounded-lg px-4 py-2 max-w-xs">
                      <div className="text-sm">{message.content}</div>
                    </div>
                    <Avatar className="w-8 h-8 bg-gray-300 flex-shrink-0">
                      <AvatarFallback className="bg-gray-300">
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 bg-teal-600">
                  <AvatarFallback className="bg-teal-600 text-white">
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-500">入力中...</div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-3">
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
          <div className="text-xs text-gray-500 mt-2">
            例: 「BtoB営業の経験がある30代の方を都内で探しています」
          </div>
        </div>
      </div>
    </div>
  )
}