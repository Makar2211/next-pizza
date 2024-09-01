import { z } from "zod";

export const passwordSchema = z.string().min(4, {
  message: "Пароль должен содержать не менее 6 символов",
});

export const formLoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Обязатльное поле",
    })
    .email({
      message: "Введите корректную почту",
    }),
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z.string().min(2, {
        message: "Введите имя и фамилию",
      }),
      confirmPassword: passwordSchema,
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type TFormLoginVelues = z.infer<typeof formLoginSchema>;
export type TFormRegisterVelues = z.infer<typeof formRegisterSchema>;
