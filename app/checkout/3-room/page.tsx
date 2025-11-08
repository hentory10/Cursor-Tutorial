"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [tripleRoomAvailability, setTripleRoomAvailability] = useState<{
    bookedBeds: number;
    availableBeds: number;
    isFullyBooked: boolean;
  } | null>(null);
  const [twinRoomAvailability, setTwinRoomAvailability] = useState<{
    bookedBeds: number;
    availableBeds: number;
    isFullyBooked: boolean;
  } | null>(null);
  const [ayourRoomAvailability, setAyourRoomAvailability] = useState<{
    bookedBeds: number;
    availableBeds: number;
    isFullyBooked: boolean;
  } | null>(null);
  const [amlalRoomAvailability, setAmlalRoomAvailability] = useState<{
    bookedBeds: number;
    availableBeds: number;
    isFullyBooked: boolean;
  } | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingTwinAvailability, setLoadingTwinAvailability] = useState(false);
  const [loadingAyourAvailability, setLoadingAyourAvailability] = useState(false);
  const [loadingAmlalAvailability, setLoadingAmlalAvailability] = useState(false);
  const fetchRequestRef = useRef<string | null>(null);
  const fetchTwinRequestRef = useRef<string | null>(null);
  const fetchAyourRequestRef = useRef<string | null>(null);
  const fetchAmlalRequestRef = useRef<string | null>(null);

  // Debug: Log component render and arrivalDate
  console.log('🚀 RoomStep component rendered. arrivalDate:', arrivalDate);
  console.log('🚀 Store state:', { arrivalDate, maxPeople, selectedPackage: selectedPackage?.name });

  // Fetch bed availability for Triple room (id: "2")
  useEffect(() => {
    if (!arrivalDate) {
      console.log('No arrivalDate, clearing availability');
      setTripleRoomAvailability(null);
      setLoadingAvailability(false);
      fetchRequestRef.current = null;
      return;
    }

    // Ensure arrivalDate is in YYYY-MM-DD format
    const dateParam = arrivalDate.includes('T') 
      ? arrivalDate.split('T')[0] 
      : arrivalDate;
    
    // Create a unique request ID for this fetch
    const requestId = `${dateParam}-triple-${Date.now()}`;
    fetchRequestRef.current = requestId;
    
    console.log('🔄 Fetching Triple room availability for date:', dateParam, 'Request ID:', requestId);
    
    // Abort controller to cancel previous requests
    const abortController = new AbortController();
    
    // Set loading state immediately
    setLoadingAvailability(true);
    
    const fetchTripleRoomAvailability = async () => {
      try {
        const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `/api/room-availability?roomId=2&arrivalDate=${dateParam}`,
          { signal: abortController.signal }
        );
        
        clearTimeout(timeoutId);
        
        // Check if this is still the current request (prevent stale responses)
        if (fetchRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response for request:', requestId);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch Triple room availability:', response.status, errorText);
          // On error, assume unavailable for safety
          if (fetchRequestRef.current === requestId) {
            setTripleRoomAvailability({
              bookedBeds: 3,
              availableBeds: 0,
              isFullyBooked: true,
            });
            setLoadingAvailability(false);
          }
          return;
        }
        
        const data = await response.json();
        console.log('📦 Triple room availability data received for request:', requestId, data);
        
        // Double-check this is still the current request before updating state
        if (fetchRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response data for request:', requestId);
          return;
        }
        
        const availability = {
          bookedBeds: data.bookedBeds || 0,
          availableBeds: data.availableBeds ?? 3,
          isFullyBooked: data.isFullyBooked === true,
        };
        
        console.log('✅ Setting Triple room availability for request:', requestId, availability);
        
        // Update both states together to prevent flickering
        setTripleRoomAvailability(availability);
        setLoadingAvailability(false);
        
      } catch (error) {
        // Check if this is still the current request
        if (fetchRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring error for stale request:', requestId);
          return;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⚠️ Request aborted for:', requestId);
          // Don't update state if request was aborted (new request is in progress)
          return;
        } else {
          console.error('❌ Error fetching Triple room availability:', error);
        }
        
        // On error, assume unavailable for safety
        if (fetchRequestRef.current === requestId) {
          setTripleRoomAvailability({
            bookedBeds: 3,
            availableBeds: 0,
            isFullyBooked: true,
          });
          setLoadingAvailability(false);
        }
      }
    };

    // Call immediately
    fetchTripleRoomAvailability();
    
    // Cleanup: cancel the request if component unmounts or arrivalDate changes
    return () => {
      console.log('🧹 Cleaning up Triple room request:', requestId);
      abortController.abort();
      // Don't clear fetchRequestRef here - let the new request set it
    };
  }, [arrivalDate]);

  // Fetch bed availability for Twin room (id: "4")
  useEffect(() => {
    if (!arrivalDate) {
      console.log('No arrivalDate, clearing Twin room availability');
      setTwinRoomAvailability(null);
      setLoadingTwinAvailability(false);
      fetchTwinRequestRef.current = null;
      return;
    }

    // Ensure arrivalDate is in YYYY-MM-DD format
    const dateParam = arrivalDate.includes('T') 
      ? arrivalDate.split('T')[0] 
      : arrivalDate;
    
    // Create a unique request ID for this fetch
    const requestId = `${dateParam}-twin-${Date.now()}`;
    fetchTwinRequestRef.current = requestId;
    
    console.log('🔄 Fetching Twin room availability for date:', dateParam, 'Request ID:', requestId);
    
    // Abort controller to cancel previous requests
    const abortController = new AbortController();
    
    // Set loading state immediately
    setLoadingTwinAvailability(true);
    
    const fetchTwinRoomAvailability = async () => {
      try {
        const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout
        
        const response = await fetch(
          `/api/room-availability?roomId=4&arrivalDate=${dateParam}`,
          { signal: abortController.signal }
        );
        
        clearTimeout(timeoutId);
        
        // Check if this is still the current request (prevent stale responses)
        if (fetchTwinRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response for Twin room request:', requestId);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch Twin room availability:', response.status, errorText);
          // On error, assume unavailable for safety
          if (fetchTwinRequestRef.current === requestId) {
            setTwinRoomAvailability({
              bookedBeds: 2,
              availableBeds: 0,
              isFullyBooked: true,
            });
            setLoadingTwinAvailability(false);
          }
          return;
        }
        
        const data = await response.json();
        console.log('📦 Twin room availability data received for request:', requestId, data);
        
        // Double-check this is still the current request before updating state
        if (fetchTwinRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response data for Twin room request:', requestId);
          return;
        }
        
        const availability = {
          bookedBeds: data.bookedBeds || 0,
          availableBeds: data.availableBeds ?? 2,
          isFullyBooked: data.isFullyBooked === true,
        };
        
        console.log('✅ Setting Twin room availability for request:', requestId, availability);
        
        // Update both states together to prevent flickering
        setTwinRoomAvailability(availability);
        setLoadingTwinAvailability(false);
        
      } catch (error) {
        // Check if this is still the current request
        if (fetchTwinRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring error for stale Twin room request:', requestId);
          return;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⚠️ Twin room request aborted for:', requestId);
          // Don't update state if request was aborted (new request is in progress)
          return;
        } else {
          console.error('❌ Error fetching Twin room availability:', error);
        }
        
        // On error, assume unavailable for safety
        if (fetchTwinRequestRef.current === requestId) {
          setTwinRoomAvailability({
            bookedBeds: 2,
            availableBeds: 0,
            isFullyBooked: true,
          });
          setLoadingTwinAvailability(false);
        }
      }
    };

    // Call immediately
    fetchTwinRoomAvailability();
    
    // Cleanup: cancel the request if component unmounts or arrivalDate changes
    return () => {
      console.log('🧹 Cleaning up Twin room request:', requestId);
      abortController.abort();
      // Don't clear fetchTwinRequestRef here - let the new request set it
    };
  }, [arrivalDate]);

  // Fetch bed availability for Ayour room - Bigdi (id: "6")
  useEffect(() => {
    if (!arrivalDate) {
      console.log('No arrivalDate, clearing Ayour room availability');
      setAyourRoomAvailability(null);
      setLoadingAyourAvailability(false);
      fetchAyourRequestRef.current = null;
      return;
    }

    const dateParam = arrivalDate.includes('T') 
      ? arrivalDate.split('T')[0] 
      : arrivalDate;
    
    const requestId = `${dateParam}-ayour-${Date.now()}`;
    fetchAyourRequestRef.current = requestId;
    
    console.log('🔄 Fetching Ayour room availability for date:', dateParam, 'Request ID:', requestId);
    
    const abortController = new AbortController();
    setLoadingAyourAvailability(true);
    
    const fetchAyourRoomAvailability = async () => {
      try {
        const timeoutId = setTimeout(() => abortController.abort(), 10000);
        
        const response = await fetch(
          `/api/room-availability?roomId=6&arrivalDate=${dateParam}`,
          { signal: abortController.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (fetchAyourRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response for Ayour room request:', requestId);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch Ayour room availability:', response.status, errorText);
          if (fetchAyourRequestRef.current === requestId) {
            setAyourRoomAvailability({
              bookedBeds: 2,
              availableBeds: 0,
              isFullyBooked: true,
            });
            setLoadingAyourAvailability(false);
          }
          return;
        }
        
        const data = await response.json();
        console.log('📦 Ayour room availability data received for request:', requestId, data);
        
        if (fetchAyourRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response data for Ayour room request:', requestId);
          return;
        }
        
        const availability = {
          bookedBeds: data.bookedBeds || 0,
          availableBeds: data.availableBeds ?? 2,
          isFullyBooked: data.isFullyBooked === true,
        };
        
        console.log('✅ Setting Ayour room availability for request:', requestId, availability);
        setAyourRoomAvailability(availability);
        setLoadingAyourAvailability(false);
        
      } catch (error) {
        if (fetchAyourRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring error for stale Ayour room request:', requestId);
          return;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⚠️ Ayour room request aborted for:', requestId);
          return;
        } else {
          console.error('❌ Error fetching Ayour room availability:', error);
        }
        
        if (fetchAyourRequestRef.current === requestId) {
          setAyourRoomAvailability({
            bookedBeds: 2,
            availableBeds: 0,
            isFullyBooked: true,
          });
          setLoadingAyourAvailability(false);
        }
      }
    };

    fetchAyourRoomAvailability();
    
    return () => {
      console.log('🧹 Cleaning up Ayour room request:', requestId);
      abortController.abort();
    };
  }, [arrivalDate]);

  // Fetch bed availability for Amlal room - Bigdi (id: "8")
  useEffect(() => {
    if (!arrivalDate) {
      console.log('No arrivalDate, clearing Amlal room availability');
      setAmlalRoomAvailability(null);
      setLoadingAmlalAvailability(false);
      fetchAmlalRequestRef.current = null;
      return;
    }

    const dateParam = arrivalDate.includes('T') 
      ? arrivalDate.split('T')[0] 
      : arrivalDate;
    
    const requestId = `${dateParam}-amlal-${Date.now()}`;
    fetchAmlalRequestRef.current = requestId;
    
    console.log('🔄 Fetching Amlal room availability for date:', dateParam, 'Request ID:', requestId);
    
    const abortController = new AbortController();
    setLoadingAmlalAvailability(true);
    
    const fetchAmlalRoomAvailability = async () => {
      try {
        const timeoutId = setTimeout(() => abortController.abort(), 10000);
        
        const response = await fetch(
          `/api/room-availability?roomId=8&arrivalDate=${dateParam}`,
          { signal: abortController.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (fetchAmlalRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response for Amlal room request:', requestId);
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Failed to fetch Amlal room availability:', response.status, errorText);
          if (fetchAmlalRequestRef.current === requestId) {
            setAmlalRoomAvailability({
              bookedBeds: 2,
              availableBeds: 0,
              isFullyBooked: true,
            });
            setLoadingAmlalAvailability(false);
          }
          return;
        }
        
        const data = await response.json();
        console.log('📦 Amlal room availability data received for request:', requestId, data);
        
        if (fetchAmlalRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring stale response data for Amlal room request:', requestId);
          return;
        }
        
        const availability = {
          bookedBeds: data.bookedBeds || 0,
          availableBeds: data.availableBeds ?? 2,
          isFullyBooked: data.isFullyBooked === true,
        };
        
        console.log('✅ Setting Amlal room availability for request:', requestId, availability);
        setAmlalRoomAvailability(availability);
        setLoadingAmlalAvailability(false);
        
      } catch (error) {
        if (fetchAmlalRequestRef.current !== requestId) {
          console.log('⚠️ Ignoring error for stale Amlal room request:', requestId);
          return;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('⚠️ Amlal room request aborted for:', requestId);
          return;
        } else {
          console.error('❌ Error fetching Amlal room availability:', error);
        }
        
        if (fetchAmlalRequestRef.current === requestId) {
          setAmlalRoomAvailability({
            bookedBeds: 2,
            availableBeds: 0,
            isFullyBooked: true,
          });
          setLoadingAmlalAvailability(false);
        }
      }
    };

    fetchAmlalRoomAvailability();
    
    return () => {
      console.log('🧹 Cleaning up Amlal room request:', requestId);
      abortController.abort();
    };
  }, [arrivalDate]);

  // Calculate total assigned people
  const totalAssigned = Object.values(roomAssignments).reduce((sum, n) => sum + n, 0);

  // Helper to update assignments
  const handleChange = (roomId: string, delta: number) => {
    const current = roomAssignments[roomId] || 0;
    let next = { ...roomAssignments };
    
    // Special handling for Triple room (id: "2")
    if (roomId === "2") {
      const isFullyBooked = tripleRoomAvailability?.isFullyBooked || false;
      const availableBeds = tripleRoomAvailability?.availableBeds || 3;
      const maxForTripleRoom = Math.min(availableBeds, 3); // Max 3 beds, but limited by availability
      
      // Prevent changes if room is fully booked
      if (isFullyBooked) {
        return;
      }
      
      if (delta === 1 && totalAssigned < maxPeople && current < maxForTripleRoom) {
        next[roomId] = current + 1;
      } else if (delta === -1 && current > 0) {
        next[roomId] = current - 1;
      }
    } else if (roomId === "4") {
      // Twin room: max based on available beds
      const isFullyBooked = twinRoomAvailability?.isFullyBooked || false;
      const availableBeds = twinRoomAvailability?.availableBeds ?? 2;
      const maxForTwinRoom = Math.min(availableBeds, 2); // Max 2 beds, but limited by availability
      
      // Prevent changes if room is fully booked
      if (isFullyBooked) {
        return;
      }
      
      if (delta === 1 && totalAssigned < maxPeople && current < maxForTwinRoom) {
        next[roomId] = current + 1;
      } else if (delta === -1 && current > 0) {
        next[roomId] = current - 1;
      }
    } else if (roomId === "6") {
      // Ayour room - Bigdi: max based on available beds (2 beds)
      const isFullyBooked = ayourRoomAvailability?.isFullyBooked || false;
      const availableBeds = ayourRoomAvailability?.availableBeds ?? 2;
      const maxForAyourRoom = Math.min(availableBeds, 2); // Max 2 beds, but limited by availability
      
      // Prevent changes if room is fully booked
      if (isFullyBooked) {
        return;
      }
      
      if (delta === 1 && totalAssigned < maxPeople && current < maxForAyourRoom) {
        next[roomId] = current + 1;
      } else if (delta === -1 && current > 0) {
        next[roomId] = current - 1;
      }
    } else if (roomId === "8") {
      // Amlal room - Bigdi: max based on available beds (2 beds)
      const isFullyBooked = amlalRoomAvailability?.isFullyBooked || false;
      const availableBeds = amlalRoomAvailability?.availableBeds ?? 2;
      const maxForAmlalRoom = Math.min(availableBeds, 2); // Max 2 beds, but limited by availability
      
      // Prevent changes if room is fully booked
      if (isFullyBooked) {
        return;
      }
      
      if (delta === 1 && totalAssigned < maxPeople && current < maxForAmlalRoom) {
        next[roomId] = current + 1;
      } else if (delta === -1 && current > 0) {
        next[roomId] = current - 1;
      }
    } else {
      // Other rooms: max 2 people
    if (delta === 1 && totalAssigned < maxPeople && current < 2) {
      next[roomId] = current + 1;
    } else if (delta === -1 && current > 0) {
      next[roomId] = current - 1;
    }
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
        {/* Debug info - remove after testing */}
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 rounded text-sm">
          <strong>Debug Info:</strong><br/>
          Arrival Date: {arrivalDate || 'NOT SET'} | <br/>
          Triple Room (ID 2): {tripleRoomAvailability ? 
            `Booked: ${tripleRoomAvailability.bookedBeds}, Available: ${tripleRoomAvailability.availableBeds}, Fully Booked: ${tripleRoomAvailability.isFullyBooked}` 
            : 'NULL'} | Loading: {loadingAvailability ? 'YES' : 'NO'} | <br/>
          Twin Room (ID 4): {twinRoomAvailability ? 
            `Booked: ${twinRoomAvailability.bookedBeds}, Available: ${twinRoomAvailability.availableBeds}, Fully Booked: ${twinRoomAvailability.isFullyBooked}` 
            : 'NULL'} | Loading: {loadingTwinAvailability ? 'YES' : 'NO'} | <br/>
          Ayour Room (ID 6): {ayourRoomAvailability ? 
            `Booked: ${ayourRoomAvailability.bookedBeds}, Available: ${ayourRoomAvailability.availableBeds}, Fully Booked: ${ayourRoomAvailability.isFullyBooked}` 
            : 'NULL'} | Loading: {loadingAyourAvailability ? 'YES' : 'NO'} | <br/>
          Amlal Room (ID 8): {amlalRoomAvailability ? 
            `Booked: ${amlalRoomAvailability.bookedBeds}, Available: ${amlalRoomAvailability.availableBeds}, Fully Booked: ${amlalRoomAvailability.isFullyBooked}` 
            : 'NULL'} | Loading: {loadingAmlalAvailability ? 'YES' : 'NO'}
        </div>
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
              const isTripleRoom = room.id === "2";
              const isTwinRoom = room.id === "4";
              
              // For Triple room and Twin room, use availability data; for others, default values
              let isFullyBooked = false;
              let availableBeds = 2;
              let maxForRoom = 2;
              let isLoading = false;
              
              if (isTripleRoom) {
                // Only use availability data if it's loaded AND not currently loading
                // This prevents flickering between states
                if (tripleRoomAvailability !== null && !loadingAvailability) {
                  // Data loaded - use actual availability
                  isFullyBooked = tripleRoomAvailability.isFullyBooked === true;
                  availableBeds = tripleRoomAvailability.availableBeds ?? 3;
                  maxForRoom = Math.min(availableBeds, 3);
                } else if (loadingAvailability) {
                  // While loading, show as unavailable with "Checking..." message
                  isFullyBooked = true;
                  availableBeds = 0;
                  maxForRoom = 0;
                  isLoading = true;
                } else {
                  // No data and not loading - initial state (shouldn't happen with arrivalDate)
                  // Default to available but this will update once data loads
                  isFullyBooked = false;
                  availableBeds = 3;
                  maxForRoom = 3;
                }
              } else if (isTwinRoom) {
                // Only use availability data if it's loaded AND not currently loading
                // This prevents flickering between states
                if (twinRoomAvailability !== null && !loadingTwinAvailability) {
                  // Data loaded - use actual availability
                  isFullyBooked = twinRoomAvailability.isFullyBooked === true;
                  availableBeds = twinRoomAvailability.availableBeds ?? 2;
                  maxForRoom = Math.min(availableBeds, 2);
                } else if (loadingTwinAvailability) {
                  // While loading, show as unavailable with "Checking..." message
                  isFullyBooked = true;
                  availableBeds = 0;
                  maxForRoom = 0;
                  isLoading = true;
                } else {
                  // No data and not loading - initial state (shouldn't happen with arrivalDate)
                  // Default to available but this will update once data loads
                  isFullyBooked = false;
                  availableBeds = 2;
                  maxForRoom = 2;
                }
              }
              
              // Debug log for Triple room and Twin room
              if (isTripleRoom) {
                console.log('Triple room rendering:', {
                  availability: tripleRoomAvailability,
                  loading: loadingAvailability,
                  isFullyBooked,
                  availableBeds,
                  maxForRoom,
                });
              } else if (isTwinRoom) {
                console.log('Twin room rendering:', {
                  availability: twinRoomAvailability,
                  loading: loadingTwinAvailability,
                  isFullyBooked,
                  availableBeds,
                  maxForRoom,
                });
              }
              
              return (
                <div key={room.id} className={`bg-white border border-lapoint-border rounded-xl overflow-hidden flex flex-col relative ${(isTripleRoom && loadingAvailability) || (isTwinRoom && loadingTwinAvailability) ? 'opacity-90' : ''}`}>
                  {/* Banner - grey when unavailable, red when available */}
                  <div className={`absolute top-0 left-0 w-full ${isFullyBooked ? 'bg-gray-500' : 'bg-lapoint-red'} text-white text-center py-1 text-[10px] font-semibold z-10 rounded-t-xl`}>
                    {(isTripleRoom && loadingAvailability) || (isTwinRoom && loadingTwinAvailability)
                      ? 'Checking availability...' 
                      : isFullyBooked 
                        ? 'Room not available' 
                        : 'Room is not bookable for 1 person'}
                  </div>
                  {/* Image with low opacity when unavailable or loading */}
                  <Image 
                    src={room.img} 
                    alt={room.name} 
                    width={600} 
                    height={400} 
                    quality={100} 
                    className={`w-full h-56 object-cover ${isFullyBooked || isLoading ? 'opacity-50' : ''}`} 
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-base mb-2">{room.name}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`font-bold ${
                          room.price === 0 && isFullyBooked 
                            ? 'text-gray-500' 
                            : 'text-lapoint-red'
                        }`}>+ EUR {room.price}</div>
                        <div className="text-sm text-gray-600">Number of people</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="bg-white border border-gray-300 text-black px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isFullyBooked || isLoading}
                        >
                          View room
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xl disabled:opacity-50 bg-white disabled:cursor-not-allowed"
                            aria-label="Decrease number of people"
                            onClick={() => handleChange(room.id, -1)}
                            disabled={assigned === 0 || isFullyBooked || isLoading}
                          >
                            –
                          </button>
                          <span className="w-8 text-center font-bold">{assigned}</span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full border border-lapoint-red text-lapoint-red flex items-center justify-center text-xl disabled:opacity-50 bg-white disabled:cursor-not-allowed"
                            aria-label="Increase number of people"
                            onClick={() => handleChange(room.id, 1)}
                            disabled={assigned >= maxForRoom || totalAssigned >= maxPeople || isFullyBooked || isLoading}
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
              const isAyourRoom = room.id === "6";
              const isAmlalRoom = room.id === "8";
              
              // For Ayour room and Amlal room, use availability data; for others, default values
              let isFullyBooked = false;
              let availableBeds = 2;
              let maxForRoom = 2;
              let isLoading = false;
              
              if (isAyourRoom) {
                // Only use availability data if it's loaded AND not currently loading
                if (ayourRoomAvailability !== null && !loadingAyourAvailability) {
                  isFullyBooked = ayourRoomAvailability.isFullyBooked === true;
                  availableBeds = ayourRoomAvailability.availableBeds ?? 2;
                  maxForRoom = Math.min(availableBeds, 2);
                } else if (loadingAyourAvailability) {
                  isFullyBooked = true;
                  availableBeds = 0;
                  maxForRoom = 0;
                  isLoading = true;
                } else {
                  isFullyBooked = false;
                  availableBeds = 2;
                  maxForRoom = 2;
                }
              } else if (isAmlalRoom) {
                // Only use availability data if it's loaded AND not currently loading
                if (amlalRoomAvailability !== null && !loadingAmlalAvailability) {
                  isFullyBooked = amlalRoomAvailability.isFullyBooked === true;
                  availableBeds = amlalRoomAvailability.availableBeds ?? 2;
                  maxForRoom = Math.min(availableBeds, 2);
                } else if (loadingAmlalAvailability) {
                  isFullyBooked = true;
                  availableBeds = 0;
                  maxForRoom = 0;
                  isLoading = true;
                } else {
                  isFullyBooked = false;
                  availableBeds = 2;
                  maxForRoom = 2;
                }
              }
              
              // Debug log for Ayour room and Amlal room
              if (isAyourRoom) {
                console.log('Ayour room rendering:', {
                  availability: ayourRoomAvailability,
                  loading: loadingAyourAvailability,
                  isFullyBooked,
                  availableBeds,
                  maxForRoom,
                });
              } else if (isAmlalRoom) {
                console.log('Amlal room rendering:', {
                  availability: amlalRoomAvailability,
                  loading: loadingAmlalAvailability,
                  isFullyBooked,
                  availableBeds,
                  maxForRoom,
                });
              }
              
              return (
                <div key={room.id} className={`bg-white border border-lapoint-border rounded-xl overflow-hidden flex flex-col relative ${(isAyourRoom && loadingAyourAvailability) || (isAmlalRoom && loadingAmlalAvailability) ? 'opacity-90' : ''}`}>
                  {/* Banner - grey when unavailable, red when available */}
                  <div className={`absolute top-0 left-0 w-full ${isFullyBooked ? 'bg-gray-500' : 'bg-lapoint-red'} text-white text-center py-1 text-[10px] font-semibold z-10 rounded-t-xl`}>
                    {(isAyourRoom && loadingAyourAvailability) || (isAmlalRoom && loadingAmlalAvailability)
                      ? 'Checking availability...' 
                      : isFullyBooked 
                        ? 'Room not available' 
                        : 'Room is not bookable for 1 person'}
                  </div>
                  {/* Image with low opacity when unavailable or loading */}
                  <Image 
                    src={room.img} 
                    alt={room.name} 
                    width={600} 
                    height={400} 
                    quality={100} 
                    className={`w-full h-56 object-cover ${isFullyBooked || isLoading ? 'opacity-50' : ''}`} 
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-base mb-2">{room.name}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`font-bold ${
                          room.price === 0 && isFullyBooked 
                            ? 'text-gray-500' 
                            : 'text-lapoint-red'
                        }`}>+ EUR {room.price}</div>
                        <div className="text-sm text-gray-600">Number of people</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="bg-white border border-gray-300 text-black px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isFullyBooked || isLoading}
                        >
                          View room
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                      <button
                        type="button"
                            className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 flex items-center justify-center text-xl disabled:opacity-50 bg-white disabled:cursor-not-allowed"
                        aria-label="Decrease number of people"
                        onClick={() => handleChange(room.id, -1)}
                            disabled={assigned === 0 || isFullyBooked || isLoading}
                      >
                        –
                      </button>
                      <span className="w-8 text-center font-bold">{assigned}</span>
                      <button
                        type="button"
                            className="w-8 h-8 rounded-full border border-lapoint-red text-lapoint-red flex items-center justify-center text-xl disabled:opacity-50 bg-white disabled:cursor-not-allowed"
                        aria-label="Increase number of people"
                        onClick={() => handleChange(room.id, 1)}
                            disabled={assigned >= maxForRoom || totalAssigned >= maxPeople || isFullyBooked || isLoading}
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