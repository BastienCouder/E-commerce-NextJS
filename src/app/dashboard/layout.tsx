import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviders } from "@/context/ThemeContext";
import { MainNav } from "@/components/dashboard/MainNav";
import Loading from "@/app/loading";
import { utils } from "@/lib/data/infosWebsite";
import { auth } from "@/auth";
import { currentRole } from "@/lib/auth";

export const metadata = {
  title: "Dashboard",
  description: "Ceci est le dashboard de mon application.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await currentRole();
  if (!admin) {
    throw new Error("unauthorized");
  }

  return (
    <>
      <ThemeProviders>
        <div className={`hidden flex md:flex`}>
          <div className="w-[12rem] border-r border-[rgba(var(--foreground),0.5)]">
            <MainNav />
          </div>
          <Suspense fallback={<Loading />}>
            <div className="h-full w-full mt-4 pb-10 px-4">
              <div className="flex flex-col gap-y-3">
                {/* <CurrentPageIndicator /> */}
                {children}
              </div>
            </div>
          </Suspense>
          <Toaster />
        </div>
      </ThemeProviders>
    </>
  );
}
