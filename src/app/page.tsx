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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <div style={{ 
        width: '200px', 
        backgroundColor: '#d0f2e4', 
        padding: '16px'
      }}>
        <h2 style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#1f2937', 
          marginBottom: '16px' 
        }}>
          Scout Base Chat
        </h2>
        <Button 
          style={{ 
            width: '100%', 
            backgroundColor: '#059669', 
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'flex-start'
          }}
        >
          <Search size={16} />
          検索
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: '1', 
        display: 'flex', 
        flexDirection: 'column', 
        backgroundColor: 'white' 
      }}>
        {/* Header */}
        <div style={{ 
          borderBottom: '1px solid #e5e7eb', 
          padding: '16px' 
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <h1 style={{ 
              fontSize: '18px', 
              fontWeight: '500' 
            }}>
              スカウト候補検索
            </h1>
            <Badge style={{ 
              backgroundColor: '#dbeafe', 
              color: '#1d4ed8', 
              fontSize: '12px', 
              padding: '2px 8px' 
            }}>
              β版
            </Badge>
          </div>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280', 
            marginTop: '4px' 
          }}>
            採用要件にマッチする候補者を調査します。......
          </p>
        </div>

        {/* Filters */}
        <div style={{ 
          borderBottom: '1px solid #e5e7eb', 
          padding: '16px', 
          backgroundColor: '#f9fafb' 
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '24px' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span style={{ fontSize: '14px' }}>クライアント名:</span>
              <select style={{ 
                border: '1px solid #d1d5db', 
                borderRadius: '4px', 
                padding: '4px 12px', 
                fontSize: '14px', 
                backgroundColor: 'white' 
              }}>
                <option>株式会社A</option>
              </select>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span style={{ fontSize: '14px' }}>媒体:</span>
              <select style={{ 
                border: '1px solid #d1d5db', 
                borderRadius: '4px', 
                padding: '4px 12px', 
                fontSize: '14px', 
                backgroundColor: 'white' 
              }}>
                <option>Wantedly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ 
          flex: '1', 
          padding: '24px', 
          overflowY: 'auto' 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {messages.map((message, index) => (
              <div key={message.id}>
                {message.sender === "ai" ? (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Avatar style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#059669',
                      flexShrink: 0
                    }}>
                      <AvatarFallback style={{ 
                        backgroundColor: '#059669', 
                        color: 'white' 
                      }}>
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                    <div style={{ flex: '1' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        color: '#1f2937', 
                        marginBottom: '12px' 
                      }}>
                        {message.content}
                      </div>
                      {message.showResults && (
                        <div style={{ 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '6px', 
                          padding: '16px', 
                          backgroundColor: 'white', 
                          maxWidth: '384px' 
                        }}>
                          <div style={{ 
                            fontSize: '14px', 
                            marginBottom: '12px' 
                          }}>
                            <div style={{ marginBottom: '4px' }}>職種: corporate_sales</div>
                            <div style={{ marginBottom: '4px' }}>勤務地: tokyo</div>
                            <div style={{ marginBottom: '4px' }}>年齢: 30〜39歳</div>
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#6b7280', 
                            marginBottom: '12px' 
                          }}>
                            条件に合致する候補者を検索中です...
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ 
                              backgroundColor: '#f3f4f6', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}>
                              corporate_sales
                            </span>
                            <span style={{ 
                              backgroundColor: '#f3f4f6', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px' 
                            }}>
                              tokyo
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'flex-end' 
                  }}>
                    <div style={{ 
                      backgroundColor: '#059669', 
                      color: 'white', 
                      borderRadius: '8px', 
                      padding: '8px 16px', 
                      maxWidth: '320px' 
                    }}>
                      <div style={{ fontSize: '14px' }}>{message.content}</div>
                    </div>
                    <Avatar style={{ 
                      width: '32px', 
                      height: '32px', 
                      backgroundColor: '#d1d5db',
                      flexShrink: 0
                    }}>
                      <AvatarFallback style={{ backgroundColor: '#d1d5db' }}>
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Avatar style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#059669' 
                }}>
                  <AvatarFallback style={{ 
                    backgroundColor: '#059669', 
                    color: 'white' 
                  }}>
                    <Bot size={16} />
                  </AvatarFallback>
                </Avatar>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#6b7280' 
                }}>
                  入力中...
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ 
          borderTop: '1px solid #e5e7eb', 
          padding: '16px' 
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '12px' 
          }}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="リストに追加するタレントの採用要件を入力してください。"
              style={{ flex: '1' }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              style={{ 
                backgroundColor: '#059669',
                color: 'white'
              }}
            >
              <Send size={16} />
            </Button>
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: '#6b7280', 
            marginTop: '8px' 
          }}>
            例: 「BtoB営業の経験がある30代の方を都内で探しています」
          </div>
        </div>
      </div>
    </div>
  )
}