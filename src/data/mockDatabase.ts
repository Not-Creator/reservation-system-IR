export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
}

export interface TrainClassInfo {
  classCode: string;
  className: string;
  totalSeats: number;
  baseFare: number;
}

export interface Train {
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destCode: string;
  departureTime: string;
  arrivalTime: string;
  distanceKm: number;
  duration: string;
  runsOn: string[];
  classes: TrainClassInfo[];
}

export interface SeatInventory {
  trainNumber: string;
  classCode: string;
  date: string; // YYYY-MM-DD
  available: number;
  rac: number;
  wl: number;
  statusText: string;
  statusCode: 'AVL' | 'RAC' | 'WL';
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'TRANSGENDER';
  berthPreference: string;
  allocatedCoach?: string;
  allocatedBerth?: string;
  berthType?: string;
  status: 'CNF' | 'RAC' | 'WL';
}

export interface BookingRecord {
  id: number;
  pnr: string;
  userId: number;
  userName: string;
  trainNumber: string;
  trainName: string;
  sourceCode: string;
  destCode: string;
  journeyDate: string;
  classCode: string;
  departureTime: string;
  arrivalTime: string;
  passengers: Passenger[];
  totalFare: number;
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLISTED' | 'CANCELLED';
  paymentId: string;
  bookingDate: string;
  refundAmount?: number;
}

export const INITIAL_STATIONS: Station[] = [
  { code: 'NDLS', name: 'New Delhi Railway Station', city: 'New Delhi', state: 'Delhi' },
  { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'HWH',  name: 'Howrah Junction', city: 'Kolkata', state: 'West Bengal' },
  { code: 'SBC',  name: 'KSR Bengaluru City Junction', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'MAS',  name: 'MGR Chennai Central', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'PNBE', name: 'Patna Junction', city: 'Patna', state: 'Bihar' },
  { code: 'ADI',  name: 'Ahmedabad Junction', city: 'Ahmedabad', state: 'Gujarat' },
  { code: 'CNB',  name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh' },
];

export const INITIAL_TRAINS: Train[] = [
  {
    trainNumber: '12952',
    trainName: 'MUMBAI TEJAS RAJDHANI',
    sourceCode: 'NDLS',
    destCode: 'CSMT',
    departureTime: '16:55',
    arrivalTime: '08:35',
    distanceKm: 1384,
    duration: '15h 40m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { classCode: '1A', className: 'AC First Class', totalSeats: 24, baseFare: 4850 },
      { classCode: '2A', className: 'AC 2-Tier', totalSeats: 54, baseFare: 2920 },
      { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 2090 },
    ],
  },
  {
    trainNumber: '12951',
    trainName: 'MUMBAI RAJDHANI EXPRESS',
    sourceCode: 'CSMT',
    destCode: 'NDLS',
    departureTime: '17:00',
    arrivalTime: '08:32',
    distanceKm: 1384,
    duration: '15h 32m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { classCode: '1A', className: 'AC First Class', totalSeats: 24, baseFare: 4850 },
      { classCode: '2A', className: 'AC 2-Tier', totalSeats: 54, baseFare: 2920 },
      { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 2090 },
    ],
  },
  {
    trainNumber: '12301',
    trainName: 'HOWRAH RAJDHANI EXPRESS',
    sourceCode: 'HWH',
    destCode: 'NDLS',
    departureTime: '16:50',
    arrivalTime: '10:05',
    distanceKm: 1451,
    duration: '17h 15m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { classCode: '1A', className: 'AC First Class', totalSeats: 24, baseFare: 4920 },
      { classCode: '2A', className: 'AC 2-Tier', totalSeats: 54, baseFare: 2980 },
      { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 2140 },
    ],
  },
  {
    trainNumber: '12302',
    trainName: 'NEW DELHI - HOWRAH RAJDHANI',
    sourceCode: 'NDLS',
    destCode: 'HWH',
    departureTime: '16:55',
    arrivalTime: '09:55',
    distanceKm: 1451,
    duration: '17h 00m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { classCode: '1A', className: 'AC First Class', totalSeats: 24, baseFare: 4920 },
      { classCode: '2A', className: 'AC 2-Tier', totalSeats: 54, baseFare: 2980 },
      { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 2140 },
    ],
  },
  {
    trainNumber: '12622',
    trainName: 'TAMIL NADU SUPERFAST EXP',
    sourceCode: 'NDLS',
    destCode: 'MAS',
    departureTime: '21:05',
    arrivalTime: '06:35',
    distanceKm: 2182,
    duration: '33h 30m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    classes: [
      { classCode: '2A', className: 'AC 2-Tier', totalSeats: 48, baseFare: 3210 },
      { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 2240 },
      { classCode: 'SL', className: 'Sleeper Class', totalSeats: 120, baseFare: 840 },
    ],
  },
  {
    trainNumber: '12009',
    trainName: 'MUMBAI - AHMEDABAD SHATABDI',
    sourceCode: 'CSMT',
    destCode: 'ADI',
    departureTime: '06:20',
    arrivalTime: '12:45',
    distanceKm: 493,
    duration: '06h 25m',
    runsOn: ['M', 'T', 'W', 'T', 'F', 'S'],
    classes: [
      { classCode: 'EC', className: 'Executive Anubhuti CC', totalSeats: 46, baseFare: 2190 },
      { classCode: 'CC', className: 'AC Chair Car', totalSeats: 78, baseFare: 1145 },
    ],
  },
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 1,
    pnr: '2849173021',
    userId: 2,
    userName: 'Rahul Sharma',
    trainNumber: '12952',
    trainName: 'MUMBAI TEJAS RAJDHANI',
    sourceCode: 'NDLS',
    destCode: 'CSMT',
    journeyDate: '2026-10-23',
    classCode: '3A',
    departureTime: '16:55',
    arrivalTime: '08:35',
    totalFare: 4180,
    bookingStatus: 'CONFIRMED',
    paymentId: 'TXN_IRCTC_992182',
    bookingDate: '2026-10-20 18:30:14',
    passengers: [
      {
        name: 'Rahul Sharma',
        age: 26,
        gender: 'MALE',
        berthPreference: 'LOWER',
        allocatedCoach: 'B4',
        allocatedBerth: '21',
        berthType: 'LOWER',
        status: 'CNF',
      },
      {
        name: 'Priya Sharma',
        age: 24,
        gender: 'FEMALE',
        berthPreference: 'MIDDLE',
        allocatedCoach: 'B4',
        allocatedBerth: '22',
        berthType: 'MIDDLE',
        status: 'CNF',
      },
    ],
  },
  {
    id: 2,
    pnr: '6148291045',
    userId: 2,
    userName: 'Rahul Sharma',
    trainNumber: '12301',
    trainName: 'HOWRAH RAJDHANI EXPRESS',
    sourceCode: 'HWH',
    destCode: 'NDLS',
    journeyDate: '2026-10-25',
    classCode: '2A',
    departureTime: '16:50',
    arrivalTime: '10:05',
    totalFare: 2980,
    bookingStatus: 'CONFIRMED',
    paymentId: 'TXN_IRCTC_441092',
    bookingDate: '2026-10-18 11:15:00',
    passengers: [
      {
        name: 'Amit Patel',
        age: 32,
        gender: 'MALE',
        berthPreference: 'UPPER',
        allocatedCoach: 'A2',
        allocatedBerth: '14',
        berthType: 'UPPER',
        status: 'CNF',
      },
    ],
  },
];
