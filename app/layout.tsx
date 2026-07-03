import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ApprenticeLog", template: "%s · ApprenticeLog" },
  description: "The digital logbook trade apprentices actually deserve. Log hours, track skill sign-offs, and generate compliance reports — replacing paper books that go missing.",
  keywords: ["trade apprentice", "apprenticeship logbook", "electrician apprentice", "skill sign-off", "compliance report"],
  openGraph: {
    title: "ApprenticeLog — Trade Apprenticeship Logbook",
    description: "Replacing 40 years of paper logbooks with something that actually works.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
