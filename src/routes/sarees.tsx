import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sarees")({
  head: () => ({
    meta: [
      { title: "Saree Collection — JIYA OS" },
      {
        name: "description",
        content: "Browse a simple saree collection opened by JIYA voice commands.",
      },
      { property: "og:title", content: "Saree Collection — JIYA OS" },
      { property: "og:description", content: "Browse saree styles from JIYA OS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SareesPage,
});

const sarees = [
  { name: "Gulabi Banarasi", detail: "Soft silk · Festive pink", tone: "bg-primary/15" },
  { name: "Kesar Chanderi", detail: "Light weave · Everyday elegance", tone: "bg-accent" },
  { name: "Neelam Organza", detail: "Sheer finish · Evening edit", tone: "bg-secondary" },
];

function SareesPage() {
  return (
    <main className="min-h-dvh bg-background px-5 py-6 text-foreground sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to JIYA
        </Link>
        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
              JIYA style desk
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Saree collection</h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A curated starting point for your next drape.
            </p>
          </div>
          <ShoppingBag className="hidden size-9 text-primary sm:block" />
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {sarees.map((saree) => (
            <article
              key={saree.name}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className={`flex aspect-[4/3] items-end p-5 ${saree.tone}`}>
                <span className="text-5xl" aria-hidden="true">
                  ✦
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-semibold">{saree.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{saree.detail}</p>
                <Button className="mt-5 w-full" size="sm">
                  Ask JIYA about this
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
