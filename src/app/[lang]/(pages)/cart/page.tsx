import { getCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import CheckCart from "./CheckCart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Loading from "@/app/[lang]/loading";
import { getDictionary } from "@/app/[lang]/dictionaries/dictionaries";

export const metadata = {
  title: "Pannier - E-commerce",
};

interface CartProps {
  params: {
    lang: string;
  };
}

export default async function Cart({ params: { lang } }: CartProps) {
  const dict = await getDictionary(lang);
  const cart = await getCart();

  if (!cart) {
    <Loading />;
  }

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl text-center lg:text-start">
            {dict.cart.title}
          </h1>
          <ul className="flex flex-col space-y-2 py-4">
            {cart?.cartItems?.map((cartItem) => (
              <li
                key={cartItem.id}
                className="space-y-6 lg:space-y-0 flex flex-col px-8 py-4 lg:border-b-2 lg:border-primary w-full lg:flex-row items-center"
              >
                <CartEntry cartItem={cartItem} key={cartItem.id} />
                <div className="flex lg:hidden h-[2px] w-3/4 bg-primary"></div>
              </li>
            ))}
          </ul>
          {!cart?.cartItems.length && (
            <>
              <div className="flex flex-col lg:flex-row gap-y-4 items-center gap-x-16">
                <p>{dict.cart.empty}</p>
                <Link href="/">
                  <Button aria-label="Retour collection" size="xl">
                    {dict.cart.continue}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
        <CheckCart cart={cart} dict={dict} />
      </div>
    </>
  );
}
