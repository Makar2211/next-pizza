import { prisma } from "@/prisma/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { Ingredients } from "@/shared/components/shared/ingredients";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        OR: [
          {
            token: token,
          },
        ],
      },
      include: {
        items: {
          orderBy: {
            createAt: "desc",
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(userCart);
  } catch (error) {
    console.log("[CART_GET] Server error.", error);
    return NextResponse.json(
      { message: "При получении корзины что-то пошло не так" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("cartToken")?.value;
    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);

    const data = (await req.json()) as CreateCartItemValues;

    const findCartItem =
      data?.ingredients?.length === 0
        ? await prisma.cartItem.findFirst({
            where: {
              cartId: userCart.id,
              productItemId: data.productItemId,
            },
          })
        : await prisma.cartItem.findFirst({
            where: {
              cartId: userCart.id,
              productItemId: data.productItemId,
              ingredients: {
                every: { id: { in: data.ingredients } },
              },
            },
          });

    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });
      const updatedUserCart = await updateCartTotalAmount(token);
      return NextResponse.json(updatedUserCart);
    }

    await prisma.cartItem.create({
      data: {
        cartId: userCart.id,
        productItemId: data.productItemId,
        quantity: 1,
        ingredients: {
          connect: data.ingredients?.map((ingredient) => ({ id: ingredient })),
        },
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token);
    const res = NextResponse.json(updatedUserCart);
    res.cookies.set("cartToken", token, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });
    return res;
  } catch (error) {
    console.log("[CART_POST] Server error.", error);
    return NextResponse.json(
      { message: "При добавлении товара в корзину что-то пошло не так" },
      { status: 500 }
    );
  }
}
