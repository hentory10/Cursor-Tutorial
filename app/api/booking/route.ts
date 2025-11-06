import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../prisma/client';
import { createClient } from '@supabase/supabase-js';

// Supabase client as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uakihwftirtauozffiuq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVha2lod2Z0aXJ0YXVvemZmaXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMTY1MjcsImV4cCI6MjA3Nzg5MjUyN30.F1lp2w00L0G1F7X7vRnPWerY2LBnmatoDIp-ApeM8oY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to generate sequential booking ID starting with 0001
async function generateSequentialBookingId(): Promise<string> {
  try {
    // Use Supabase SQL to get next ID from sequence
    const { data, error } = await supabase.rpc('generate_booking_id');
    
    if (!error && data) {
      return data;
    }
    
    // Fallback: get max sequential ID and increment
    const { data: bookings } = await supabase
      .from('Booking')
      .select('id')
      .order('id', { ascending: false })
      .limit(100);
    
    let nextNum = 1;
    if (bookings && bookings.length > 0) {
      // Find the highest sequential ID (format: 0001, 0002, etc.)
      const sequentialIds = bookings
        .map(b => b.id)
        .filter(id => /^\d{4}$/.test(id)) // Only 4-digit IDs
        .map(id => parseInt(id))
        .filter(num => !isNaN(num));
      
      if (sequentialIds.length > 0) {
        nextNum = Math.max(...sequentialIds) + 1;
      }
    }
    
    return String(nextNum).padStart(4, '0');
  } catch (error) {
    console.error('Error generating booking ID:', error);
    // Fallback: use timestamp last 4 digits
    const timestamp = Date.now().toString();
    return timestamp.slice(-4).padStart(4, '0');
  }
}

// Helper to generate UUID for travellers and add-ons
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function POST(req: NextRequest) {
  let data: any = null;
  try {
    data = await req.json();

    // Extract booking data
    const {
      packageId,
      packageName,
      roomId,
      roomName,
      arrivalDate,
      checkoutDate,
      people,
      guestFullName,
      guestAge,
      guestCountry,
      guestPhone,
      guestEmail,
      surfLevel,
      gender,
      travellers = [],
      total,
      insurance,
      airportTransfer,
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

    // Generate sequential booking ID starting with 0001
    const bookingId = await generateSequentialBookingId();
    
    // Try Prisma first, fallback to Supabase REST API
    try {
      // Try Prisma connection
      const booking = await prisma.booking.create({
        data: {
          id: bookingId,
          packageId,
          packageName: packageName || null,
          roomId,
          roomName: roomName || null,
          arrivalDate: new Date(arrivalDate),
          checkoutDate: checkoutDate ? new Date(checkoutDate) : null,
          people: parseInt(people.toString()),
          guestFullName: guestFullName || null,
          guestAge: guestAge || null,
          guestCountry: guestCountry || null,
          guestPhone: guestPhone || null,
          guestEmail: guestEmail || null,
          surfLevel: surfLevel || null,
          gender: gender || null,
          insurance: insurance || false,
          airportTransfer: airportTransfer || false,
          paymentType: paymentType || 'full',
          total: parseInt(total.toString()),
          travellers: {
            create: travellers.map((t: any) => ({
              name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Guest',
              firstName: t.firstName || null,
              lastName: t.lastName || null,
              email: t.email || null,
              year: t.year || null,
              month: t.month || null,
              day: t.day || null,
              country: t.country || null,
              phone: t.phone || t.mobile || null,
              surfLevel: t.surfLevel || null,
              gender: t.gender || null,
            })),
          },
          bookingAddOns: {
            create: addOns.map((addOn: { addOnId: string }) => ({
              addOnId: addOn.addOnId,
            })),
          },
        },
      });
    } catch (prismaError) {
      console.error('Prisma connection failed, using Supabase REST API fallback:', prismaError);
      
      // Fallback: Use Supabase REST API
      const { error: bookingError } = await supabase
        .from('Booking')
        .insert({
          id: bookingId,
          packageId,
          packageName: packageName || null,
          roomId,
          roomName: roomName || null,
          arrivalDate: new Date(arrivalDate).toISOString(),
          checkoutDate: checkoutDate ? new Date(checkoutDate).toISOString() : null,
          people: parseInt(people.toString()),
          guestFullName: guestFullName || null,
          guestAge: guestAge || null,
          guestCountry: guestCountry || null,
          guestPhone: guestPhone || null,
          guestEmail: guestEmail || null,
          surfLevel: surfLevel || null,
          gender: gender || null,
          insurance: insurance || false,
          airportTransfer: airportTransfer || false,
          paymentType: paymentType || 'full',
          total: parseInt(total.toString()),
        });

      if (bookingError) {
        throw new Error(`Supabase booking creation failed: ${bookingError.message}`);
      }

      // Create travellers with all fields
      if (travellers.length > 0) {
        const travellerInserts = travellers.map((t: any) => ({
          id: generateUUID(),
          name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Guest',
          firstName: t.firstName || null,
          lastName: t.lastName || null,
          email: t.email || null,
          year: t.year || null,
          month: t.month || null,
          day: t.day || null,
          country: t.country || null,
          phone: t.phone || t.mobile || null,
          surfLevel: t.surfLevel || null,
          gender: t.gender || null,
          bookingId: bookingId,
        }));

        const { error: travellerError } = await supabase
          .from('Traveller')
          .insert(travellerInserts);

        if (travellerError) {
          console.error('Traveller creation error:', travellerError);
        }
      }

      // Create booking add-ons
      if (addOns.length > 0) {
        const addOnInserts = addOns.map((addOn: { addOnId: string }) => ({
          id: generateUUID(),
          bookingId: bookingId,
          addOnId: addOn.addOnId,
        }));

        const { error: addOnError } = await supabase
          .from('BookingAddOn')
          .insert(addOnInserts);

        if (addOnError) {
          console.error('AddOn creation error:', addOnError);
        }
      }
    }

    return NextResponse.json({ id: bookingId });
  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    if (data) {
      console.error('Received data:', JSON.stringify(data, null, 2));
    } else {
      console.error('Failed to parse request data');
    }
    return NextResponse.json(
      { 
        error: 'Failed to create booking', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 