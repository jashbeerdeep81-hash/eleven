import { createFileRoute } from "@tanstack/react-router";

const MAX_QUERY_LENGTH = 180;

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "public, max-age=120" },
  });
}

export const Route = createFileRoute("/api/free-data")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const type = params.get("type") ?? "search";
        const query = (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);

        if (!query && type !== "news") {
          return json({ error: "A query is required." }, 400);
        }

        try {
          if (type === "weather") {
            const response = await fetch(`https://wttr.in/${encodeURIComponent(query)}?format=j1`, {
              headers: { "User-Agent": "JIYA OS free data" },
            });
            if (!response.ok) return json({ error: "Weather service unavailable." }, 502);
            const data = (await response.json()) as {
              current_condition?: Array<{
                temp_C?: string;
                FeelsLikeC?: string;
                humidity?: string;
                weatherDesc?: Array<{ value?: string }>;
              }>;
            };
            const current = data.current_condition?.[0];
            return json({
              kind: "weather",
              city: query,
              temperature: current?.temp_C ?? "—",
              feelsLike: current?.FeelsLikeC ?? "—",
              humidity: current?.humidity ?? "—",
              description: current?.weatherDesc?.[0]?.value ?? "Weather available hai.",
            });
          }

          if (type === "translate") {
            const response = await fetch(
              `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=hi|en`,
            );
            if (!response.ok) return json({ error: "Translation service unavailable." }, 502);
            const data = (await response.json()) as {
              responseData?: { translatedText?: string };
            };
            return json({
              kind: "translate",
              original: query,
              translated: data.responseData?.translatedText ?? "Translation nahi mili.",
            });
          }

          if (type === "news") {
            const response = await fetch("https://news.google.com/rss?hl=hi&gl=IN&ceid=IN:hi", {
              headers: { "User-Agent": "JIYA OS free data" },
            });
            if (!response.ok) return json({ error: "News service unavailable." }, 502);
            const xml = await response.text();
            const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
              .slice(0, 5)
              .map((match) => {
                const title = match[1]?.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
                const link = match[1]?.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
                return {
                  title: title.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
                  link: link.trim(),
                };
              })
              .filter((item) => item.title);
            return json({ kind: "news", items });
          }

          const response = await fetch(
            `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
          );
          if (!response.ok) return json({ error: "Search service unavailable." }, 502);
          const data = (await response.json()) as {
            AbstractText?: string;
            AbstractURL?: string;
            Heading?: string;
            RelatedTopics?: Array<{ Text?: string; FirstURL?: string }>;
          };
          return json({
            kind: "search",
            heading: data.Heading || query,
            abstract: data.AbstractText || "",
            url: data.AbstractURL || "",
            related: (data.RelatedTopics ?? [])
              .filter((item) => item.Text && item.FirstURL)
              .slice(0, 4)
              .map((item) => ({ text: item.Text, url: item.FirstURL })),
          });
        } catch (error) {
          console.error("JIYA free data error:", error);
          return json({ error: "Free data service se abhi response nahi aa raha." }, 502);
        }
      },
    },
  },
});
