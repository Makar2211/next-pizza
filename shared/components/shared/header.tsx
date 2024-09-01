"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { Container } from "./container";
import { Button } from "../ui";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useSession, signIn } from "next-auth/react";
import { ProfileButton } from "./profile-button";
import { AuthModal } from "./modals/auth/auth-modal";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isAuthModal, setIsAuthModal] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.has("paid")) {
      setTimeout(() => {
        toast.success("Вы успешно совершили заказ 📝", {
          duration: 5000,
        });
      }, 500);
      router.push("/");
    }

    if (searchParams.has("verified")) {
      setTimeout(() => {
        toast.success("Вы успешно зарегестрировались", {
          duration: 5000,
        });
      }, 500);
      router.push("/");
    }
  }, []);
  return (
    <>
      {isAuthModal && (
        <AuthModal onClose={() => setIsAuthModal(false)} open={isAuthModal} />
      )}
      <header className={cn("border-b", className)}>
        <Container className="flex items-center justify-between py-8">
          {/* левая часть */}
          <Link href="/">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={35} height={35} />
              <div>
                <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
                <p className="text-sm text-gray-400 leading-3">
                  вкусней уже некуда
                </p>
              </div>
            </div>
          </Link>
          {/* центр */}
          {hasSearch && (
            <div className="mx-10 flex-1">
              <SearchInput />
            </div>
          )}

          {/* правая часть */}
          <div className="flex justify-center items-center gap-2">
            <ProfileButton onClickSignIn={() => setIsAuthModal(true)} />
            {hasCart && <CartButton />}
          </div>
        </Container>
      </header>
    </>
  );
};

export default Header;
