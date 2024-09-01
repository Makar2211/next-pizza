import { Resend } from "resend";
import { PayOrderTeamplate } from "../components/shared/email-teamplates/pay-order";
interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}
export const sendEmail = async (
  to: string,
  subject: string,
  teamplate: React.ReactNode
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    react: teamplate,
  });

  if (error) {
    throw error;
  }
  return data;
};
