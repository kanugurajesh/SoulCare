import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Brain,
  BarChart,
  Shield,
  Award,
  MessageCircle,
  FileText,
  Database,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Brain className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">SoulCare</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="contact"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to SoulCare
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your personal AI-powered mental health companion. Analyze,
                  track, and improve your well-being with advanced technology
                  and professional support.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/cbt">
                  <Button>Get Started</Button>
                </Link>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
          id="keyfeatures"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <BarChart className="h-6 w-6 mb-2" />
                  <CardTitle>Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Advanced NLP to analyze your social media sentiment and
                    track mental health patterns.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageCircle className="h-6 w-6 mb-2" />
                  <CardTitle>AI Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    24/7 AI-powered support with our CBT bot for real-time
                    assistance and guidance.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-6 w-6 mb-2" />
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your data is protected with state-of-the-art security
                    measures and encryption.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 mb-2" />
                  <CardTitle>Medical File Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Upload, manage, and securely store your medical files for
                    easy access and reference.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Database className="h-6 w-6 mb-2" />
                  <CardTitle>Vector Database Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Full control over your data in our vector database, with
                    options to delete and manage your information.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  AI-Powered Insights
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our advanced AI analyzes your data to provide personalized
                  insights and recommendations. Track your progress, identify
                  patterns, and receive tailored support for your mental health
                  journey.
                </p>
              </div>
              <div className="flex justify-center">
                <BarChart className="h-64 w-64 text-primary" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex justify-center">
                <Award className="h-64 w-64 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Gamified Well-being
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Engage with our app through gamified features that make taking
                  care of your mental health fun and rewarding. Set goals, earn
                  achievements, and track your progress in an interactive way.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  RAG System: Your Medical Data, Your Control
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Our Retrieval-Augmented Generation (RAG) system allows you to
                  securely upload and manage your medical files. Access your
                  data anytime, anywhere, and maintain full control over your
                  information in our vector database.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <span>Upload and download medical files securely</span>
                  </li>
                  <li className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-primary" />
                    <span>Manage your data in our vector database</span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    <span>
                      Delete your data at any time for complete privacy control
                    </span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <FileText className="h-64 w-64 text-primary" />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Start Your Journey?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join SoulCare today and take the first step towards better
                  mental health with AI-powered support, professional resources,
                  and secure medical file management.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg">Sign Up Now</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 SoulCare. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
