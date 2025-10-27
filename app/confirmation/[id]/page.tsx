import React from 'react';
import { content } from '../../../content';
import { prisma } from '../../../prisma/client';

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { travellers: true, package: true, room: true },
  });

  if (!booking) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{content.confirmation.notFoundTitle}</h1>
        <p>{content.confirmation.notFoundMessage}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-2">{content.confirmation.title}</h1>
      <p className="mb-6">{content.confirmation.description}</p>
      <div className="bg-white rounded shadow p-6 w-full max-w-lg">
        <div className="mb-2 font-semibold">{content.confirmation.bookingIdLabel}: <span className="font-mono">{booking.id}</span></div>
        <div className="mb-2">{content.confirmation.packageLabel}: {booking.package.name}</div>
        <div className="mb-2">{content.confirmation.roomLabel}: {booking.room.name}</div>
        <div className="mb-2">{content.confirmation.arrivalLabel}: {booking.arrivalDate.toLocaleDateString()}</div>
        <div className="mb-2">{content.confirmation.travellersLabel}: {booking.travellers.map(t => t.name).join(', ')}</div>
        <div className="mb-2">{content.confirmation.totalLabel}: {booking.total} €</div>
      </div>
      <div className="mt-8 text-center text-gray-500">{content.confirmation.footer}</div>
    </main>
  );
} 