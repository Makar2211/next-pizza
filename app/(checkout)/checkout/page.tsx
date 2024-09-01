"use client";
import { createOrder } from "@/app/actions";
import { CheckoutSidevar } from "@/shared/components/shared/checkout-sidevar";
import { CheckoutCart } from "@/shared/components/shared/checkout/checkout-cart";
import { CheckoutDeliveryAddress } from "@/shared/components/shared/checkout/checkout-delivery-address";
import {
  checkoutFormSchema,
  TCkeckoutFormValues,
} from "@/shared/components/shared/checkout/checkout-form-schema";
import { CheckoutPersonalForm } from "@/shared/components/shared/checkout/checkout-personal-form";
import { Container } from "@/shared/components/shared/container";
import { Title } from "@/shared/components/shared/title";
import { useCart } from "@/shared/hooks/use-cart";
import { cn } from "@/shared/lib/utils";
import { Api } from "@/shared/services/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { Suspense } from "react";
import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const {
    totalAmount,
    items,
    updateItemQuantity,
    removeCartItem,
    addCartItem,
    loading,
  } = useCart();

  const { data: session } = useSession();
  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();

      const [firstName, lastName] = data.fullName.split(" ");

      form.setValue("firstName", firstName);
      form.setValue("lastName", lastName);
      form.setValue("email", data.email);
    }
    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const form = useForm<TCkeckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      lastName: "",
      email: "",
      firstName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  const onSubmit: SubmitHandler<TCkeckoutFormValues> = async (data) => {
    try {
      setSubmitting(true);
      const url = await createOrder(data);
      toast.success("Заказ успешно оформлен! 📝 Переход на оплату... ", {
        icon: "✅",
      });
      if (url) {
        location.href = url;
      }
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.error("Не удалось оформить заказ", {
        icon: "❌",
      });
    }
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold mb-6 text-[36px]"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Блок с левой стороны */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                items={items}
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                loading={loading}
              />
              <CheckoutPersonalForm
                className={cn(loading && "opacity-50 pointer-events-none")}
              />
              <CheckoutDeliveryAddress
                className={cn(loading && "opacity-50 pointer-events-none")}
              />
            </div>

            {/* Блок с правой стороны */}
            <div className="w-[450px]">
              <CheckoutSidevar
                loading={submitting || loading}
                totalAmount={totalAmount}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
