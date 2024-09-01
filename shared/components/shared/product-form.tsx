"use client";
import { IProduct } from "@/@types/product";
import { useCartStore } from "@/shared/store/cart";
import React from "react";
import toast from "react-hot-toast";
import { ChooseProductForm } from "./choose-product-form";
import { ChoosePizzaForm } from "./choose-pizza-form";

interface Props {
  product: IProduct;
  className?: string;
  onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({
  product,
  onSubmit: _onSubmit,
  className,
}) => {
  const { addCartItem, loading } = useCartStore((state) => state);
  const firstItem = product.items[0];
  const isPizzaForm = Boolean(firstItem.pizzaType);

  const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
    try {
      const itemId = productItemId ?? firstItem.id;
      if (isPizzaForm) {
        await addCartItem({
          productItemId: itemId,
          ingredients,
        });
        toast.success("Пицца добавлена в корзину");
        _onSubmit?.();
      } else {
        await addCartItem({
          productItemId: firstItem.id,
        });
        toast.success("Товар добавлен в корзину");
        _onSubmit?.();
      }
    } catch (error) {
      toast.error("Не удалось добавить пиццу в корзину");
      console.error(error);
    }
  };
  if (!isPizzaForm) {
    return (
      <ChooseProductForm
        price={firstItem.price}
        imageUrl={product.imageUrl}
        name={product.name}
        onSubmit={onSubmit}
        items={[]}
        loading={loading}
      />
    );
  }

  return (
    <ChoosePizzaForm
      imageUrl={product.imageUrl}
      onClickAddCart={onSubmit}
      name={product.name}
      ingredients={product.ingredients}
      items={product.items}
      loading={loading}
    />
  );
};
