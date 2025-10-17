export type TocEntry = {
  title: string;
  url: string;
  items?: TocEntry[];
};

interface TableOfContentsProps {
  items?: TocEntry[];
  className?: string;
  title: string;
  ariaLabel: string;
}

export function TableOfContents({ items, className = "", title, ariaLabel }: TableOfContentsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={`flex flex-col gap-3 rounded-3xl border border-[#eadfcd]/70 bg-white/80 p-5 text-sm text-[#4b4139] shadow-[0_20px_60px_-32px_rgba(40,30,20,0.35)] ${className}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#7c6d5d]">{title}</p>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.url}>
            <TocAnchor item={item} depth={1} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TocAnchor({ item, depth }: { item: TocEntry; depth: number }) {
  return (
    <div className="flex flex-col gap-2">
      <a
        href={item.url}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium leading-snug transition-colors hover:bg-[#f4eadb] hover:text-[#2f2b26] ${
          depth === 1 ? "text-[#2f2b26]" : "pl-4 text-[#5f564d]"
        }`}
      >
        <span aria-hidden className="text-[#f2993f]">{depth === 1 ? "•" : "–"}</span>
        <span className="text-[clamp(0.95rem,2.8vw,1rem)]">{item.title}</span>
      </a>
      {item.items && item.items.length > 0 && (
        <ul className="ml-4 flex flex-col gap-2">
          {item.items.map((child) => (
            <li key={child.url}>
              <TocAnchor item={child} depth={depth + 1} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
