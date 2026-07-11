import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="container-page pt-12 pb-6 text-center md:pt-16">
      <Reveal>
        {eyebrow && <span className="chip bg-brand-soft text-brand">{eyebrow}</span>}
        <h1 className="mt-4 font-display text-4xl font-extrabold text-ink sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
            {subtitle}
          </p>
        )}
        <div className="mx-auto mt-6 h-1.5 w-16 rounded-full bg-gradient-to-r from-brand to-[#ff7a95]" />
      </Reveal>
    </header>
  );
}
