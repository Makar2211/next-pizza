import * as React from "react";

interface Props {
  orderId: number;
  totalAmount?: number;
  paymentUrl?: string;
}

export const PayOrderTeamplate: React.FC<Props> = ({
  orderId,
  totalAmount,
  paymentUrl,
}) => (
  <div>
    <h1>Заказ #{orderId}</h1>

    <p>
      Оплатите заказ на сумму {totalAmount} UAH. Перейдите по ссылке{" "}
      <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа
    </p>
  </div>
);
