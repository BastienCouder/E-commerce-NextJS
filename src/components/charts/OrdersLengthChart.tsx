"use client";

import {
  AnalyticsOrdersData,
  readAnalyticsOrdersProps,
} from "@/app/dashboard/analytics/actions/analytics-orders";
import { formatDate } from "../../lib/helpers/format";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface OrdersLengthChartProps {
  analyticsData: readAnalyticsOrdersProps;
}

const axisStyle = {
  fontSize: "0.8rem",
  fill: "rgb(var(--foreground))",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: AnalyticsOrdersData }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const { date, totalNocanceledOrders } = payload[0].payload;

    return (
      <div className="p-3 text-background text-sm bg-foreground rounded-lg">
        <p className="font-bold">{date}</p>
        <p>
          {totalNocanceledOrders
            ? `Total : ${totalNocanceledOrders}`
            : "Aucune ventes"}
        </p>
      </div>
    );
  }

  return null;
};

export default function OrdersLengthChart({
  analyticsData,
}: OrdersLengthChartProps) {
  const { data } = analyticsData;

  return (
    <>
      <section className="w-[50rem] h-[25rem] p-4 rounded-lg bg-card pb-24">
        <h2 className="mb-2">Nombres de commandes</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDate(value)}
              style={axisStyle}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--foreground))" }}
            />
            <YAxis
              scale="linear"
              style={axisStyle}
              tickLine={false}
              axisLine={{ stroke: "rgb(var(--foreground))" }}
            />
            <Tooltip
              cursor={{ fill: "rgb(var(--muted))" }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="totalNocanceledOrders"
              fill="rgb(var(--chart))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  );
}
