"use server";
import { prisma } from "@/lib/db/prisma";
import {
  format,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  addDays,
  addWeeks,
  addMonths,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

export interface UsersAnalytics {
  date: string;
  usersCreatedCount: number;
  newsletterSubscribersCount: number;
}

export interface readAnalyticsUsersProps {
  data: UsersAnalytics[];
  totalUsers: number;
  totalNewsletterSubscribersCount: number;
  thisMonthUsersCount: number;
  lastMonthUsersCount: number;
  monthlyGrowthPercentage: number;
}

export async function readAnalyticsUsers(
  startDateParam?: Date,
  endDateParam?: Date
): Promise<readAnalyticsUsersProps> {
  const currentDate = new Date();
  const startDate = startDateParam || startOfYear(currentDate);
  const endDate = endDateParam || endOfYear(currentDate);

  const totalUsers = await prisma.user.count({
    where: { createdAt: { gte: startDate, lt: endDate } },
  });
  const totalNewsletterSubscribersCount = await prisma.user.count({
    where: { newsletter: true, createdAt: { gte: startDate, lt: endDate } },
  });

  const intervalFunction =
    differenceInDays(endDate, startDate) <= 1
      ? eachDayOfInterval
      : differenceInDays(endDate, startDate) <= 7
      ? eachWeekOfInterval
      : eachMonthOfInterval;
  const dateFormat =
    intervalFunction === eachDayOfInterval
      ? "yyyy-MM-dd"
      : intervalFunction === eachWeekOfInterval
      ? "yyyy-'W'Iso"
      : "yyyy-MM";

  const allIntervals = intervalFunction({ start: startDate, end: endDate });

  const analyticsData = await Promise.all(
    allIntervals.map(async (intervalStart) => {
      const intervalEnd =
        intervalFunction === eachDayOfInterval
          ? addDays(intervalStart, 1)
          : intervalFunction === eachWeekOfInterval
          ? addWeeks(intervalStart, 1)
          : addMonths(intervalStart, 1);

      const usersCreatedCount = await prisma.user.count({
        where: { createdAt: { gte: intervalStart, lt: intervalEnd } },
      });
      const newsletterSubscribersCount = await prisma.user.count({
        where: {
          newsletter: true,
          createdAt: { gte: intervalStart, lt: intervalEnd },
        },
      });

      return {
        date: format(intervalStart, dateFormat),
        usersCreatedCount,
        newsletterSubscribersCount,
      };
    })
  );

  // Calculer le nombre d'utilisateurs créés ce mois-ci et le mois dernier
  const thisMonthStart = startOfMonth(currentDate);
  const thisMonthEnd = endOfMonth(currentDate);
  const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
  const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));

  const thisMonthUsersCount = await prisma.user.count({
    where: { createdAt: { gte: thisMonthStart, lt: thisMonthEnd } },
  });
  const lastMonthUsersCount = await prisma.user.count({
    where: { createdAt: { gte: lastMonthStart, lt: lastMonthEnd } },
  });

  // Calcul du pourcentage de croissance
  const monthlyGrowthPercentage =
    lastMonthUsersCount === 0
      ? thisMonthUsersCount === 0
        ? 0
        : 100
      : ((thisMonthUsersCount - lastMonthUsersCount) / lastMonthUsersCount) *
        100;

  return {
    data: analyticsData,
    totalUsers,
    totalNewsletterSubscribersCount,
    thisMonthUsersCount,
    lastMonthUsersCount,
    monthlyGrowthPercentage,
  };
}

enum UserRole {
  admin = "admin",
  user = "user",
}
export async function sendCreateUser(formData: FormData): Promise<void> {
  const name = formData.get("username")?.toString();
  const email = formData.get("email")?.toString();
  let role: UserRole | undefined;
  const formRole = formData.get("role")?.toString();

  if (formRole && Object.values(UserRole).includes(formRole as UserRole)) {
    role = formRole as UserRole;
  } else {
    throw new Error(`Rôle invalide fourni: ${formRole}`);
  }

  await prisma.user.create({
    data: {
      name,
      email,
      image: null,
      role,
      emailVerified: null,
      newsletter: null,
    },
  });
}
