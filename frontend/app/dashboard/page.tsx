'use client'

import * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function TwitterSentimentDashboard() {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  React.useEffect(() => {
    setDate({
      from: addDays(new Date(), -30),
      to: new Date(),
    })
  }, [])

  const sentimentDistributionData = [
    { name: "Positive", value: 4500 },
    { name: "Neutral", value: 3200 },
    { name: "Negative", value: 2300 },
  ]

  const sentimentByDayData = [
    { name: "Mon", Positive: 65, Neutral: 45, Negative: 30 },
    { name: "Tue", Positive: 59, Neutral: 50, Negative: 40 },
    { name: "Wed", Positive: 80, Neutral: 55, Negative: 35 },
    { name: "Thu", Positive: 81, Neutral: 50, Negative: 45 },
    { name: "Fri", Positive: 56, Neutral: 60, Negative: 40 },
    { name: "Sat", Positive: 55, Neutral: 65, Negative: 35 },
    { name: "Sun", Positive: 70, Neutral: 60, Negative: 30 },
  ]

  const sentimentTrendData = [
    { name: "Week 1", Positive: 4000, Neutral: 3000, Negative: 2000 },
    { name: "Week 2", Positive: 4200, Neutral: 3100, Negative: 2300 },
    { name: "Week 3", Positive: 4500, Neutral: 3200, Negative: 2100 },
    { name: "Week 4", Positive: 4300, Neutral: 3150, Negative: 2200 },
  ]

  const topicSentimentData = [
    { name: "Politics", Positive: 300, Neutral: 200, Negative: 150 },
    { name: "Technology", Positive: 450, Neutral: 300, Negative: 100 },
    { name: "Entertainment", Positive: 400, Neutral: 350, Negative: 50 },
    { name: "Sports", Positive: 350, Neutral: 250, Negative: 100 },
    { name: "Business", Positive: 250, Neutral: 200, Negative: 150 },
  ]

  return (
    <div className="container mx-auto p-4">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">Twitter Sentiment Analysis Dashboard</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tweets Analyzed</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,000</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sentiment Score</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.65</div>
            <p className="text-xs text-muted-foreground">+0.05 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Sentiment %</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#AI #Climate</div>
            <p className="text-xs text-muted-foreground">Top 2 trending topics</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Overall Sentiment Distribution</CardTitle>
            <CardDescription>Distribution of positive, neutral, and negative sentiments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Sentiment",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="var(--color-value)"
                    label
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sentiment by Day of Week</CardTitle>
            <CardDescription>Average sentiment scores for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Positive: {
                  label: "Positive",
                  color: "hsl(var(--chart-2))",
                },
                Neutral: {
                  label: "Neutral",
                  color: "hsl(var(--chart-3))",
                },
                Negative: {
                  label: "Negative",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentByDayData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Positive" stackId="a" fill="var(--color-Positive)" />
                  <Bar dataKey="Neutral" stackId="a" fill="var(--color-Neutral)" />
                  <Bar dataKey="Negative" stackId="a" fill="var(--color-Negative)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend Over Time</CardTitle>
            <CardDescription>Weekly sentiment trends for the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Positive: {
                  label: "Positive",
                  color: "hsl(var(--chart-5))",
                },
                Neutral: {
                  label: "Neutral",
                  color: "hsl(var(--chart-6))",
                },
                Negative: {
                  label: "Negative",
                  color: "hsl(var(--chart-7))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentTrendData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="Positive" stroke="var(--color-Positive)" strokeWidth={2} />
                  <Line type="monotone" dataKey="Neutral" stroke="var(--color-Neutral)" strokeWidth={2} />
                  <Line type="monotone" dataKey="Negative" stroke="var(--color-Negative)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sentiment by Topic</CardTitle>
            <CardDescription>Sentiment distribution across different topics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                Positive: {
                  label: "Positive",
                  color: "hsl(var(--chart-8))",
                },
                Neutral: {
                  label: "Neutral",
                  color: "hsl(var(--chart-9))",
                },
                Negative: {
                  label: "Negative",
                  color: "hsl(var(--chart-10))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart  data={topicSentimentData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Positive" stackId="a" fill="var(--color-Positive)" />
                  <Bar dataKey="Neutral" stackId="a" fill="var(--color-Neutral)" />
                  <Bar dataKey="Negative" stackId="a" fill="var(--color-Negative)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Tweets by Engagement</CardTitle>
            <CardDescription>Most engaging tweets and their sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  tweet: "Excited about the new AI breakthroughs! #AI #Innovation",
                  engagement: 1500,
                  sentiment: "Positive",
                },
                {
                  tweet: "Climate change is a pressing issue we need to address. #ClimateAction",
                  engagement: 1200,
                  sentiment: "Neutral",
                },
                {
                  tweet: "Disappointed by the latest policy changes. We need better leadership.",
                  engagement: 1000,
                  sentiment: "Negative",
                },
                {
                  tweet: "Just watched an amazing movie! Highly recommend it to everyone.",
                  engagement: 800,
                  sentiment: "Positive",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3/4 font-medium">{item.tweet}</div>
                  <div className="w-1/8 text-right">{item.engagement} engagements</div>
                  <div
                    className={cn(
                      "w-1/8 text-right",
                      item.sentiment === "Positive"
                        ? "text-green-600"
                        : item.sentiment === "Negative"
                        ? "text-red-600"
                        : "text-yellow-600"
                    )}
                  >
                    {item.sentiment}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}