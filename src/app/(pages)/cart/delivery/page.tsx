import FormDeliveryLogin from "./FormDeliveryLogin";
import Loading from "@/app/loading";
import { getDelivery } from "@/lib/db/delivery";
import FormDelivery from "@/components/FormDelivery";
import SelectDelivery from "@/components/SelectDelivery";
import {
  designateDefaultDeliveryItem,
  processDeliveryForm,
  removeDeliveryItem,
} from "./actions";
import { Metadata } from "next";
import { getDictionary } from "@/app/lang/dictionaries";
import website from "@/data/infosWebsite";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function generateMetadata({
  params: { lang },
}: DeliveryProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  return {
    title: `${dict.metadata.delivery_title} - ${website.name}`,
    description: `${dict.metadata.delivery_metadescription}`,
  };
}
interface DeliveryProps {
  params: {
    lang: string;
  };
}

const getDeliveryOptions = cache(async () => {
  const deliveryOptions = await prisma.deliveryOption.findMany();

  if (!deliveryOptions) notFound();
  return deliveryOptions;
});

export default async function Delivery({ params: { lang } }: DeliveryProps) {
  const session = await auth();
  const delivery = await getDelivery();
  const deliveryOptions = await getDeliveryOptions();
  const dict = await getDictionary(lang);

  if (!delivery) {
    <Loading />;
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col space-y-8 mb-8">
          <FormDeliveryLogin session={session} dict={dict} />
          <div className="px-4 md:px-20 xl:p-0 space-y-8">
            <h1 className="text-4xl text-center md:text-start capitalize">
              {dict.delivery.delivery}
            </h1>
          </div>
          <SelectDelivery
            session={session}
            delivery={delivery}
            deliveryOptions={deliveryOptions}
            designateDefaultDeliveryItem={designateDefaultDeliveryItem}
            removeDeliveryItem={removeDeliveryItem}
            dict={dict}
          />
        </div>
        <section className="w-2/3 space-y-4">
          <h2>Ajouter une adresse de livraison</h2>
          <FormDelivery
            processDeliveryForm={processDeliveryForm}
            session={session}
          />
        </section>
      </div>
    </>
  );
}
