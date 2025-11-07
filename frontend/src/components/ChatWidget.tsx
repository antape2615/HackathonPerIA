'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CornerDownLeft, X, Sparkles, MessageSquare } from 'lucide-react'
import { useChatAI, useChatHistory } from '@/hooks/useAssessment'
import ReactMarkdown from 'react-markdown'

interface ChatWidgetProps {
  assessmentId: string
}

export function ChatWidget({ assessmentId }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const chatMutation = useChatAI()
  const { data: chatHistory, isLoading: isLoadingHistory } = useChatHistory(assessmentId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isHistoryLoaded = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  useEffect(() => {
    if (chatHistory && !isHistoryLoaded.current) {
      setMessages(chatHistory);
      isHistoryLoaded.current = true;
    }
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user' as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const response = await chatMutation.mutateAsync({
        message: input,
        assessmentId,
      })
      const assistantMessage = { role: 'assistant' as const, content: response.message }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending chat message:', error)
      const errorMessage = { role: 'assistant' as const, content: 'Lo siento, no pude procesar tu mensaje. Intenta de nuevo.' }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-primary-600 text-white rounded-full p-4 shadow-lg"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-8 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
              <Sparkles className="text-primary-600" size={20} />
              <h3 className="font-semibold text-gray-900">Asistente de Estrategia</h3>
            </div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {isLoadingHistory && (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                </div>
              )}
              {!isLoadingHistory && messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown
                        className="prose prose-sm text-base"
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregúntale a tus datos..."
                  className="input-field pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary-600"
                  disabled={chatMutation.isPending}
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
