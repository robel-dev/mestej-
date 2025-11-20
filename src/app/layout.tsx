import { Montserrat, Playfair_Display } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${montserrat.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <title>Mestej Winery - Premium Honey, Buckthorn & Blueberry Wines</title>
        <meta name="description" content="Crafting exceptional honey, buckthorn, and blueberry wines with tradition and care. Discover our premium collection of handcrafted meads and fruit wines." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
