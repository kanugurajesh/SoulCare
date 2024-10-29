"use server"

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [],
});

export async function POST(request: NextRequest) {
  const response = await request.json();
  const user = await currentUser();

  const emailAddress = user?.emailAddresses[0].emailAddress;

  const { message } = response;

  // Use a CBT-based prompt to guide the model's response in a therapeutic way
  const prompt = `You're a CBT therapist. Respond to the user's message in a way that encourages self-reflection, challenges unhelpful thoughts, and promotes positive thinking. Here is the message from the user: "${message}"`;

  const result = await chat.sendMessage(prompt);

  const res = await fetch("http://localhost:8000/sentiment/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: message,
      gmail: emailAddress,
    }),
  });

  return NextResponse.json({ result: result.response.text() });
}
