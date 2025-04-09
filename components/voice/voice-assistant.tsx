"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useVoice } from "@/context/voice-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { processVoiceCommand } from "@/lib/voice-commands"
import { KitsuneLogo } from "@/public/logo"
import { humanLikeDelay } from "@/lib/safety-service"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export default function VoiceAssistant() {
  const { isListening, transcript, startListening, stopListening, speak, isSpeaking } = useVoice()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi, I'm CareerKitsune-AI, your job application assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (transcript && !isProcessing) {
      setInputValue(transcript)
    }
  }, [transcript, isProcessing])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !transcript.trim()) return

    const userMessage = inputValue.trim() || transcript.trim()

    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue("")
    stopListening()
    setIsProcessing(true)

    try {
      // Add a typing indicator message
      const typingIndicatorId = Date.now() + 1000
      setMessages((prev) => [
        ...prev,
        {
          id: typingIndicatorId.toString(),
          content: "...",
          sender: "assistant",
          timestamp: new Date(),
        },
      ])

      // Process the command with user ID if available
      // Add a human-like delay to simulate thinking
      await humanLikeDelay(800, 2000)

      const response = await processVoiceCommand(userMessage, user?.id)

      // Remove typing indicator and add the real response
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== typingIndicatorId.toString())
        return [
          ...filtered,
          {
            id: (Date.now() + 2000).toString(),
            content: response,
            sender: "assistant",
            timestamp: new Date(),
          },
        ]
      })

      // Speak the response
      speak(response)
    } catch (error) {
      console.error("Error processing command:", error)

      // Add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id.includes("typing"))
        return [
          ...filtered,
          {
            id: (Date.now() + 3000).toString(),
            content: "I'm sorry, I couldn't process that request. Please try again.",
            sender: "assistant",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <Card className="h-[calc(100vh-8rem)]">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <KitsuneLogo size={24} className="text-primary" />
          CareerKitsune-AI
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {message.sender === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="CareerKitsune-AI" />
                      <AvatarFallback>CK</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content === "..." ? (
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">{message.content}</p>
                    )}
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex items-center gap-2 w-full">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleListening}
            className={isListening ? "voice-pulse" : ""}
            disabled={isSpeaking || isProcessing}
          >
            {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>
          <Input
            placeholder="Type a message or speak..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={(!inputValue.trim() && !transcript.trim()) || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
