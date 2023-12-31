import { Metadata } from "next";
import AnalyticsNav from "@/components/dashboard/AnalyticsNav";
import DeviceChart from "@/components/charts/DeviceChart";
import BrowserChart from "@/components/charts/BrowserChart";
import { readAnalyticsProducts } from "./actions/analytics-products";
import { readAnalyticsOrders } from "./actions/analytics-orders";
import { readAnalyticsWishlistCartOrder } from "./actions/analytics-interactions-products";
import { readAnalyticsVisitorInfos } from "./actions/analytics-visitors";
import { readAnalyticsNewsletterAnalytics } from "./actions/analytics-users";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default async function ViewsPage() {
  return (
    <>
      <div className="flex-1 space-y-4">
        <AnalyticsNav
          analyticsProductsData={await readAnalyticsProducts()}
          analyticsOrdersData={await readAnalyticsOrders()}
          analyticsUsersData={await readAnalyticsNewsletterAnalytics()}
          analyticsWishlistCartOrderData={await readAnalyticsWishlistCartOrder()}
        />
        <BrowserChart analyticsData={await readAnalyticsVisitorInfos()} />
        <DeviceChart analyticsData={await readAnalyticsVisitorInfos()} />
      </div>
    </>
  );
}
