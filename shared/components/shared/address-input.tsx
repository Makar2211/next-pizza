"use client";

import React from "react";
import { AddressSuggestions } from "react-dadata";
import "react-dadata/dist/react-dadata.css";

interface Props {
  onChange?: (value?: string) => void;
}

export const AdressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token="6fed14d70e537243241a89d18994e0cf5f04b5ee"
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};
