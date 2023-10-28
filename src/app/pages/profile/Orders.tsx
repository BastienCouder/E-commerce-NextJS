"use client";

import { ShoppingOrder } from "@/lib/db/order";
import formatPrice, { formatDate } from "@/lib/format";
import Image from "next/image";
import { useState } from "react";
import { AiFillCreditCard, AiFillHome, AiOutlineUser } from "react-icons/ai";
import { BiTimeFive } from "react-icons/bi";

interface OrderProps {
  order: ShoppingOrder | null;
}

export default function Orders({ order }: OrderProps) {
  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number | null>(
    null
  );
  function calculateSubtotal(cartItems: any): number {
    return cartItems.reduce((acc: number, item: any) => {
      const variantPrice = item.variant ? item.variant.price : null;
      const productPrice = item.product ? item.product.price : null;
      const price =
        variantPrice !== null
          ? variantPrice
          : productPrice !== null
          ? productPrice
          : 0;

      return acc + item.quantity * price;
    }, 0);
  }

  return (
    <div className="my-12">
      <ul className="space-y-8">
        {order?.orderItems.map((orderItem, index) => {
          const dateValue = new Date(orderItem.createdAt);
          const formattedDate = formatDate(dateValue);
          const isOrderSelected = selectedOrderIndex === index;
          const subtotal: number = calculateSubtotal(orderItem.cart.cartItems);

          return (
            <li key={index} className="w-[40rem] border-[1px] border-white">
              {!isOrderSelected ? (
                <>
                  {" "}
                  <div className="flex items-center h-10 px-4 py-2 w-full bg-zinc-800">
                    <p className="font-bold uppercase text-sm">
                      Commande n°{index + 1}
                    </p>
                  </div>
                  <div className="flex">
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-3">
                        <BiTimeFive size={20} />
                        <div className="flex gap-2">
                          <p>Date de la commande :</p>
                          <p className="font-bold">{formattedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AiOutlineUser size={20} />
                        <div className="flex gap-2">
                          <p>Envoyé à </p>
                          <div className="flex gap-2 font-bold">
                            {orderItem.delivery.deliveryItems.map(
                              (deliveryItems, itemIndex) => (
                                <div key={itemIndex} className="space-x-2">
                                  <span>{deliveryItems.name}</span>
                                  <span>{deliveryItems.surname}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AiFillCreditCard size={20} />
                        {formatPrice(subtotal, "EUR")}
                      </div>
                    </div>
                    <div className="space-y-4 p-4">
                      <div className="flex items-center gap-3">
                        <AiFillHome size={20} />
                        <p>Adresse :</p>
                        <span className="font-bold">Default</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4 w-32">
                    <p
                      onClick={() => {
                        if (isOrderSelected) {
                          setSelectedOrderIndex(null);
                        } else {
                          setSelectedOrderIndex(index);
                        }
                      }}
                      className="cursor-pointer"
                    >
                      Voir le détail
                    </p>
                  </div>
                </>
              ) : null}

              {isOrderSelected && (
                <div>
                  <div className="flex flex-col justify-center h-20 gap-1 px-4 py-2 w-full bg-zinc-800">
                    <p className="font-bold uppercase text-sm">
                      Commande n°{index + 1}
                    </p>
                    <p className="text-sm">
                      Date de la commande:{" "}
                      <span className="font-bold">{formattedDate}</span>
                    </p>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg pb-2">Adresse de livraison</h2>
                    {isOrderSelected &&
                      orderItem.delivery.deliveryItems.map(
                        (deliveryItems, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="text-sm border-b-2 pb-8 border-zinc-800"
                          >
                            <div className="flex space-x-2">
                              <p className="font-bold">{deliveryItems.name}</p>
                              <p className="font-bold">
                                {deliveryItems.surname}
                              </p>
                            </div>
                            <p className="uppercase">{deliveryItems.address}</p>
                            <div className="flex">
                              <p className="flex gap-2">
                                <span className="uppercase">
                                  {deliveryItems.city}, {deliveryItems.postcode}
                                  ,
                                </span>
                                {deliveryItems.country}
                              </p>
                            </div>
                            <p>{deliveryItems.tel}</p>
                          </div>
                        )
                      )}

                    <div className=" border-b-2 border-zinc-800">
                      <h2 className="text-lg mt-8 pb-2">Votre commande</h2>
                      {isOrderSelected &&
                        orderItem.cart.cartItems.map((cartItems, itemIndex) => {
                          return (
                            <>
                              <div
                                key={itemIndex}
                                className="flex flex-row-reverse justify-end gap-4 text-sm pb-8"
                              >
                                <div className="flex">
                                  {cartItems.variant ? (
                                    <Image
                                      src={cartItems.variant.imageUrl || ""}
                                      alt={cartItems.product.name}
                                      width={400}
                                      height={400}
                                      className="rounded-lg w-[90px] h-[90px]"
                                    />
                                  ) : (
                                    <Image
                                      src={cartItems.product.imageUrl}
                                      alt={cartItems.product.name}
                                      width={400}
                                      height={400}
                                      className="rounded-lg w-[90px] h-[90px]"
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col space-y-1">
                                  <p className="font-bold flex items-center gap-2">
                                    {cartItems.product.name}

                                    {cartItems.variant && (
                                      <>
                                        <span>-</span>
                                        <span className="text-sm">
                                          {cartItems.variant.color}
                                        </span>
                                      </>
                                    )}
                                  </p>
                                  <p>{cartItems.product.description}</p>
                                  <p className="uppercase">
                                    {formatPrice(
                                      cartItems.variant?.price
                                        ? cartItems.variant?.price
                                        : cartItems.product.price,
                                      "EUR"
                                    )}
                                  </p>
                                  <p className="capitalize flex gap-2">
                                    {cartItems.quantity > 1
                                      ? `quantités`
                                      : `quantité`}
                                    <span>{cartItems.quantity}</span>
                                  </p>
                                </div>
                              </div>
                            </>
                          );
                        })}
                    </div>
                    <div className="flex flex-col gap-4 text-sm border-b-2 pb-8 border-zinc-800">
                      <h2 className="text-lg mt-8 pb-2">
                        Total de votre commande
                      </h2>
                      <div className="flex justify-between w-40">
                        <p>Prix total:</p>
                        {formatPrice(subtotal, "EUR")}
                      </div>
                    </div>
                    <div className="mt-8 pb-4">
                      <p
                        onClick={() => {
                          if (isOrderSelected) {
                            setSelectedOrderIndex(null);
                          } else {
                            setSelectedOrderIndex(index);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        Fermer le détail
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}