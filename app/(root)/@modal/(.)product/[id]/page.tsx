import { prisma } from "@/prisma/prisma-client";
import { ChooseModal } from "@/shared/components/shared/modals/choose-modal";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  className?: string;
}

const ProductModalPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      categoty: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: {
        include: {
          cartItem: true,
          product: true,
        },
      },
    },
  });
  if (!product) return notFound();
  return <ChooseModal product={product} />;
};

export default ProductModalPage;
