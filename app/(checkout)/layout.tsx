import { Container } from "@/shared/components/shared/container";
import Header from "@/shared/components/shared/header";

export const metadata = {
  title: "Next Pizza | Оформление заказа",
  description: "Оформление заказа",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f4f1ee]">
      <Container>
        <Header
          className="border-b-gray-200"
          hasSearch={false}
          hasCart={false}
        />
        {children}
      </Container>
    </main>
  );
}
