"use server";

import Stripe from "stripe";
import { cookies } from "next/headers";
import { prisma } from "@/prisma/prisma-client";
import { TCkeckoutFormValues } from "@/shared/components/shared/checkout/checkout-form-schema";
import { OrderStatus, Prisma } from "@prisma/client";
import { sendEmail } from "@/shared/lib/send-email";
import { PayOrderTeamplate } from "@/shared/components/shared/email-teamplates/pay-order";
import { getUserSession } from "@/shared/lib/get-user-session";
import { hashSync } from "bcrypt";
import { VerificationUserTeamplate } from "@/shared/components/shared/email-teamplates/verification-user";

const stripe = new Stripe(
  "sk_test_51PaGwNRuPrsz1nvGNjxt7IQXmNu78zqDy4i6VlP7R2WuJDus87tIARDwrERXYM8mvpmNfDSX5Pf2xWj9AbnzD2VU00PnCG2FjL"
);

export async function createOrder(data: TCkeckoutFormValues) {
  try {
    const cartToken = cookies().get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    if (!userCart) {
      throw new Error("Cart not found");
    }

    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    //переход в страпи для оплаты заказа
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: userCart.items.map((item) => ({
        price_data: {
          currency: "uah", // Используйте валюту заказа
          product_data: {
            name: item.productItem.product.name,
          },
          unit_amount: Math.round(item.productItem.price * 100), // Укажите цену в минимальных единицах валюты (копейках)
        },
        quantity: item.quantity,
      })),
      metadata: {
        order_id: order.id,
      },
      mode: "payment",
      success_url: process.env.STRIPE_CALLBACK_SUCCSESS_URL,
      cancel_url: process.env.STRIPE_CALLBACK_CANCEL_URL,
    });

    if (!session.url) {
      throw new Error("Session url not found");
    }

    await sendEmail(
      data.email,
      `Next Pizza | Оплатите заказ № ${order.id}`,
      PayOrderTeamplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl: session.url as string,
      })
    );

    const orderSucceeded = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: session.id,
        status: OrderStatus.SUCCEEDED,
      },
    });

    /* if (session.payment_status === "paid") {
      await sendEmail(
        data.email,
        `Next Pizza | Спасибо за заказ № ${orderSucceeded.id}`,
        PayOrderTeamplate({
          orderId: orderSucceeded.id,

          totalAmount: order.totalAmount,
          paymentUrl: session.url as string,
        })
      );
    } */

    return session.url;
  } catch (error) {
    console.log("CreateOrder error", error);
    throw error;
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("User not found");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (error) {
    console.error("Error update user", error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (findUser) {
      if (!findUser.verifed) {
        throw new Error("Почта не подтверждена");
      }
      throw new Error("Пользователья не существует");
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,

        password: hashSync(body.password as string, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      `Next Pizza | Подтверждение регистрации`,
      VerificationUserTeamplate({
        code,
      })
    );
  } catch (error) {
    console.error("При регистрации что-то пошло не так", error);
    throw new Error();
  }
}
