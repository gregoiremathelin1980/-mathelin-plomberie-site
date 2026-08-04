import type { ReactNode } from "react";

export default function LegalPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-16">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <h1 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-10 text-sm leading-relaxed text-gray-800 sm:px-6 sm:text-base [&_h2]:font-heading [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:first:mt-0 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_a]:font-medium [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline [&_p+p]:mt-3">
        {children}
      </article>
    </div>
  );
}
