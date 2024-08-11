//this is the implementation using llama3 with groq, altho i wanna try gemini pro because it's free and may be really good
import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import "dotenv/config";

// also for teammates: to use this, you gotta go to https://console.groq.com/keys and create a key (maybe might have to make an account too) but that's for this llm because it's free
// also add that api key to a private local file .env (im assuming you guys already know this but im adding it for my sake for documentation)

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
  const userMessages = await req.json(); 

  const conversationHistory = [
    {
      role: "system",
      content: "You are a chatbot that assists customers with summer vacation.",
    },
    ...userMessages,
  ];

  const completion = await groq.chat.completions.create({
    messages: conversationHistory,
    model: "llama3-8b-8192",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close;
      }
    },
  });
  
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
