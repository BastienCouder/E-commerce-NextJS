"use server";
import { prisma } from "@/lib/prisma";
import { VisitorInfo } from "@/schemas/DbSchema";
import { utils } from "../../data/infosWebsite";
import { auth } from "@/auth";

export type VisitorInfoProps = VisitorInfo & {
  ///
};
export async function getVisitorInfo(): Promise<VisitorInfoProps[] | null> {
  const session = await auth();

  if (session && session.user.role === `${utils.protected}`) {
    try {
      const visitorInfo = await prisma.visitorInfo.findMany();

      return visitorInfo;
    } catch (error: any) {
      throw new Error(`Error while retrieving users: ${error.message}`);
    }
  } else {
    throw new Error("Error: Unauthorized user");
  }
}
