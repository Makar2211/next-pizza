import React from "react";
import { WhiteBlock } from "./white-block";
import { CheckoutItemsDetails } from "./checkout-items-details";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";
import { Button, Skeleton } from "../ui";

const VAT = 15;
const DELIVERY_PRICE = 100;
interface Props {
  className?: string;
  totalAmount: number;
  loading?: boolean;
}

export const CheckoutSidevar: React.FC<Props> = ({
  className,
  totalAmount,
  loading,
}) => {
  const vatPrice = (totalAmount * VAT) / 100;
  const totalPrice = totalAmount + vatPrice + DELIVERY_PRICE;
  return (
    <WhiteBlock className="p-6 sticky top-4">
      <div className="flex flex-col gap-1">
        <span className="text-xl">Итого: </span>
        {loading ? (
          <Skeleton className="w-full h-11" />
        ) : (
          <span className="h-11 text-[34px] font-extrabold">
            {totalPrice} UAH
          </span>
        )}
      </div>

      <CheckoutItemsDetails
        title={
          <div className="flex items-center">
            <Package className="mr-2 text-gray-300" size={18} />
            Стоимость корзины:{" "}
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-14 h-6 rounded=[6px]" />
          ) : (
            `${totalAmount} UAH`
          )
        }
      />
      <CheckoutItemsDetails
        title={
          <div className="flex items-center">
            <Percent className="mr-2 text-gray-300" size={18} />
            Налоги:{" "}
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-14 h-6 rounded=[6px]" />
          ) : (
            `${vatPrice} UAH`
          )
        }
      />
      <CheckoutItemsDetails
        title={
          <div className="flex items-center">
            <Truck className="mr-2 text-gray-300" size={18} />
            Доставка:{" "}
          </div>
        }
        value={
          loading ? (
            <Skeleton className="w-14 h-6 rounded=[6px]" />
          ) : (
            `${DELIVERY_PRICE} UAH`
          )
        }
      />

      <Button
        loading={loading}
        type="submit"
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
      >
        Перейти к оплате
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
