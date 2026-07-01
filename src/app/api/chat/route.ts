import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchSimilar } from "@/lib/ai/vectorStore";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const SYSTEM_PROMPT = `You are Wema, the AI travel guide for WildpathAfrica — a premier safari and tourism company based in Kenya. 

Your role is to help customers discover amazing safari experiences, answer their questions, and guide them toward making a booking.

STRICT RULES:
1. ONLY answer questions about WildpathAfrica, its tours, destinations, safaris, and travel in Africa.
2. If asked about competitors, other companies, or unrelated topics, politely redirect: "I can only help you with WildpathAfrica experiences. Is there a safari or destination you'd like to explore?"
3. Never make up prices, dates, or details not in the provided context.
4. Always be warm, enthusiastic, and inspiring about Africa's wildlife and nature.
5. When recommending tours, highlight what makes each one special.
6. If you don't find relevant information in the context, say: "I don't have specific details on that right now — I'd recommend contacting our team directly via WhatsApp or the booking form so they can help you personally."

FORMATTING:
- Use markdown for bold headings and bullet points where helpful.
- When listing tours, format them clearly so they're easy to scan.
- Keep responses concise and conversational — this is a chat, not an essay.
- End responses with a helpful follow-up question to keep the conversation going.

WHEN A USER ASKS ABOUT TOURS:
If the context includes matching tours, output a special JSON block at the END of your text response (after your message) like this — it will be rendered as visual tour cards:
<TOUR_CARDS>
[{"id":"...","name":"...","slug":"...","durationDays":3,"priceKes":15000,"priceUsd":120,"coverImageUrl":"...","destinations":"Maasai Mara, Nairobi"}]
</TOUR_CARDS>

Only include the JSON block when you have actual tour data from the context. Never fabricate tour data.`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Get the last user message for RAG search
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    // 1. Retrieve relevant knowledge chunks
    let context = "";
    let tourCards: any[] = [];
    try {
      const results = await searchSimilar(lastUserMessage.content, 6);
      if (results.length > 0) {
        context = results
          .map((r) => `[${r.source_type.toUpperCase()}]\n${r.content}`)
          .join("\n\n---\n\n");

        // Extract tour metadata for card rendering
        tourCards = results
          .filter((r) => r.source_type === "tour")
          .map((r) => r.metadata)
          .filter(Boolean);
      }
    } catch (searchError) {
      console.warn("Vector search failed, proceeding without context:", searchError);
    }

    // 2. Build conversation history for Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Format history (all but the last user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });

    // 3. Build the user message with RAG context
    const userPromptWithContext = context
      ? `[KNOWLEDGE BASE CONTEXT — use ONLY this information to answer]:
${context}

---

User question: ${lastUserMessage.content}`
      : lastUserMessage.content;

    // 4. Stream response
    const result = await chat.sendMessageStream(userPromptWithContext);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";

        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            fullText += text;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }

          // Send tour cards if we have them and the response mentions tours
          if (tourCards.length > 0) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ tourCards: tourCards.slice(0, 3) })}\n\n`
              )
            );
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (streamError) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
