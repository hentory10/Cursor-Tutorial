import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';

export async function POST(req: NextRequest) {
  const data = await req.json();

  // Save booking in DB (simplified, no auth)
  const booking = await prisma.booking.create({
    data: {
      ...data,
      travellers: {
        create: data.travellers,
      },
    },
  });

  return NextResponse.json({ id: booking.id });
} 