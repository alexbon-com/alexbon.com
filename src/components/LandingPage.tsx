import type { ReactElement, ReactNode, SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { LicenseBlock } from "@/components/blog/LicenseBlock";
import type { DetailIconKey, LandingContent } from "@/content";

type LandingPageProps = {
  content: LandingContent;
};

const container = "mx-auto w-[90%] max-w-6xl px-4 sm:px-6";

type SectionProps = {
  children: ReactNode;
  background?: string;
  className?: string;
  id?: string;
};

function Section({ children, background = "bg-transparent", className = "", id }: SectionProps) {
  return (
    <section id={id} className={`${background} py-6 sm:py-8`}>
      <div
        className={`${container} flex flex-col gap-4 motion-safe:animate-[section-fade-in_0.8s_ease-out] ${className}`}
      >
        {children}
      </div>
    </section>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

function IconVideo({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x={4} y={5} width={12} height={14} rx={2} />
      <path d="m16 9 4-2v10l-4-2" />
    </svg>
  );
}

function IconDonate({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 21s-5.5-3.6-7.5-6.4c-1.7-2.5-.9-6.1 1.7-7.6 1.7-1 3.9-.6 5.3.8 1.4-1.4 3.6-1.8 5.3-.8 2.6 1.5 3.4 5.1 1.7 7.6C17.5 17.4 12 21 12 21Z" />
    </svg>
  );
}

function IconLock({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x={4} y={10} width={16} height={10} rx={2} />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx={12} cy={15} r={1.5} />
    </svg>
  );
}

function IconStar({ className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.5}
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2.3 14.36 7.1l5.22.76-3.78 3.68.89 5.2L12 14.9l-4.69 2.84.89-5.2L4.42 7.86l5.22-.76L12 2.3Z" />
    </svg>
  );
}

const detailIcons: Record<DetailIconKey, (props: IconProps) => ReactElement> = {
  video: IconVideo,
  donate: IconDonate,
  lock: IconLock,
};

export function LandingPage({ content }: LandingPageProps) {
  const lang = content.locale === "ua" ? "uk" : content.locale === "en" ? "en" : "ru";
  return (
    <div lang={lang} className="relative min-h-screen overflow-hidden text-strong bg-surface">
      <div className="relative z-20">
        <Navbar
          activeLocale={content.locale}
          brandName={content.brandName}
          tagline={content.tagline}
        />
      </div>

      <main className="relative z-10 flex flex-col gap-6 pb-12 pt-6 sm:gap-8 sm:pt-8">
        <Section
          className="relative isolate overflow-hidden rounded-[2.5rem] section-card border border-soft px-6 py-10 text-center shadow-card sm:px-10"
        >
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex flex-col gap-5 text-center text-[clamp(1.125rem,3vw,1.45rem)] leading-relaxed text-primary md:max-w-4xl">
              {content.hero.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div
              className="mx-auto h-px w-20 rounded-full bg-gradient-to-r from-transparent via-[#e7b57f] to-transparent md:mx-0"
              aria-hidden
            />
          </div>
        </Section>

        <Section
          id="about"
          className="relative isolate gap-8 overflow-hidden rounded-[2.25rem] border border-soft section-card px-6 py-10 text-left shadow-card backdrop-blur-sm lg:flex-row lg:items-center sm:px-10"
        >
          <div className="relative z-10 flex flex-1 flex-col gap-6 text-base leading-relaxed text-primary sm:text-lg">
            <div className="flex flex-col gap-3">
              <span className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted">
                {content.introduction.heading}
              </span>
              <span
                className="h-px w-16 rounded-full bg-gradient-to-r from-[#d7b48c] via-[#f5d7a4] to-transparent"
                aria-hidden
              />
            </div>
            {content.introduction.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {content.introduction.highlight && (
              <>
                <span
                  className="my-1 h-px w-16 rounded-full bg-gradient-to-r from-transparent via-[#d7b48c] to-transparent"
                  aria-hidden
                />
                <div className="flex flex-col gap-4">
                  <p className="text-lg font-semibold text-strong">
                    {content.introduction.highlight.title}
                  </p>
                  {content.introduction.highlight.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="relative z-10 flex flex-1 justify-center">
            <div className="section-card-strong overflow-hidden rounded-[2rem] border border-soft shadow-card">
              <Image
                src={content.introduction.image}
                alt={content.introduction.imageAlt}
                width={900}
                height={1350}
                className="h-full w-full object-cover object-center motion-safe:animate-[float_11s_ease-in-out_infinite]"
                priority
              />
            </div>
          </div>
        </Section>

        <Section
          className="section-card rounded-[2.25rem] border border-soft px-6 py-10 shadow-card backdrop-blur-sm sm:px-10"
        >
          <div className="flex flex-col gap-4">
            <span className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {content.process.heading}
            </span>
            <p className="text-base leading-relaxed text-primary sm:text-lg">
              {content.process.intro}
            </p>
          </div>
          <ol className="grid gap-6 lg:grid-cols-2">
            {content.process.steps.map((step, index) => (
              <li
                key={step.title}
                className="group blog-card relative overflow-hidden rounded-[2rem] border border-soft p-6 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative z-10 flex flex-col gap-4">
                  <span className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xl font-semibold text-strong">{step.title}</p>
                  <div className="flex flex-col gap-3 text-base text-primary">
                    {step.description.split("\n\n").map((paragraph, idx) => {
                      const match = paragraph.match(/^\*\*(.+?)\*\*\s*(.*)$/);
                      if (!match) {
                        return <p key={idx}>{paragraph}</p>;
                      }
                      const [, lead, rest] = match;
                      return (
                        <p key={idx}>
                          <strong>{lead}</strong>
                          {rest ? ` ${rest.trim()}` : null}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section
          className="section-card rounded-[2.25rem] border border-soft px-6 py-10 shadow-card backdrop-blur-sm sm:px-10"
        >
          <div className="flex flex-col gap-4">
            <span className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {content.details.heading}
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.details.items.map((item) => {
              const Icon = detailIcons[item.icon];
              return (
                <article
                  key={item.title}
                  className="group blog-card relative flex h-full flex-col gap-4 overflow-hidden rounded-[2rem] border border-soft p-6 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative z-10 flex flex-col gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f6d7ad] to-[#f1bd78] text-muted shadow-[0_10px_25px_-12px_rgba(110,86,60,0.6)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-xl font-semibold text-strong">{item.title}</h3>
                    <p className="text-base text-primary">{item.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </Section>

        <Section
          className="section-card rounded-[2.25rem] border border-soft px-6 py-10 shadow-card backdrop-blur-sm sm:px-10"
        >
          <div className="flex flex-col gap-4">
            <span className="badge-soft inline-flex w-fit items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              {content.faq.heading}
            </span>
          </div>
          <div className="flex flex-col gap-6">
            {content.faq.items.map((item) => (
              <div
                key={item.question}
                className="blog-card relative overflow-hidden rounded-[2rem] border border-soft p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#f2c48f] via-[#f6dcb9] to-transparent"
                  aria-hidden
                />
                <p className="text-lg font-semibold text-strong">{item.question}</p>
                <p className="mt-3 text-base text-primary">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="items-center">
          <div className="section-card-strong relative isolate flex w-full max-w-3xl flex-col items-center gap-6 overflow-hidden rounded-[2.75rem] border border-soft px-6 py-10 text-center shadow-card sm:px-10">
            <h2 className="relative z-10 text-[clamp(2rem,5vw,2.75rem)] font-semibold text-strong">
              {content.invitation.heading}
            </h2>
            <p className="relative z-10 max-w-2xl text-base leading-relaxed text-primary sm:text-lg">
              {content.invitation.body}
            </p>
            <div className="relative z-10 flex flex-wrap justify-center gap-3">
              {content.invitation.buttons.map((button) => (
                <Link
                  key={button.href}
                  href={button.href}
                  target="_blank"
                  rel="noreferrer"
                  className="button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  {button.label}
                </Link>
              ))}
            </div>
          </div>
        </Section>

        <Section
          className="section-card rounded-[2.25rem] border border-soft px-6 py-10 shadow-card backdrop-blur-sm sm:px-10"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold text-strong">
              {content.testimonials.heading}
            </h2>
            <span
              className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-[rgba(240,186,121,0.5)] to-transparent md:block"
              aria-hidden
            />
          </div>
          {content.testimonials.intro ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-primary sm:text-lg">
              {content.testimonials.intro}
            </p>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2">
            {content.testimonials.items.map((testimonial, index) => (
              <article
                key={`${index}-${testimonial.slice(0, 16)}`}
                className="group blog-card relative flex h-full flex-col gap-4 overflow-hidden rounded-[2rem] border border-soft p-6 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f4bd7b] via-[#f7d7a8] to-[#f4bd7b]"
                  aria-hidden
                />
                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-[#e09b42]" aria-hidden>
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <IconStar key={`testimonial-${index}-star-${starIndex}`} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-primary">{testimonial}</p>
                </div>
              </article>
            ))}
            {content.testimonials.cta ? (
              <article className="group blog-card relative flex h-full flex-col gap-4 overflow-hidden rounded-[2rem] border border-soft p-6 transition-all duration-300 hover:-translate-y-1.5">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#f4bd7b] via-[#f7d7a8] to-[#f4bd7b]"
                  aria-hidden
                />
                <div className="relative z-10 flex h-full flex-col gap-4">
                  <p className="text-base leading-relaxed text-primary">{content.testimonials.cta.text}</p>
                  <Link
                    href={content.testimonials.cta.button.href}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 md:w-auto"
                  >
                    {content.testimonials.cta.button.label}
                  </Link>
                </div>
              </article>
            ) : null}
          </div>
        </Section>

        <Section className="section-card rounded-[2.25rem] border border-soft px-6 py-10 shadow-card backdrop-blur-sm sm:px-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
              <h2 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold text-strong">{content.story.heading}</h2>
              <span
                className="h-px w-24 rounded-full bg-gradient-to-r from-transparent via-[rgba(240,186,121,0.5)] to-transparent"
                aria-hidden
              />
            </div>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-start">
              <div className="grid gap-5">
                {content.story.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="blog-card rounded-[1.75rem] border border-soft bg-surface p-6 text-base leading-relaxed text-primary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-soft bg-surface/60 shadow-card">
                <Image
                  src={content.story.image}
                  alt={content.story.imageAlt}
                  width={960}
                  height={1280}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 420px, 80vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </Section>

        <Section className="items-center">
          <div className="section-card w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-soft px-6 py-6 text-center shadow-card">
            <p className="relative z-10 text-base leading-relaxed text-primary sm:text-lg">
              {content.footerNote}
            </p>
          </div>
        </Section>

        <Section className="items-center">
          <LicenseBlock className="max-w-3xl" />
        </Section>
      </main>
    </div>
  );
}
