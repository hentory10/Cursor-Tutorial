"use client";

import React from "react";
import Image from "next/image";
import BookingSummary from "../../../components/BookingSummary";    
import { useStore } from "../../../store/booking";
import { useRouter } from "next/navigation";

const oubahaRooms = [
  {
    id: "1",
    name: "Tamazirt room - Oubaha",
    price: 140,
    img: "/images/room1.jpg",
    available: true,
    booked: false,
  },
  {
    id: "2",
    name: "Triple room - Oubaha",
    price: 0,
    img: "/images/room2.jpg",
    available: true,
    booked: false,
  },
  {
    id: "3",
    name: "Double room - Oubaha",
    price: 0,
    img: "/images/room3.jpg",
    available: true,
    booked: false,
  },
  {
    id: "4",
    name: "Twin room - Oubaha",
    price: 0,
    img: "/images/room4.jpg",
    available: true,
    booked: false,
  },
];

const bigdiRooms = [
  {
    id: "5",
    name: "Akal room - Bigdi",
    price: 70,
    img: "/images/akalroom.webp",
    available: true,
    booked: false,
  },
  {
    id: "6",
    name: "Ayour room - Bigdi",
    price: 0,
    img: "/images/ayourroom.webp",
    available: true,
    booked: false,
  },
  {
    id: "7",
    name: "Tafokt room - Bigdi",
    price: 70,
    img: "/images/room1.jpg",
    available: true,
    booked: false,
  },
  {
    id: "8",
    name: "Amlal room - Bigdi",
    price: 0,
    img: "/images/room2.jpg",
    available: true,
    booked: false,
  },
];

export default function RoomStep() {
  const { selectedPackage, people: maxPeople, arrivalDate, roomAssignments, setRoomAssignments } = useStore();
  const router = useRouter();
  const checkIn = arrivalDate ? new Date(arrivalDate) : null;
  const checkOut = checkIn ? new Date(checkIn) : null;
  if (checkOut) checkOut.setDate(checkOut.getDate() + 7);
  const TIMEZONE = 'Africa/Casablanca';

  // Calculate total assigned people
  const totalAssigned = Object.values(roomAssignments).reduce((sum, n) => sum + n, 0);

  // Helper to update assignments
  const handleChange = (roomId: string, delta: number) => {
    const current = roomAssignments[roomId] || 0;
    let next = { ...roomAssignments };
    if (delta === 1 && totalAssigned < maxPeople && current < 2) {
      next[roomId] = current + 1;
    } else if (delta === -1 && current > 0) {
      next[roomId] = current - 1;
    }
    setRoomAssignments(next);
  };

  const handleNext = () => {
    router.push("/checkout/4-add-ons");
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 min-h-screen max-w-7xl mx-auto px-4">
      <div className="w-full md:w-[70%] py-8">
        <h2 className="text-2xl font-bold mb-2">Select your room type</h2>
        <div className="text-gray-500 mb-8 text-base">Price add-on per room for the duration</div>
        <div className="w-full mb-8">
          <div className="rounded-full bg-yellow-300 px-6 py-2 text-lapoint-dark text-[12px] font-normal" style={{ fontFamily: 'Nunito, sans-serif', width: '100%', fontWeight: 400 }}>
            <span className="font-bold">10% discount</span> &bull; For bookings with arrival dates until 11 Aug Including 4 day packages or multiple weeks. &bull; Use code: <span className="font-bold">TAGHAZOUT10</span>
          </div>
        </div>
        {/* Oubaha Rooms */}
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4">DRIFTLINE OUBAHA</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {oubahaRooms.map((room) => {
              const assigned = roomAssignments[room.id] || 0;
              return (
                <div key={room.id} className={`bg-white border border-lapoint-border rounded-xl overflow-hidden flex flex-col relative`}>
                  <div className="absolute top-0 left-0 w-full bg-lapoint-red text-white text-center py-1 text-[10px] font-semibold z-10 rounded-t-xl">
                    Room is not bookable for 1 person
                  </div>
                  <Image src={room.img} alt={room.name} width={600} height={400} quality={100} className="w-full h-56 object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-base mb-2">{room.name}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lapoint-red font-bold">+ EUR {room.price}</div>
                        <div className="text-sm text-gray-600">Number of people</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="bg-white border border-gray-300 text-black px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-50"
                        >
                          View room
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xl disabled:opacity-50 bg-white"
                            aria-label="Decrease number of people"
                            onClick={() => handleChange(room.id, -1)}
                            disabled={assigned === 0}
                          >
                            –
                          </button>
                          <span className="w-8 text-center font-bold">{assigned}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-lapoint-red text-lapoint-red flex items-center justify-center text-xl disabled:opacity-50 bg-white"
                            aria-label="Increase number of people"
                            onClick={() => handleChange(room.id, 1)}
                            disabled={assigned >= 2 || totalAssigned >= maxPeople}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Bigdi Rooms */}
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4">DRIFTLINE BIGDI</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bigdiRooms.map((room) => {
              const assigned = roomAssignments[room.id] || 0;
              return (
                <div key={room.id} className={`bg-white border border-lapoint-border rounded-xl overflow-hidden flex flex-col relative`}>
                  <div className="absolute top-0 left-0 w-full bg-lapoint-red text-white text-center py-1 text-[10px] font-semibold z-10 rounded-t-xl">
                    Room is not bookable for 1 person
                  </div>
                  <Image src={room.img} alt={room.name} width={600} height={400} quality={100} className="w-full h-56 object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-base mb-2">{room.name}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-lapoint-red font-bold">+ EUR {room.price}</div>
                        <div className="text-sm text-gray-600">Number of people</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="bg-white border border-gray-300 text-black px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-50"
                        >
                          View room
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xl disabled:opacity-50 bg-white"
                            aria-label="Decrease number of people"
                            onClick={() => handleChange(room.id, -1)}
                            disabled={assigned === 0}
                          >
                            –
                          </button>
                          <span className="w-8 text-center font-bold">{assigned}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-lapoint-red text-lapoint-red flex items-center justify-center text-xl disabled:opacity-50 bg-white"
                            aria-label="Increase number of people"
                            onClick={() => handleChange(room.id, 1)}
                            disabled={assigned >= 2 || totalAssigned >= maxPeople}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full md:w-[25%] flex-shrink-0 mt-8">
        <BookingSummary buttonLabel="ADD-ON SELECTION →" onButtonClick={handleNext} />
      </div>
    </div>
  );
} 