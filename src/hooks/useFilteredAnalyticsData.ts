"use client";
import { useState, useEffect } from "react";
import { addWeeks, addMonths, addDays } from "date-fns";

export function useFilteredAnalyticsData<T>(
  fetchData: (startDate: Date, endDate: Date) => Promise<T>,
  initialTimeRange: string | { from: Date; to: Date },
  defaultValue: T
): [
  T,
  string | { from: Date; to: Date },
  (timeRange: string | { from: Date; to: Date }) => void,
  { value: string; label: string }[]
] {
  const options = [
    { value: "week", label: "Cette semaine" },
    { value: "2weeks", label: "2 semaines" },
    { value: "month", label: "Ce mois" },
    { value: "3months", label: "3 Mois" },
    { value: "6months", label: "6 Mois" },
    { value: "12months", label: "12 Mois" },
  ];
  const [timeRange, setTimeRange] = useState<string | { from: Date; to: Date }>(
    initialTimeRange
  );
  const [filteredData, setFilteredData] = useState<T>(defaultValue);

  useEffect(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    if (typeof timeRange === "string") {
      switch (timeRange) {
        case "week":
          startDate = addDays(now, -6);
          break;
        case "2weeks":
          startDate = addDays(now, -14);
          break;
        case "month":
          startDate = addWeeks(now, -3);
          break;
        case "3months":
          startDate = addMonths(now, -2);
          break;
        case "6months":
          startDate = addMonths(now, -5);
          break;
        case "12months":
          startDate = addMonths(now, -11);
          break;
        default:
          startDate = addWeeks(now, -1);
      }
    } else {
      startDate = timeRange.from;
      endDate = timeRange.to;
    }

    fetchData(startDate, endDate)
      .then((response) => {
        setFilteredData(response);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, [timeRange, fetchData]);

  return [filteredData, timeRange, setTimeRange, options];
}
