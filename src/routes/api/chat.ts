import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { JIYA_SYSTEM_PROMPT } from "@/lib/jiya-prompt";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "AI is not configured (missing LOVABLE_API_KEY)." },
            { status: 500 },
          );
        }

        let body: { messages?: unknown };
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid request body." }, { status: 400 });
        }

        if (!Array.isArray(body.messages)) {
          return Response.json({ error: "messages must be an array." }, { status: 400 });
        }

        const gateway = createLovableAiGatewayProvider(apiKey);

        try {
          const result = streamText({
            model: gateway("google/gemini-3.7-flash"),
            system: JIYA_SYSTEM_PROMPT,
            messages: await convertToModelMessages(body.messages as never[]),
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          console.error("JIYA chat error:", error);
          const message =
            error instanceof Error ? error.message : "AI request failed.";
          return Response.json({ error: message }, { status: 502 });
        }
      },
    },
  },
});
