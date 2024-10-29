"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, ExternalLink } from "lucide-react";

type Result = {
  title: string;
  url: string;
  content: string;
  score: number;
};

type ApiResponse = {
  query: string;
  follow_up_questions: string[] | null;
  answer: string | null;
  images: string[];
  results: Result[];
  response_time: number;
};

export default function Component() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              SoulCare Researcher
            </CardTitle>
            <CardDescription>
              Enter your query to search for relevant information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt here"
                  className="flex-grow"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Results for: {response.query}</CardTitle>
              <CardDescription>
                Found {response.results.length} results in{" "}
                {response.response_time.toFixed(2)} seconds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {response.results.map((result, index) => (
                  <Card
                    key={index}
                    className="mb-4 hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          {result.title}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                        <span className="text-sm font-normal text-muted-foreground">
                          Score: {result.score.toFixed(4)}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {result.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
