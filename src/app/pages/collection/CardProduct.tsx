"use client";
import Link from "next/link";
import PriceTag from "@/components/PriceTag";
import Image from "next/image";

import { Product, Category, Color } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/AddToCartButton";
import {
  useServerAddToCart,
  useServerAddWishlist,
} from "../products/[id]/actions";
import AddToWishlist from "@/components/AddToWishlist";
interface CardProductProps {
  product: Product & {
    category: Category | null;
  };
  selectedCategory: Category | null;
  selectedColor: Color | null;
}

export default function CardProduct({
  product,
  selectedCategory,
  selectedColor,
}: CardProductProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;
  if (
    !selectedCategory ||
    product.categoryId === selectedCategory.id ||
    !selectedColor ||
    product.colorsId === selectedColor.id
  ) {
    return (
      <div className="flex justify-center max-w-[300px] max-h-[400px] p-4">
        <div className="w-full flex flex-col justify-center items-center space-y-2">
          <Link href={"/products/" + product.id}>
            <figure>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={800}
                height={400}
                className="h-52 object-contain"
              />
            </figure>
          </Link>
          <div className="w-full space-y-2 relative">
            {isNew && <Badge className="absolute left-0 md:left-6">New</Badge>}

            <h2 className="text-2xl text-center">{product.name}</h2>

            <div className="flex space-x-2 mr-4 justify-center items-center">
              <div className="text-center">
                <PriceTag price={product.price} />
              </div>
            </div>
          </div>
          <div className="pb-2">
            <AddToCartButton
              productId={product.id}
              variantId={""}
              addToCart={useServerAddToCart}
            />
          </div>
          <Separator />
        </div>
      </div>
    );
  } else {
    // Return null if the product does not match the selected category
    return null;
  }
}