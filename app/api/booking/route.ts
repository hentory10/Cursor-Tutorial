import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Extract booking data
    const {
      packageId,
      roomId,
      arrivalDate,
      people,
      travellers = [],
      total,
      insurance,
      paymentType,
      addOns = [],
    } = data;

    // Validate required fields
    if (!packageId || !roomId || !arrivalDate || !people || !total) {
      return NextResponse.json(
        { error: 'Missing required booking fields' },
        { status: 400 }
      );
    }

    // Create booking with travellers and add-ons
    const booking = await prisma.booking.create({
      data: {
        packageId,
        roomId,
        arrivalDate: new Date(arrivalDate),
        people: parseInt(people.toString()),
        insurance: insurance || false,
        paymentType: paymentType || 'full',
        total: parseInt(total.toString()),
        travellers: {
          create: travellers.map((t: { name: string }) => ({
            name: t.name || 'Guest',
          })),
        },
        bookingAddOns: {
          create: addOns.map((addOn: { addOnId: string }) => ({
            addOnId: addOn.addOnId,
          })),
        },
      },
      include: {
        package: true,
        room: true,
        travellers: true,
        bookingAddOns: {
          include: {
            addOn: true,
          },
        },
      },
    });

    return NextResponse.json({ id: booking.id });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 