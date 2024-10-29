"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from 'react-hot-toast';

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I assist you today?", sender: "ai" },
    { id: 2, text: "I have a question about React hooks.", sender: "user" },
    {
      id: 3,
      text: "Sure, I'd be happy to help. What would you like to know about React hooks?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    toast.loading('Thinking...');
    if (input.trim()) {
      // Update messages with the user's message
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: input, sender: "user" },
      ]);

      setInput(""); // Clear the input field
      setLoading(true); // Set loading state

      try {
        // Send request to AI API endpoint
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        });

        const data = await response.json();

        toast.dismiss();
        toast.success('Got it!');

        // Update messages with the AI's response
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: data.result,
            sender: "ai",
          },
        ]);
      } catch (error) {
        toast.dismiss();
        toast.error('Something went wrong!');
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Sorry, I couldn't process your request. Please try again.",
            sender: "ai",
          },
        ]);
      } finally {
        toast.dismiss();
        setLoading(false); // Reset loading state
      }
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the message list when messages are updated
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4">
      <Navbar />
      <Toaster />
      <div className="flex flex-col h-[84vh] mx-auto bg-background mt-3">
        <ScrollArea className="flex-grow mb-4 border rounded-lg p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground mr-2">
                  <Bot size={18} />
                </div>
              )}
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.text}
              </div>
              {message.sender === "user" && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground ml-2">
                  <User size={18} />
                </div>
              )}
            </div>
          ))}
          {/* This div will act as the scroll target */}
          <div ref={endOfMessagesRef} />
        </ScrollArea>
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-grow mr-2"
            disabled={loading} // Disable input when loading
          />
          <Button onClick={handleSend} className="px-4 py-2" disabled={loading}>
            <Send size={18} />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
