import * as z from "zod";

export const checkoutFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Имя должно быть больше двух символов" }),
  lastName: z
    .string()
    .min(2, { message: "Имя должно быть больше двух символов" }),
  email: z.string().email({ message: "Некорректная почта" }),
  phone: z.string().min(10, { message: "Некорректный номер телефона" }),
  address: z.string().min(5, { message: "Некорректный адрес" }),
  comment: z.string().optional(),
});

export type TCkeckoutFormValues = z.infer<typeof checkoutFormSchema>;
