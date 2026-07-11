"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Star,
  Sparkles,
} from "lucide-react";

/* ------------------------------ scales ------------------------------ */

type Scale = { v: number; e: string; l: string };

const FOOD_SCALE: Scale[] = [
  { v: 1, e: "😞", l: "Poor" },
  { v: 2, e: "😐", l: "Okay" },
  { v: 3, e: "🙂", l: "Good" },
  { v: 4, e: "😋", l: "Great" },
  { v: 5, e: "😍", l: "Amazing" },
];

const VIBE_SCALE: Scale[] = [
  { v: 1, e: "😕", l: "Meh" },
  { v: 2, e: "🙂", l: "Okay" },
  { v: 3, e: "😊", l: "Nice" },
  { v: 4, e: "🤩", l: "Lovely" },
  { v: 5, e: "🥰", l: "Loved it" },
];

const SERVICE_SCALE: Scale[] = [
  { v: 1, e: "😟", l: "Slow" },
  { v: 2, e: "😐", l: "Okay" },
  { v: 3, e: "🙂", l: "Good" },
  { v: 4, e: "😄", l: "Friendly" },
  { v: 5, e: "🌟", l: "Excellent" },
];

/* ------------------------- review generation ------------------------ */

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

function tier(n: number | null): 5 | 4 | 3 | 2 | 1 {
  if (!n) return 4;
  return Math.min(5, Math.max(1, n)) as 5 | 4 | 3 | 2 | 1;
}

const OPENERS: Record<number, string[]> = {
  5: [
    "Absolutely loved my visit to Snow Spoon!",
    "Snow Spoon never disappoints —",
    "Had the most wonderful time at Snow Spoon.",
    "One of my favourite spots in Puttur!",
  ],
  4: [
    "Really enjoyed my visit to Snow Spoon.",
    "Snow Spoon was a lovely treat.",
    "Had a great time at Snow Spoon.",
  ],
  3: ["Decent experience at Snow Spoon.", "Snow Spoon was pretty good overall."],
  2: ["My visit to Snow Spoon was just okay.", "A bit of a mixed experience at Snow Spoon."],
  1: ["Unfortunately my visit to Snow Spoon fell short this time."],
};

const FOOD_PHRASE: Record<number, string[]> = {
  5: ["it was absolutely delicious", "every bite was fantastic", "it was honestly so good"],
  4: ["it was really tasty", "I really enjoyed it", "it hit the spot"],
  3: ["it was decent", "it was pretty good", "it was fine"],
  2: ["it was just okay for me", "it was a bit average"],
  1: ["it wasn't quite for me", "it missed the mark a little"],
};

const AMBIANCE: Record<number, string[]> = {
  5: ["The ambiance was warm and inviting.", "Loved the cosy, cheerful vibe."],
  4: ["Nice, comfortable atmosphere.", "The place had a pleasant vibe."],
  3: ["The ambiance was alright.", "The setting was okay."],
  2: ["The ambiance could be a little better.", "The vibe was so-so."],
  1: ["The ambiance wasn't great.", ""],
};

const SERVICE: Record<number, string[]> = {
  5: ["The staff were super friendly and attentive.", "Service was quick and really warm."],
  4: ["Service was good and welcoming.", "The team was helpful."],
  3: ["Service was alright.", "The staff were okay."],
  2: ["Service was a bit slow.", "Service could improve."],
  1: ["Service really needs improvement.", ""],
};

const CLOSERS: Record<number, string[]> = {
  5: ["Highly recommend — will definitely be back! 🍨", "Can't wait to visit again!", "A must-visit in Puttur!"],
  4: ["Would happily recommend and come again.", "Worth a visit!", "Will be back soon."],
  3: ["Might come back to try more.", "Worth a try."],
  2: ["Hoping for a better experience next time.", ""],
  1: ["Hoping it improves on my next visit.", ""],
};

function buildReview(opts: {
  items: string[];
  food: number | null;
  ambiance: number | null;
  service: number | null;
  overall: number | null;
}): string {
  const { items, food, ambiance, service, overall } = opts;
  const parts: string[] = [];

  parts.push(pick(OPENERS[tier(overall)]));

  if (items.length > 0) {
    const list =
      items.length === 1
        ? items[0]
        : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
    parts.push(`I had the ${list} — ${pick(FOOD_PHRASE[tier(food)])}.`);
  } else {
    parts.push(`The food — ${pick(FOOD_PHRASE[tier(food)])}.`);
  }

  const amb = pick(AMBIANCE[tier(ambiance)]);
  if (amb) parts.push(amb);
  const svc = pick(SERVICE[tier(service)]);
  if (svc) parts.push(svc);

  const close = pick(CLOSERS[tier(overall)]);
  if (close) parts.push(close);

  // Join, then tidy the "— it was ..." fragments into one flowing line.
  return parts.join(" ").replace(/\s+/g, " ").replace(" . ", ". ").trim();
}

/* ------------------------------ component --------------------------- */

const TOTAL_STEPS = 5; // items, food, ambiance, service, overall

