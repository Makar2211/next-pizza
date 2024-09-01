import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

	const user = await prisma.user.findMany()
	return NextResponse.json(user)
}

export async function POST(request: Request) {
	const data = await request.json()
	const user = await prisma.user.create({
		data
	})

	return NextResponse.json(user)
} 