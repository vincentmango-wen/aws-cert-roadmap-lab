import { externalLinkList } from "@/config/externalLinks";

type ExternalLinksProps = {
  variant?: "footer" | "inline";
};

export function ExternalLinks({ variant = "footer" }: ExternalLinksProps) {
  const isFooter = variant === "footer";

  return (
    <nav aria-label="外部リンク" className={isFooter ? "space-y-3" : ""}>
      {isFooter ? (
        <ul className="space-y-2">
          {externalLinkList.map((link) => (
            <li key={link.key}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="group inline-flex flex-col text-sm text-slate-300 transition hover:text-white"
              >
                <span className="font-semibold underline-offset-4 group-hover:underline">
                  {link.label}
                </span>
                <span className="text-xs text-slate-400">{link.description}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {externalLinkList.map((link) => (
            <li key={link.key}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.ariaLabel}
                className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}