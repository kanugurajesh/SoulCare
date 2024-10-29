"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Bot, Send, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Thinking...");
    if (inputMessage.trim() === "" || isLoading) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      toast.dismiss();
      if (response.ok) {
        const newBotMessage: Message = {
          id: messages.length + 2,
          text: data,
          sender: "ai",
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      } else {
        toast.error("Failed to send message. Please try again.");
        throw new Error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    toast.dismiss();
    if (file && file.type === "application/pdf") {
      toast.loading("Uploading...");
      setFile(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:8000/upload", {
          method: "POST",
          body: formData,
        });

        toast.dismiss();
        if (!response.ok) throw new Error("Upload failed");

        const newBotMessage: Message = {
          id: messages.length + 1,
          text: `PDF "${file.name}" has been uploaded successfully!`,
          sender: "ai",
        };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);

        toast.success("PDF uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload PDF. Please try again.");
      }
    } else {
      toast.error("Please upload a valid PDF file.");
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the message list when messages are updated
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-4">
      <Toaster />
      <Navbar />
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
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            className="flex-grow mr-2"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2"
          >
            <Upload size={18} />
            <span className="sr-only">Send</span>
          </Button>
          <Button onClick={handleSendMessage} className="px-4 py-2" disabled={isLoading}>
            <Send size={18} />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
