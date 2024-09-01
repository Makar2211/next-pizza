import { prisma } from "@/prisma/prisma-client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await prisma.order.findFirst({
      where: {
        id: body.orderId,
      },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.log("[CALLBACK]: ", error);
  }
}
