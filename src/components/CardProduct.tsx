"use client";
import Link from "next/link";
import PriceTag from "@/helpers/PriceTag";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import AddToCartButton from "@/components/AddToCartButton";
import { Category, Color, Product } from "@/lib/DbSchema";
import { useServerAddToCart } from "@/app/[lang]/(pages)/wishlist/actions";

interface CardProductProps {
  product: Product;
  selectedCategory: Category | null;
  selectedColor: Color | null;
}

export default function CardProduct({
  product,
  selectedCategory,
  selectedColor,
}: CardProductProps) {
  if (
    !selectedCategory ||
    product.category === selectedCategory ||
    !selectedColor ||
    product.color === selectedColor
  ) {
    return (
      <li className="flex justify-center max-w-[300px] max-h-[400px] p-4">
        <div className="w-full flex flex-col justify-center items-center space-y-2">
          <Link href={"/products/" + product.id}>
            <figure>
              <Image
                src={product.imageUrl!}
                alt={product.name}
                width={800}
                height={400}
                className="h-52 w-52 object-contain"
              />
            </figure>
          </Link>
          <div className="w-full space-y-2 relative">
            {/* {product.category && (
              <Badge className="absolute left-0 md:left-2">Nouveau</Badge>
            )} */}

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
      </li>
    );
  } else {
    return null;
  }
}
