'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  '产品咨询',
  '订单查询',
  '安装问题',
  '售后服务',
];

const botResponses: Record<string, string> = {
  '产品咨询': '您好！我们的 MyPilot 智能驾驶系统支持200+车型，包括丰田、本田、大众、特斯拉等主流品牌。您想了解哪款产品？',
  '订单查询': '请提供您的订单号，我会帮您查询订单状态。您也可以登录账户在"我的订单"中查看详情。',
  '安装问题': 'MyPilot 采用即插即用设计，大多数用户可在30分钟内完成安装。我们提供详细的视频教程，您也可以联系授权安装点获取专业服务。',
  '售后服务': '所有 MyPilot 产品享受2年质保。如有问题，请拨打客服热线或发送邮件至 support@mypilot.com，我们会尽快为您处理。',
  'default': '感谢您的咨询！我们的客服团队会尽快回复您。工作时间：周一至周五 9:00-18:00。',
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '您好！欢迎来到 MyPilot 客服中心 👋\n有什么可以帮助您的吗？',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = botResponses[text] || botResponses['default'];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-lg shadow-neon-cyan/50 flex items-center justify-center hover:scale-110 transition-all duration-300 group animate-bounce"
        aria-label="打开客服聊天"
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
        {/* Notification dot */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-neon-pink rounded-full border-2 border-black animate-pulse"></span>
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-neon-cyan/30">
          需要帮助吗？
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
        isMinimized ? 'h-14' : 'h-[520px] max-h-[calc(100vh-48px)]'
      }`}
    >
      <div className="h-full flex flex-col glass-strong rounded-2xl border border-neon-cyan/30 shadow-2xl shadow-neon-cyan/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border-b border-neon-cyan/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-black"></span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">MyPilot 客服</h3>
              <p className="text-neon-green text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                在线
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label={isMinimized ? '展开' : '最小化'}
            >
              <MinusIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-neon-pink hover:bg-neon-pink/10 rounded-lg transition-colors"
              aria-label="关闭"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-br-md'
                        : 'bg-white/10 text-gray-200 rounded-bl-md border border-neon-blue/20'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      message.sender === 'user' ? 'text-white/60' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString('zh-CN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-md border border-neon-blue/20">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-neon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">快速选择：</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-full hover:bg-neon-cyan/20 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-neon-blue/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-neon-blue/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="发送"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
