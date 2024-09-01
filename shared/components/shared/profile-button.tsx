"use client";
import { signIn, useSession } from "next-auth/react";
import React, { useLayoutEffect } from "react";
import { Button } from "../ui";
import Image from "next/image";
import Link from "next/link";
import { CircleUser } from "lucide-react";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") return "";

  return (
    <div className={className}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Image src="/profile.png" alt="profile" width={12} height={12} />
          Войти
        </Button>
      ) : (
        <Link href="/profile">
          <Button variant="secondary" className="flex items-center gap-2">
            <CircleUser size={18} />
            Профиль
          </Button>
        </Link>
      )}
    </div>
  );
};
