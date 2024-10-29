"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartHandshake } from "lucide-react";

export default function MentalHealthSupportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [supportType, setSupportType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, gmail, supportType, message }),
    });

    if (!response.ok) {
      toast.error("Failed to send request. Please try again later.");
      setIsSubmitting(false);
      return;
    }

    toast.success(
      "Request Received. We'll reach out to you soon with support and resources."
    );

    setIsSubmitting(false);
    event.currentTarget.reset();
  };

  return (
    <div>
      <Navbar />
      <Toaster />
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Mental Health Support
            </CardTitle>
            <CardDescription>
              We're here to help. Reach out for support or resources.
            </CardDescription>
            <HeartHandshake className="w-12 h-12 mx-auto mt-4 text-primary" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="bg-background"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-background"
                  onChange={(event) => setGmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-type">Type of Support Needed</Label>
                <Select
                  name="support-type"
                  required
                  onValueChange={(value) => setSupportType(value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select type of support" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resources">General Resources</SelectItem>
                    <SelectItem value="counseling">
                      Counseling Services
                    </SelectItem>
                    <SelectItem value="crisis">Crisis Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  className="min-h-[100px] bg-background"
                  placeholder="Tell us how we can help..."
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Request Support"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
