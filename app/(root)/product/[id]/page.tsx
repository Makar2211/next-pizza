import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/prisma/prisma-client";

import { Container } from "@/shared/components/shared/container";
import { ProductForm } from "@/shared/components/shared/product-form";

const Product = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await prisma.product.findFirst({
    where: { id: Number(id) },
    include: {
      ingredients: true,
      items: true,
      categoty: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  if (!product) return notFound();

  return (
    <Container className="flex flex-col my-10">
      <ProductForm product={product} />
    </Container>
  );
};

export default Product;
