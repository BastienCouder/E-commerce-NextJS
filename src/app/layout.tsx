import "@/styles/globals.css";
import { AnimationProvider } from "@/context/AnimationContext";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { getDictionary } from "@/app/lang/dictionaries";
import { getCart } from "@/lib/db/cart";
import NavBar from "./(pages)/Navbar/NavBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
  params: { lang },
  context,
}: {
  params: {
    lang: string;
  };
  children: React.ReactNode;
  context: any;
}) {
  const dict = await getDictionary(lang);
  const cart = await getCart();
  // const auto = await aggregateAndCleanUpVisits();
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="fr" className={`${inter.variable}`}>
        <body
          className={cn("min-h-screen bg-background font-sans antialiased")}
        >
          <AnimationProvider>
            <NavBar dict={dict} cart={cart} />
            <main>{children}</main>
            {/* <CookieBanner /> */}
          </AnimationProvider>

          <Toaster expand={false} position="bottom-left" />
        </body>
      </html>
    </SessionProvider>
  );
}
