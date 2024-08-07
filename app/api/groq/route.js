//this is the implementation using llama3 with groq, altho i wanna try gemini pro because it's free and may be really good
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import "dotenv/config";

// also for teammates: to use this, you gotta go to https://console.groq.com/keys and create a key (maybe might have to make an account too) but that's for this llm because it's free

{
  /* so for the purpose of documentation and all we'll have our request json be formatted in this way (from other pages to this):
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            whatever we want in body, can have multiple different keys so it's fine
        }
    }
    
    */
}

// we can edit this as we figure out what type of chatbot we're making exactly
export async function POST(req) {
  console.log("groq llama POST");

  const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });
  const data = await req.json();
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a chatbot that assists customers for a certain company.",
      },
      {
        role: "user",
        content:
          "Hi I need help with a certain aspect of your company's services.",
      },
    ],
    model: "llama3-8b-8192",
  });

  return NextResponse.json({ message: completion.choices[0].message.content });
}
