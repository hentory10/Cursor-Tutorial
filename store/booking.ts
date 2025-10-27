import { create } from 'zustand';

type Package = { id: string; name: string; description: string; price: number; levels: string[] };
type Room = { id: string; name: string; description: string; price: number; capacity: number };
type AddOn = { id: string; name: string; price: number; type: string; img: string; description: string };
type Traveller = { name: string };

type State = {
  destinations: { id: string; name: string }[];
  packages: Package[];
  rooms: Room[];
  addOns: AddOn[];
  selectedPackage: Package | null;
  surfLevel: string;
  setSurfLevel: (level: string) => void;
  setPackage: (id: string) => void;
  arrivalDate: string;
  setArrivalDate: (date: string) => void;
  selectedRoom: Room | null;
  setRoom: (id: string) => void;
  people: number;
  setPeople: (n: number) => void;
  travellers: Traveller[];
  setTraveller: (i: number, t: Traveller) => void;
  selectedAddOns: string[];
  toggleAddOn: (id: string) => void;
  insurance: boolean;
  setInsurance: (v: boolean) => void;
  paymentType: 'deposit' | 'full';
  setPaymentType: (t: 'deposit' | 'full') => void;
  forceFullPayment: boolean;
  summary: { subtotal: number; insurance: number; total: number };
  reset: () => void;
  duration: string;
  setDuration: (d: string) => void;
  roomAssignments: Record<string, number>;
  setRoomAssignments: (assignments: Record<string, number>) => void;
  addOnCounts: Record<string, number>;
  setAddOnCount: (id: string, count: number) => void;
  clearRoomData: () => void;
  clearAddOnData: () => void;
  clearTravellerData: () => void;
  clearDateData: () => void;
};

