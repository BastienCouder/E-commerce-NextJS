"use client";
import { addProductToCart } from "@/app/(pages)/actions/add-to-cart";
import { Dictionary } from "@/app/lang/dictionaries";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { Toaster, toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  dict: Dictionary;
}

export default function AddToCartButton({
  productId,

  dict,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <Button
        disabled={isPending}
        aria-label={dict.actions.add_to_cart}
        onClick={() => {
          startTransition(async () => {
            await addProductToCart(productId);
            toast.success(`${dict.favories.succes_product}`);
          });
        }}
      >
        {dict.actions.add_to_cart}
      </Button>

      <Toaster expand={false} position="bottom-left" />
    </>
  );
}
