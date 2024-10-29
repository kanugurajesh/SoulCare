"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import toast, { Toaster } from "react-hot-toast";

export default function Component() {
  const [videoId, setVideoId] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: "ai", content: "Get started by asking me a question?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  // const [divRef, setDivRef] = useState(null);
  const divRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) {
      return toast.error("Please enter a video ID");
    }
    setShowVideo(true);
    toast.success("Submitted video ID: " + videoId);
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendFile = async () => {
    toast.loading("Uploading video...");

    if (!videoId) {
      toast.dismiss();
      return toast.error("Please enter a video ID");
    }

    try {
      const res = await fetch("http://localhost:8000/youtube/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId: videoId }),
      });

      toast.dismiss();

      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: "ai",
          content: "Video uploaded successfully",
        },
      ]);

      toast.success("Video uploaded successfully");

    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload video");
      return;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim()) {
      // Optimistic update
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, user: "You", content: newMessage },
      ]);
    }

    try {
      toast.dismiss();
      toast.loading("Thinking...");
      const res = await fetch("http://localhost:8000/youtube/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: newMessage }),
      });

      // Clear the input field after sending
      setNewMessage("");

      toast.dismiss();
      const data = await res.json();

      console.log(data);

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, user: "ai", content: data.response },
      ]);

      toast.success("Message sent");
    } catch (error) {
      toast.dismiss();
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleDeleteContent = async () => {
    toast.loading("Deleting content...");

    try {
      const res = await fetch("http://localhost:8000/youtube/delete", {
        method: "DELETE",
      });

      toast.dismiss();
      if (res.ok) {
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            user: "ai",
            content: "Content deleted successfully",
          },
        ]);
        toast.success("Content deleted successfully");
      } else {
        toast.error("Failed to delete content");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6">
      <Navbar />
      <Toaster />
      <div className="container mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload YouTube Video ID</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Enter YouTube Video ID"
                  value={videoId}
                  onChange={(e) => setVideoId(e.target.value)}
                />
                <Button type="submit" className="w-full">
                  Load Video
                </Button>
              </form>
              {videoId && showVideo && (
                <div className="flex flex-col gap-4">
                  <iframe
                    className="w-full h-[300px] mt-4"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <Button className="font-semibold" onClick={handleSendFile}>
                    Submit
                  </Button>
                </div>
              )}
              <Button
                className="font-semibold w-full bg-red-600 mt-4"
                onClick={handleDeleteContent}
              >
                Delete Content
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between py-2">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full pr-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start space-x-4 mb-4"
                  >
                    <Avatar>
                      <AvatarFallback>{message.user[0]}</AvatarFallback>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40`}
                      />
                    </Avatar>
                    <div>
                      <p className="font-semibold">{message.user}</p>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={divRef}></div>
              </ScrollArea>
            </CardContent>
            <form
              onSubmit={handleSendMessage}
              className="mt-4 flex space-x-2 px-5 mb-3"
            >
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
