import { cookies } from "next/dist/client/components/headers";
import { prisma } from "./prisma";
import { Prisma, Wishlist, WishlistItems } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type WishlistWithProducts = Prisma.WishlistGetPayload<{
  include: {
    wishlistItems: { include: { product: true; variant: true } };
  };
}>;

export type WishlistItemWithProduct = Prisma.WishlistItemsGetPayload<{
  include: { product: true; variant: true };
}>;

export type ShoppingWishlist = WishlistWithProducts & {
  size: number;
  subtotal: number;
};

export async function getWishlist(): Promise<ShoppingWishlist | null> {
  const session = await getServerSession(authOptions);

  let wishlist: WishlistWithProducts | null = null;

  if (session) {
    wishlist = await prisma.wishlist.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        wishlistItems: { include: { product: true, variant: true } },
      },
    });
  } else {
    const localWishlistId = cookies().get("localWishlistId")?.value;
    wishlist = localWishlistId
      ? await prisma.wishlist.findUnique({
          where: { id: localWishlistId },
          include: {
            wishlistItems: {
              include: { product: true, variant: true },
            },
          },
        })
      : null;
  }

  if (!wishlist) {
    return null;
  }

  return {
    ...wishlist,
    size: wishlist.wishlistItems.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: wishlist.wishlistItems.reduce((acc, item) => {
      const variantPrice = item.variant ? item.variant.price : null;
      const productPrice = item.product ? item.product.price : null;
      const price =
        variantPrice !== null
          ? variantPrice
          : productPrice !== null
          ? productPrice
          : 0;
      return acc + item.quantity * price;
    }, 0),
  };
}

export async function createWishlist(): Promise<ShoppingWishlist> {
  const session = await getServerSession(authOptions);

  let newWishlist: Wishlist;
  if (session) {
    newWishlist = await prisma.wishlist.create({
      data: { userId: session.user.id },
    });
  } else {
    newWishlist = await prisma.wishlist.create({
      data: {},
    });
  }

  cookies().set("localWishlistId", newWishlist.id);

  return {
    ...newWishlist,
    wishlistItems: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousWishlistIntoUserCart(userId: string) {
  const localWishlistId = cookies().get("localWishlistId")?.value;

  const localWishlist = localWishlistId
    ? await prisma.wishlist.findUnique({
        where: { id: localWishlistId },
        include: { wishlistItems: true },
      })
    : null;

  if (!localWishlist) {
    return;
  }

  const userWishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: { wishlistItems: true },
  });

  await prisma.$transaction(async (tx) => {
    if (userWishlist) {
      const mergedWishlistItems = mergeWishlistItems(
        localWishlist.wishlistItems,
        userWishlist.wishlistItems
      );

      await tx.wishlistItems.deleteMany({
        where: { wishlistId: userWishlist.id },
      });

      await tx.wishlistItems.createMany({
        data: mergedWishlistItems.map((item) => ({
          wishlistId: userWishlist.id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    } else {
      await tx.wishlist.create({
        data: {
          userId,
          wishlistItems: {
            createMany: {
              data: localWishlist.wishlistItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localWishlist.id },
    });

    cookies().set("localCartId", "");
  });
}

function mergeWishlistItems(...wishlistItems: WishlistItems[][]) {
  return wishlistItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as WishlistItems[]);
}