import "./globals.css";

export const metadata = {
  title: "KDP Listing Kit",
  description: "KDP keywords, descriptions & titles in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
