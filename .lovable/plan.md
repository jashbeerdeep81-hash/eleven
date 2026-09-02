# JIYA OS V7 implementation plan

## User-facing outcome
Build a reliable free-first voice command console for Jashbeer with visible listening state, direct browser actions, local + Cloud memory, a weather/saree forecast, dream mode, and a single “Sab Kuch Kar De” report flow.

## Steps
1. Replace the fragile home route with a typed command engine that supports Hindi/Hinglish aliases, manual text fallback, Web Speech recognition, Web Speech female-voice preference, and safe action feedback.
2. Wire `jaan_memory` persistence for every message and useful command/event records, with localStorage fallback when the backend is unavailable.
3. Use the existing free-data route for weather and add a forecast response that combines the latest local saree order/search activity with an explicitly labeled heuristic prediction.
4. Add dream mode based on the local clock, with a soft voice setting and a user-visible toggle; do not claim background/night activity when the page is closed.
5. Add the “JIYA, SAB KUCH KAR DE” flow: open the saree view, highlight the leading product, read orders/memory/weather/battery, and request camera permission only with clear visible status (no silent photo capture).
6. Validate routes, browser rendering, mic/manual command flows, persistence error handling, and responsive layout.

## Technical details
- Keep the existing TanStack Start routes and Lovable Cloud client.
- No paid AI gateway, API keys, or external TTS dependency; use browser Web Speech APIs and the existing free-data HTTP endpoint.
- Keep user-initiated browser actions within browser permissions; camera and location failures are surfaced honestly.