export const useStore = create<State>((set, get) => ({
  destinations: [{ id: '1', name: 'Bali' }],
  packages: [
    { id: '1', name: 'Beginner Bliss', description: 'Perfect for first-timers.', price: 600, levels: ['beginner'] },
    { id: '2', name: 'Intermediate Escape', description: 'For those ready to progress.', price: 800, levels: ['intermediate', 'advanced'] },
    { id: '3', name: 'Advanced Adventure', description: 'Chase the biggest waves.', price: 1000, levels: ['advanced'] },
  ],
  rooms: [
    { id: '1', name: 'Room A1 - MoonLight', description: 'Room A1 in MoonLight.', price: 50, capacity: 2, img: '/images/room1.jpg' },
    { id: '2', name: 'Room A2 - MoonLight', description: 'Room A2 in MoonLight.', price: 0, capacity: 2, img: '/images/room2.jpg' },
    { id: '3', name: 'Room B1 - MoonLight', description: 'Room B1 in MoonLight.', price: 0, capacity: 2, img: '/images/room3.jpg' },
    { id: '4', name: 'Room B2 - MoonLight', description: 'Room B2 in MoonLight.', price: 0, capacity: 2, img: '/images/room4.jpg' },
    { id: '5', name: 'Room C1 - MoonLight', description: 'Room C1 in MoonLight.', price: 0, capacity: 2, img: '/images/room5.jpg' },
    { id: '6', name: 'Room C2 - MoonLight', description: 'Room C2 in MoonLight.', price: 0, capacity: 2, img: '/images/room6.jpg' },
  ],
  addOns: [
    { id: '1', name: 'Transfer 1 person 1 way from DPS airport', price: 22, type: 'per-person', img: '/images/IM.jpg', description: 'Transfer from DPS airport to camp. Price per person. View more.' },
    { id: '2', name: 'Cancellation Insurance', price: 15, type: 'per-booking', img: '/images/IM.jpg', description: 'Cancellation insurance covers your booking. Terms & Conditions.' },
  ],
  selectedPackage: null,
  surfLevel: '',
  setSurfLevel: (level) => set({ surfLevel: level }),
  setPackage: (id) => set(state => ({ selectedPackage: state.packages.find(p => p.id === id) || null })),
  arrivalDate: '',
  setArrivalDate: (date) => set({ arrivalDate: date }),
  selectedRoom: null,
  setRoom: (id) => set(state => ({ selectedRoom: state.rooms.find(r => r.id === id) || null })),
  people: 1,
  setPeople: (n) => set({ people: n }),
  travellers: [{ name: '' }],
  setTraveller: (i, t) => set(state => {
    const arr = [...state.travellers];
    arr[i] = t;
    return { travellers: arr };
  }),
  selectedAddOns: [],
  toggleAddOn: (id) => set(state => ({
    selectedAddOns: state.selectedAddOns.includes(id)
      ? state.selectedAddOns.filter(a => a !== id)
      : [...state.selectedAddOns, id],
  })),
  insurance: false,
  setInsurance: (v) => set({ insurance: v }),
  paymentType: 'deposit',
  setPaymentType: (t) => set({ paymentType: t }),
  forceFullPayment: false,
  summary: { subtotal: 0, insurance: 0, total: 0 },
  reset: () => set({
    selectedPackage: null,
    surfLevel: '',
    arrivalDate: '',
    selectedRoom: null,
    people: 1,
    travellers: [{ name: '' }],
    selectedAddOns: [],
    insurance: false,
    paymentType: 'deposit',
    forceFullPayment: false,
    summary: { subtotal: 0, insurance: 0, total: 0 },
  }),
  duration: '1w',
  setDuration: (d) => set({ duration: d }),
  roomAssignments: {},
  setRoomAssignments: (assignments) => set({ roomAssignments: assignments }),
  addOnCounts: {},
  setAddOnCount: (id, count) => set(state => {
    const next = { ...state.addOnCounts, [id]: count };
    // Remove from selectedAddOns if count is 0
    let selectedAddOns = state.selectedAddOns;
    if (count === 0) {
      selectedAddOns = selectedAddOns.filter(a => a !== id);
    } else if (!selectedAddOns.includes(id)) {
      selectedAddOns = [...selectedAddOns, id];
    }
    return { addOnCounts: next, selectedAddOns };
  }),
  clearRoomData: () => set({ selectedRoom: null, roomAssignments: {} }),
  clearAddOnData: () => set({ selectedAddOns: [], addOnCounts: {} }),
  clearTravellerData: () => set({ travellers: [{ name: '' }] }),
  clearDateData: () => set({ arrivalDate: '' }),
}));

// Price calculation and forceFullPayment logic
useStore.subscribe((state) => {
  const pkg = state.selectedPackage;
  const room = state.selectedRoom;
  // const nights = 7;
  let subtotal = 0;
  if (pkg) subtotal += pkg.price * state.people;
  if (room) subtotal += room.price * state.people;
  subtotal += state.addOns.reduce((sum, addOn) => {
    if (addOn.type === 'per-person') {
      const count = state.addOnCounts[addOn.id] || 0;
      return sum + addOn.price * count;
    } else if (addOn.type === 'per-booking' && state.selectedAddOns.includes(addOn.id)) {
      return sum + addOn.price;
    }
    return sum;
  }, 0);
  let insurance = state.insurance ? Math.round(subtotal * 0.15) : 0;
  let total = subtotal + insurance;
  // if (state.paymentType === 'deposit' && !state.forceFullPayment) {
  //   total = Math.round(total * 0.25);
  // }
  // Force full payment if arrivalDate <= 35 days from today
  let forceFull = false;
  if (state.arrivalDate) {
    const arrival = new Date(state.arrivalDate);
    const now = new Date();
    const diff = (arrival.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 35) forceFull = true;
  }

  // Only update if values have changed
  const { summary, forceFullPayment, paymentType } = state;
  if (
    summary.subtotal !== subtotal ||
    summary.insurance !== insurance ||
    summary.total !== total ||
    forceFullPayment !== forceFull ||
    paymentType !== (forceFull ? 'full' : state.paymentType)
  ) {
    useStore.setState({
      summary: { subtotal, insurance, total },
      forceFullPayment: forceFull,
      paymentType: forceFull ? 'full' : state.paymentType,
    });
  }
}); 