export function ReviewBuilder({
  menuItems,
  reviewUrl,
}: {
  menuItems: string[];
  reviewUrl: string;
}) {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [food, setFood] = useState<number | null>(null);
  const [ambiance, setAmbiance] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [overall, setOverall] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [copied, setCopied] = useState(false);

  const done = step >= TOTAL_STEPS;

  const suggestedOverall = useMemo(() => {
    const vals = [food, ambiance, service].filter((v): v is number => v != null);
    if (vals.length === 0) return null;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [food, ambiance, service]);

  function generate(current = { items, food, ambiance, service, overall: overall ?? suggestedOverall }) {
    setReview(buildReview(current));
    setCopied(false);
  }

  function next() {
    if (step === TOTAL_STEPS - 1) {
      const finalOverall = overall ?? suggestedOverall;
      setOverall(finalOverall);
      generate({ items, food, ambiance, service, overall: finalOverall });
    }
    setStep((s) => s + 1);
  }
  const back = () => setStep((s) => Math.max(0, s - 1));

  async function copy() {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — user can still select the text manually */
    }
  }

  function toggleItem(name: string) {
    setItems((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  }

  return (
    <div className="card mx-auto max-w-2xl rounded-[2rem] p-6 sm:p-8">
      {/* progress */}
      {!done && (
        <div className="mb-7 flex items-center gap-2" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-brand" : "bg-cloud"
              }`}
            />
          ))}
        </div>
      )}

      <div>
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 0 && (
              <Question title="What did you order?" hint="Pick everything you tried (optional).">
                <div className="flex flex-wrap gap-2">
                  {menuItems.map((name) => {
                    const active = items.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleItem(name)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                          active
                            ? "border-brand bg-brand text-white shadow-glow"
                            : "border-line bg-white text-ink-soft hover:border-brand-tint hover:text-brand"
                        }`}
                      >
                        {active && <Check className="mr-1 inline size-3.5" />}
                        {name}
                      </button>
                    );
                  })}
                </div>
              </Question>
            )}

            {step === 1 && (
              <Question title="How was the food?" hint="Tap the emoji that fits.">
                <EmojiRating scale={FOOD_SCALE} value={food} onChange={setFood} />
              </Question>
            )}

            {step === 2 && (
              <Question title="How was the ambiance & vibe?">
                <EmojiRating scale={VIBE_SCALE} value={ambiance} onChange={setAmbiance} />
              </Question>
            )}

            {step === 3 && (
              <Question title="How was the service?">
                <EmojiRating scale={SERVICE_SCALE} value={service} onChange={setService} />
              </Question>
            )}

            {step === 4 && (
              <Question title="Your overall rating?" hint="This sets the star rating you'll give.">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const filled = (overall ?? suggestedOverall ?? 0) >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setOverall(n)}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`size-10 ${
                            filled ? "fill-amber-400 text-amber-400" : "text-line"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </Question>
            )}

            {/* nav */}
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="btn btn-ghost px-4 py-2.5 text-sm disabled:opacity-0"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button type="button" onClick={next} className="btn btn-primary px-6 py-2.5 text-sm">
                {step === TOTAL_STEPS - 1 ? "Create my review" : "Next"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="result-panel"
          >
            <div className="text-center">
              <span className="chip bg-brand-soft text-brand">
                <Sparkles className="size-3.5" /> Your review is ready
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-ink">Almost done! 🎉</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">
                Here's a draft from your answers. Tweak it to sound like you, copy it, then post it on
                Google.
              </p>
            </div>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
              className="mt-5 w-full resize-none rounded-2xl border border-line bg-cloud/40 p-4 text-sm leading-relaxed text-ink outline-none focus:border-brand-tint focus:bg-white"
              aria-label="Your review text"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="btn btn-primary flex-1 px-5 py-3 text-sm">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Copied!" : "Copy review"}
              </button>
              <button
                type="button"
                onClick={() => generate()}
                className="btn btn-ghost px-4 py-3 text-sm"
                title="Reword it"
              >
                <RefreshCw className="size-4" /> Shuffle wording
              </button>
            </div>

            {/* step-by-step */}
            <ol className="mt-6 space-y-2 rounded-2xl bg-cloud/50 p-4 text-sm text-ink-soft">
              <li>
                <span className="font-semibold text-ink">1.</span> Copy your review ☝️
              </li>
              <li>
                <span className="font-semibold text-ink">2.</span> Tap the button below to open Google
              </li>
              <li>
                <span className="font-semibold text-ink">3.</span> Paste it, pick your stars & post 💫
              </li>
            </ol>

            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-4 w-full px-5 py-3.5 text-base"
            >
              <ExternalLink className="size-5" /> Post on Google Reviews
            </a>

            <button
              type="button"
              onClick={() => setStep(0)}
              className="mt-3 block w-full text-center text-xs font-semibold text-muted hover:text-brand"
            >
              Start over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------- sub-components ------------------------- */

function Question({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function EmojiRating({
  scale,
  value,
  onChange,
}: {
  scale: Scale[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex justify-between gap-1.5 sm:gap-2">
      {scale.map((s) => {
        const active = value === s.v;
        return (
          <button
            key={s.v}
            type="button"
            onClick={() => onChange(s.v)}
            className={`flex flex-1 flex-col items-center gap-1.5 rounded-2xl border py-3 transition-all ${
              active
                ? "border-brand bg-brand-soft"
                : "border-line bg-white hover:border-brand-tint hover:bg-cloud/50"
            }`}
          >
            <motion.span
              className="text-2xl sm:text-3xl"
              animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              {s.e}
            </motion.span>
            <span className={`text-[0.7rem] font-semibold ${active ? "text-brand" : "text-muted"}`}>
              {s.l}
            </span>
          </button>
        );
      })}
    </div>
  );
}
