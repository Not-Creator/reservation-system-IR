import React, { useState, useEffect } from 'react';
import {
  Train as TrainIcon,
  Search,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  XCircle,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import {
  Station,
  Train,
  BookingRecord,
  Passenger,
  INITIAL_STATIONS,
  INITIAL_TRAINS,
  INITIAL_BOOKINGS
} from './data/mockDatabase';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'search' | 'results' | 'passenger' | 'payment' | 'ticket' | 'my-bookings' | 'admin' | 'chart' | 'login'>('search');
  
  // Authenticated User Session (Simulating HttpServletRequest session)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; role: 'USER' | 'ADMIN' } | null>({
    id: 2,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    role: 'USER'
  });

  // Login form state (login.jsp simulation)
  const [loginEmail, setLoginEmail] = useState<string>('rahul.sharma@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('User@123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string>('search');
  
  // Current role based on session
  const userRole = currentUser ? currentUser.role : 'USER';
  
  // Clock state (24-hour IST format)
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Database state
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [trains, setTrains] = useState<Train[]>(INITIAL_TRAINS);
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);

  // Search parameters
  const [sourceCode, setSourceCode] = useState<string>('NDLS');
  const [destCode, setDestCode] = useState<string>('CSMT');
  const [journeyDate, setJourneyDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [quota, setQuota] = useState<string>('GN'); // GN, TQ, LD

  // Search results
  const [filteredTrains, setFilteredTrains] = useState<Train[]>([]);
  const [expandedTrainRoute, setExpandedTrainRoute] = useState<string | null>(null);

  // Current booking flow state
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('3A');
  const [selectedClassFare, setSelectedClassFare] = useState<number>(2090);
  const [passengerList, setPassengerList] = useState<Passenger[]>([
    { name: 'Rahul Sharma', age: 26, gender: 'MALE', berthPreference: 'LOWER', status: 'CNF' }
  ]);
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(INITIAL_BOOKINGS[0]);
  const [pnrSearchInput, setPnrSearchInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'NET_BANKING' | 'CARDS'>('UPI');
  const [upiId, setUpiId] = useState<string>('rahulsharma@oksbi');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);


  // Cancellation Modal state
  const [cancellingBooking, setCancellingBooking] = useState<BookingRecord | null>(null);
  const [cancellationNotice, setCancellationNotice] = useState<string | null>(null);

  // Admin train form state
  const [newTrainNumber, setNewTrainNumber] = useState('');
  const [newTrainName, setNewTrainName] = useState('');
  const [newTrainSource, setNewTrainSource] = useState('NDLS');
  const [newTrainDest, setNewTrainDest] = useState('HWH');
  const [newDepTime, setNewDepTime] = useState('17:15');
  const [newArrTime, setNewArrTime] = useState('09:45');
  const [newDistance, setNewDistance] = useState('1450');

  // Swap Source and Destination
  const handleSwapStations = () => {
    const temp = sourceCode;
    setSourceCode(destCode);
    setDestCode(temp);
  };

  // Perform Train Search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (sourceCode === destCode) {
      alert('Source and Destination station cannot be the same!');
      return;
    }
    const results = trains.filter(t => t.sourceCode === sourceCode && t.destCode === destCode);
    setFilteredTrains(results);
    setActiveTab('results');
  };

  // Initialize search results on first load
  useEffect(() => {
    const defaultResults = trains.filter(t => t.sourceCode === 'NDLS' && t.destCode === 'CSMT');
    setFilteredTrains(defaultResults);
  }, [trains]);

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    // 1. Empty validation
    if (!email || !password) {
      setLoginError('Email and password are required.');
      return;
    }

    // 2. Verify credentials (simulating AuthService.login with BCrypt.checkpw)
    if (email === 'admin@railnet.gov.in' && password === 'Admin@123') {
      setCurrentUser({
        id: 1,
        name: 'PRS Chief Controller',
        email: 'admin@railnet.gov.in',
        role: 'ADMIN'
      });
      setActiveTab('admin');
      return;
    }

    if (email === 'rahul.sharma@gmail.com' && password === 'User@123') {
      setCurrentUser({
        id: 2,
        name: 'Rahul Sharma',
        email: 'rahul.sharma@gmail.com',
        role: 'USER'
      });
      setActiveTab((redirectAfterLogin as any) || 'search');
      return;
    }

    if (email === 'priya.patel@gmail.com' && password === 'User@123') {
      setCurrentUser({
        id: 3,
        name: 'Priya Patel',
        email: 'priya.patel@gmail.com',
        role: 'USER'
      });
      setActiveTab((redirectAfterLogin as any) || 'search');
      return;
    }

    // Uniform error message to prevent account enumeration
    setLoginError('Invalid email or password.');
  };

  // Handle Logout (simulating LogoutServlet session.invalidate())
  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setLoginError(null);
    setActiveTab('login');
  };

  // Handle Class Selection (with AuthFilter check)
  const handleSelectClass = (train: Train, classCode: string, fare: number) => {
    setSelectedTrain(train);
    setSelectedClass(classCode);
    setSelectedClassFare(fare);
    
    // AuthFilter simulation: redirect to login if session has no user
    if (!currentUser) {
      setRedirectAfterLogin('passenger');
      setActiveTab('login');
      return;
    }

    setActiveTab('passenger');
  };

  // Passenger list modifications
  const handleAddPassenger = () => {
    if (passengerList.length >= 6) {
      alert('Maximum 6 passengers allowed per booking under IRCTC rules.');
      return;
    }
    setPassengerList([
      ...passengerList,
      { name: '', age: 25, gender: 'MALE', berthPreference: 'NO_PREFERENCE', status: 'CNF' }
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengerList.length === 1) return;
    setPassengerList(passengerList.filter((_, i) => i !== index));
  };

  const handleUpdatePassenger = (index: number, field: keyof Passenger, value: any) => {
    const updated = [...passengerList];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerList(updated);
  };

  // Total Fare computation
  const totalBaseFare = passengerList.length * selectedClassFare;
  const irctcConvenienceFee = selectedClass.includes('A') || selectedClass.includes('E') ? 35.40 : 17.70;
  const grandTotal = totalBaseFare + irctcConvenienceFee;

  // Complete Booking
  const handleConfirmPaymentAndBook = () => {
    if (!selectedTrain) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      // Generate authentic 10-digit PNR (e.g. 284917xxxx)
      const randomPNR = '28' + Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);
      const coaches = selectedClass === '1A' ? ['H1'] : selectedClass === '2A' ? ['A1', 'A2'] : selectedClass === '3A' ? ['B1', 'B2', 'B3', 'B4'] : ['S1', 'S2', 'S3', 'S4'];
      
      const allocatedPassengers: Passenger[] = passengerList.map((p, idx) => {
        const coach = coaches[idx % coaches.length];
        const berthNumber = (12 + idx * 7).toString();
        const berthType = p.berthPreference !== 'NO_PREFERENCE' ? p.berthPreference : (idx % 2 === 0 ? 'LOWER' : 'MIDDLE');
        return {
          ...p,
          allocatedCoach: coach,
          allocatedBerth: berthNumber,
          berthType: berthType,
          status: 'CNF'
        };
      });

      const newBooking: BookingRecord = {
        id: bookings.length + 1,
        pnr: randomPNR,
        userId: userRole === 'ADMIN' ? 1 : 2,
        userName: userRole === 'ADMIN' ? 'Chief Controller' : passengerList[0].name || 'Rahul Sharma',
        trainNumber: selectedTrain.trainNumber,
        trainName: selectedTrain.trainName,
        sourceCode: selectedTrain.sourceCode,
        destCode: selectedTrain.destCode,
        journeyDate: journeyDate,
        classCode: selectedClass,
        departureTime: selectedTrain.departureTime,
        arrivalTime: selectedTrain.arrivalTime,
        passengers: allocatedPassengers,
        totalFare: grandTotal,
        bookingStatus: 'CONFIRMED',
        paymentId: 'TXN_' + Date.now().toString().slice(-8),
        bookingDate: new Date().toISOString().replace('T', ' ').slice(0, 19)
      };

      setBookings([newBooking, ...bookings]);
      setLatestBooking(newBooking);
      setActiveTab('ticket');
    }, 1200);
  };

  // Handle Cancellation Calculation
  const handleCancelTicket = (booking: BookingRecord) => {
    // IRCTC cancellation rule demo calculation
    const deduction = booking.classCode === '1A' ? 240 * booking.passengers.length :
                      booking.classCode === '2A' ? 200 * booking.passengers.length :
                      booking.classCode === '3A' ? 180 * booking.passengers.length :
                      120 * booking.passengers.length;
    const refund = Math.max(0, booking.totalFare - deduction);

    const updated = bookings.map(b => {
      if (b.id === booking.id) {
        return {
          ...b,
          bookingStatus: 'CANCELLED' as const,
          refundAmount: refund,
          passengers: b.passengers.map(p => ({ ...p, status: 'WL' as const }))
        };
      }
      return b;
    });

    setBookings(updated);
    setCancellationNotice(`PNR ${booking.pnr} successfully cancelled. Standard cancellation charge: ₹${deduction.toFixed(2)}. Refund amount: ₹${refund.toFixed(2)} will be credited back via original payment mode.`);
    setCancellingBooking(null);
  };

  // Admin add train
  const handleAdminAddTrain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrainNumber || !newTrainName) {
      alert('Please fill train number and name');
      return;
    }
    const newTrain: Train = {
      trainNumber: newTrainNumber.trim(),
      trainName: newTrainName.toUpperCase().trim(),
      sourceCode: newTrainSource,
      destCode: newTrainDest,
      departureTime: newDepTime,
      arrivalTime: newArrTime,
      distanceKm: parseInt(newDistance) || 1000,
      duration: '16h 30m',
      runsOn: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      classes: [
        { classCode: '2A', className: 'AC 2-Tier', totalSeats: 48, baseFare: 2600 },
        { classCode: '3A', className: 'AC 3-Tier', totalSeats: 72, baseFare: 1850 },
        { classCode: 'SL', className: 'Sleeper', totalSeats: 120, baseFare: 680 }
      ]
    };
    setTrains([...trains, newTrain]);
    setNewTrainNumber('');
    setNewTrainName('');
    alert(`Train ${newTrain.trainNumber} - ${newTrain.trainName} added to PRS master database successfully!`);
  };

  const handleAdminDeleteTrain = (trainNo: string) => {
    if (confirm(`Are you sure you want to delete Train ${trainNo} from active schedule?`)) {
      setTrains(trains.filter(t => t.trainNumber !== trainNo));
    }
  };



  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col text-sm antialiased selection:bg-[#0F2C59] selection:text-white">
      {/* Top Ministry / Institutional Utility Bar */}
      <header className="bg-[#0F2C59] text-white border-b border-[#081A35] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & National Transit Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-[#0F2C59] rounded flex items-center justify-center font-bold text-lg shadow-inner">
              <TrainIcon className="w-5 h-5 text-[#0F2C59]" />
            </div>
            <div>
              <div className="text-[10px] tracking-wider uppercase text-slate-300 font-semibold leading-tight">
                Government of India • Ministry of Railways
              </div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Indian Railways PRS Portal <span className="text-[11px] font-normal px-1.5 py-0.5 bg-[#B91C1C] rounded text-white font-mono-num">CRIS-STD-v2.4</span>
              </h1>
            </div>
          </div>

          {/* Time & Role Controls */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 bg-[#081A35] px-2.5 py-1 rounded border border-slate-700 font-mono-num text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>IST: {currentTime || '24:00:00'}</span>
            </div>

            {/* Session Auth State Display */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-[#081A35] px-2.5 py-1 rounded border border-slate-700">
                  <span className="text-[11px] text-slate-300">
                    Welcome, <strong className="text-white">{currentUser.name}</strong>{' '}
                    <span className="text-[10px] text-amber-300">({currentUser.role})</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-[11px] font-bold underline ml-1"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setRedirectAfterLogin('search'); setActiveTab('login'); }}
                  className="px-3 py-1 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded flex items-center gap-1 shadow-xs"
                >
                  <User className="w-3.5 h-3.5" /> Sign In / Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dense Functional Navigation Ribbon */}
        <div className="bg-[#1E3A8A] text-white px-4 border-t border-blue-900/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto text-xs py-1">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('search')}
                className={`px-3 py-1.5 font-semibold rounded-xs border-b-2 transition-colors ${
                  activeTab === 'search' || activeTab === 'results' ? 'border-amber-400 text-white bg-blue-900/60' : 'border-transparent text-blue-100 hover:bg-blue-800'
                }`}
              >
                Book Ticket / Search
              </button>
              <button
                onClick={() => {
                  if (!currentUser) {
                    setRedirectAfterLogin('my-bookings');
                    setActiveTab('login');
                  } else {
                    setActiveTab('my-bookings');
                  }
                }}
                className={`px-3 py-1.5 font-semibold rounded-xs border-b-2 transition-colors ${
                  activeTab === 'my-bookings' ? 'border-amber-400 text-white bg-blue-900/60' : 'border-transparent text-blue-100 hover:bg-blue-800'
                }`}
              >
                My Bookings & Cancellation ({bookings.filter(b => b.bookingStatus !== 'CANCELLED').length})
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 font-semibold rounded-xs border-b-2 transition-colors ${
                  activeTab === 'chart' ? 'border-amber-400 text-white bg-blue-900/60' : 'border-transparent text-blue-100 hover:bg-blue-800'
                }`}
              >
                Reservation Chart (Form E-1)
              </button>
              {userRole === 'ADMIN' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 font-semibold rounded-xs border-b-2 transition-colors ${
                    activeTab === 'admin' ? 'border-amber-400 text-white bg-blue-900/60' : 'border-transparent text-blue-100 hover:bg-blue-800'
                  }`}
                >
                  Admin Master Console
                </button>
              )}
              {activeTab === 'login' && (
                <button
                  className="px-3 py-1.5 font-semibold rounded-xs border-b-2 border-amber-400 text-white bg-blue-900/60"
                >
                  User Login (login.jsp)
                </button>
              )}
            </div>

            {/* Right side status / security tag */}
            <div className="flex items-center gap-2 text-slate-200 text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono-num">PRS Engine: Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">

        {/* Cancellation Notice Alert */}
        {cancellationNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{cancellationNotice}</span>
            </div>
            <button onClick={() => setCancellationNotice(null)} className="text-emerald-700 hover:text-emerald-900 font-bold ml-2">
              Dismiss
            </button>
          </div>
        )}

        {/* LOGIN SCREEN (login.jsp simulation) */}
        {activeTab === 'login' && (
          <div className="py-6 flex flex-col items-center">
            {/* Narrow Centered Form Box (max-w-[380px]) with 1px Solid Border */}
            <div className="w-full max-w-[380px] bg-white border border-[#CBD5E1] rounded shadow-xs overflow-hidden">
              <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#0F2C59]" />
                  <h2 className="font-bold text-xs text-[#0F2C59] uppercase tracking-wide">
                    User Login • IRCTC PRS
                  </h2>
                </div>
                <span className="text-[10px] text-slate-500 font-mono-num">SECURE_AUTH</span>
              </div>

              <div className="p-6">
                {/* Error Message Alert */}
                {loginError && (
                  <div className="mb-4 p-2.5 bg-red-50 border border-red-300 rounded text-xs text-[#B91C1C] font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#B91C1C]" />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5" htmlFor="login-email">
                      Registered Email Address
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-9 px-3 bg-white border border-[#94A3B8] rounded text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5" htmlFor="login-password">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full h-9 px-3 bg-white border border-[#94A3B8] rounded text-xs text-slate-900 focus:outline-hidden focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-9 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-xs"
                    >
                      Secure Sign In
                    </button>
                  </div>
                </form>

                <div className="mt-4 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-500">
                  New to PRS?{' '}
                  <button
                    onClick={() => alert('Registration feature will be built in the next step!')}
                    className="text-[#0F2C59] font-bold hover:underline"
                  >
                    Register for an Account
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Credentials Helper for Testing */}
            <div className="mt-4 w-full max-w-[380px] p-3 bg-slate-100 border border-dashed border-slate-400 rounded text-xs text-slate-600 space-y-1.5">
              <div className="font-bold text-[11px] text-slate-800 uppercase">Test Credentials:</div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700">Passenger:</span>{' '}
                  <code className="text-[11px] font-mono-num text-blue-900">rahul.sharma@gmail.com</code> / <code className="text-[11px] font-mono-num">User@123</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('rahul.sharma@gmail.com');
                    setLoginPassword('User@123');
                    setLoginError(null);
                  }}
                  className="px-2 py-0.5 bg-white border border-slate-300 text-[10px] font-bold rounded hover:bg-slate-50"
                >
                  Fill
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-700">PRS Admin:</span>{' '}
                  <code className="text-[11px] font-mono-num text-red-900">admin@railnet.gov.in</code> / <code className="text-[11px] font-mono-num">Admin@123</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@railnet.gov.in');
                    setLoginPassword('Admin@123');
                    setLoginError(null);
                  }}
                  className="px-2 py-0.5 bg-white border border-slate-300 text-[10px] font-bold rounded hover:bg-slate-50"
                >
                  Fill
                </button>
              </div>

              <div className="pt-1 text-[10px] text-slate-500">
                • Try typing wrong password or empty fields to verify error messages and validation!
              </div>
            </div>
          </div>
        )}

        {/* TAB 1 & 2: SEARCH & RESULTS */}
        {(activeTab === 'search' || activeTab === 'results') && (
          <div className="space-y-4">
            {/* Search Box Card */}
            <section className="bg-white border border-[#CBD5E1] rounded shadow-xs p-4">
              <div className="border-b border-[#E2E8F0] pb-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#0F2C59]" />
                  <h2 className="font-bold text-[#0F2C59] text-sm uppercase tracking-wide">
                    Search Trains Between Stations
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <span>Quota:</span>
                  <div className="inline-flex rounded border border-slate-300 overflow-hidden text-xs">
                    {(['GN', 'TQ', 'LD'] as const).map(q => (
                      <button
                        key={q}
                        onClick={() => setQuota(q)}
                        className={`px-2 py-0.5 font-semibold text-[11px] ${
                          quota === q ? 'bg-[#0F2C59] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {q === 'GN' ? 'General (GN)' : q === 'TQ' ? 'Tatkal (TQ)' : 'Ladies (LD)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* From Station */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    FROM STATION (ORIGIN)
                  </label>
                  <div className="relative">
                    <select
                      value={sourceCode}
                      onChange={(e) => setSourceCode(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 bg-slate-50 border border-[#94A3B8] rounded text-xs font-medium focus:outline-hidden focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                    >
                      {stations.map(st => (
                        <option key={st.code} value={st.code}>
                          {st.name} ({st.code}) - {st.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Swapper Button */}
                <div className="md:col-span-1 flex justify-center pb-0.5">
                  <button
                    type="button"
                    onClick={handleSwapStations}
                    title="Swap Origin and Destination"
                    className="w-8 h-8 rounded border border-slate-300 bg-slate-100 hover:bg-slate-200 text-[#0F2C59] flex items-center justify-center transition-colors"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* To Station */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    TO STATION (DESTINATION)
                  </label>
                  <select
                    value={destCode}
                    onChange={(e) => setDestCode(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 bg-slate-50 border border-[#94A3B8] rounded text-xs font-medium focus:outline-hidden focus:border-[#0F2C59] focus:ring-1 focus:ring-[#0F2C59]"
                  >
                    {stations.map(st => (
                      <option key={st.code} value={st.code}>
                        {st.name} ({st.code}) - {st.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    DATE (DD/MM/YYYY)
                  </label>
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full h-9 px-3 bg-slate-50 border border-[#94A3B8] rounded text-xs font-mono-num font-medium focus:outline-hidden focus:border-[#0F2C59]"
                  />
                </div>

                {/* Search Button */}
                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-9 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs uppercase rounded transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick Route Shortcuts */}
              <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-slate-500 font-semibold">Popular Tested Routes:</span>
                <button
                  type="button"
                  onClick={() => { setSourceCode('NDLS'); setDestCode('CSMT'); }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#0F2C59] font-mono-num"
                >
                  NDLS ⇄ CSMT (Tejas Rajdhani)
                </button>
                <button
                  type="button"
                  onClick={() => { setSourceCode('HWH'); setDestCode('NDLS'); }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#0F2C59] font-mono-num"
                >
                  HWH ⇄ NDLS (Howrah Rajdhani)
                </button>
                <button
                  type="button"
                  onClick={() => { setSourceCode('NDLS'); setDestCode('MAS'); }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#0F2C59] font-mono-num"
                >
                  NDLS ⇄ MAS (Tamil Nadu SF)
                </button>
                <button
                  type="button"
                  onClick={() => { setSourceCode('CSMT'); setDestCode('ADI'); }}
                  className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-[#0F2C59] font-mono-num"
                >
                  CSMT ⇄ ADI (Shatabdi Exp)
                </button>
              </div>
            </section>

            {/* Results Header */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
              <div>
                Showing <span className="font-bold text-[#0F2C59]">{filteredTrains.length}</span> Trains found between{' '}
                <span className="font-bold text-[#B91C1C] font-mono-num">{sourceCode}</span> and{' '}
                <span className="font-bold text-[#B91C1C] font-mono-num">{destCode}</span> on{' '}
                <span className="font-bold font-mono-num">{journeyDate}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Quota: <span className="font-bold text-[#0F2C59]">{quota}</span> | Dynamic PRS Engine
              </div>
            </div>

            {/* Train Results List */}
            {filteredTrains.length === 0 ? (
              <div className="bg-white border border-[#CBD5E1] rounded p-8 text-center text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-bold text-sm text-slate-700">No Direct Trains Available for {sourceCode} to {destCode}</p>
                <p className="text-xs">
                  Please try swapping the stations or choosing one of the popular seeded corridors (e.g. NDLS to CSMT, HWH to NDLS, NDLS to MAS, CSMT to ADI).
                </p>
                <button
                  onClick={() => { setSourceCode('NDLS'); setDestCode('CSMT'); }}
                  className="mt-2 px-3 py-1 bg-[#0F2C59] text-white text-xs font-semibold rounded"
                >
                  Load NDLS - CSMT Trains
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTrains.map((train) => (
                  <div key={train.trainNumber} className="bg-white border border-[#CBD5E1] rounded shadow-xs overflow-hidden">
                    {/* Train Card Header */}
                    <div className="bg-[#F1F5F9] border-b border-[#CBD5E1] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-num font-bold text-base text-[#0F2C59]">
                          {train.trainNumber}
                        </span>
                        <span className="font-bold text-sm text-[#0F2C59] tracking-tight">
                          {train.trainName}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono-num">
                          ({train.distanceKm} KM)
                        </span>
                      </div>
                      
                      {/* Running Days */}
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                        <span className="text-slate-400 mr-1">Runs On:</span>
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                          <span
                            key={idx}
                            className={`w-4 h-4 rounded-xs text-[10px] flex items-center justify-center font-mono-num ${
                              train.runsOn.includes(day) ? 'bg-[#15803D] text-white font-bold' : 'bg-slate-200 text-slate-400'
                            }`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Schedule Matrix */}
                    <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Origin */}
                      <div className="md:col-span-3">
                        <div className="text-lg font-bold font-mono-num text-[#0F2C59] leading-none">
                          {train.departureTime}
                        </div>
                        <div className="text-xs font-bold text-slate-800 font-mono-num mt-1">
                          {train.sourceCode}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {stations.find(s => s.code === train.sourceCode)?.name}
                        </div>
                      </div>

                      {/* Travel Duration Bar */}
                      <div className="md:col-span-6 flex flex-col items-center">
                        <span className="text-[11px] font-mono-num font-semibold text-slate-600 mb-1">
                          ⏱ {train.duration}
                        </span>
                        <div className="w-full flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#0F2C59]"></div>
                          <div className="flex-1 h-0.5 bg-slate-300 relative">
                            <div className="absolute inset-0 bg-[#0F2C59] opacity-30"></div>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-[#B91C1C]"></div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedTrainRoute(expandedTrainRoute === train.trainNumber ? null : train.trainNumber)}
                          className="mt-1 text-[11px] text-[#0F2C59] hover:underline flex items-center gap-0.5 font-medium"
                        >
                          View Halts & Timetable
                          {expandedTrainRoute === train.trainNumber ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Destination */}
                      <div className="md:col-span-3 text-right">
                        <div className="text-lg font-bold font-mono-num text-[#0F2C59] leading-none">
                          {train.arrivalTime}
                        </div>
                        <div className="text-xs font-bold text-slate-800 font-mono-num mt-1">
                          {train.destCode}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {stations.find(s => s.code === train.destCode)?.name}
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Route Details */}
                    {expandedTrainRoute === train.trainNumber && (
                      <div className="bg-slate-50 border-t border-slate-200 p-3 text-xs">
                        <div className="font-semibold text-slate-700 mb-2">Schedule & Halt Details (24-Hour PRS format):</div>
                        <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-200 text-slate-700 font-semibold">
                              <th className="border border-slate-300 px-2 py-1">Stop #</th>
                              <th className="border border-slate-300 px-2 py-1">Station Code</th>
                              <th className="border border-slate-300 px-2 py-1">Station Name</th>
                              <th className="border border-slate-300 px-2 py-1">Arr.</th>
                              <th className="border border-slate-300 px-2 py-1">Dep.</th>
                              <th className="border border-slate-300 px-2 py-1">Halt</th>
                              <th className="border border-slate-300 px-2 py-1">Distance</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">1</td>
                              <td className="border border-slate-300 px-2 py-1 font-bold font-mono-num">{train.sourceCode}</td>
                              <td className="border border-slate-300 px-2 py-1">{stations.find(s => s.code === train.sourceCode)?.name}</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">Source</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">{train.departureTime}</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">-</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">0 km</td>
                            </tr>
                            <tr className="bg-white">
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">2</td>
                              <td className="border border-slate-300 px-2 py-1 font-bold font-mono-num">CNB</td>
                              <td className="border border-slate-300 px-2 py-1">Kanpur Central</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">21:30</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">21:35</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">5 mins</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">440 km</td>
                            </tr>
                            <tr>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">3</td>
                              <td className="border border-slate-300 px-2 py-1 font-bold font-mono-num">{train.destCode}</td>
                              <td className="border border-slate-300 px-2 py-1">{stations.find(s => s.code === train.destCode)?.name}</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">{train.arrivalTime}</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">Dest</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">-</td>
                              <td className="border border-slate-300 px-2 py-1 font-mono-num">{train.distanceKm} km</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Class Availability & Fare Tiles */}
                    <div className="border-t border-slate-200 bg-[#FAFBFD] p-3">
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Select Travel Class & Check Live Availability:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {train.classes.map((cls, idx) => {
                          // Deterministic simulated status
                          const isAvl = (parseInt(train.trainNumber) + idx) % 3 !== 0;
                          const isRac = (parseInt(train.trainNumber) + idx) % 3 === 0;
                          const seatCount = isAvl ? 24 - idx * 4 : 4;
                          
                          return (
                            <div
                              key={cls.classCode}
                              className="border border-[#CBD5E1] rounded bg-white p-2 flex flex-col justify-between hover:border-[#0F2C59] transition-all hover:shadow-xs"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs text-[#0F2C59] font-mono-num">
                                    {cls.classCode}
                                  </span>
                                  <span className="font-bold text-xs text-slate-900 font-mono-num">
                                    ₹{cls.baseFare}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                  {cls.className}
                                </div>
                              </div>

                              <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                                {isAvl ? (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-xs bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-center font-mono-num">
                                    AVAILABLE-{seatCount < 10 ? '0' + seatCount : seatCount}
                                  </span>
                                ) : isRac ? (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-xs bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-center font-mono-num">
                                    RAC 04
                                  </span>
                                ) : (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-xs bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA] text-center font-mono-num">
                                    WL 09
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleSelectClass(train, cls.classCode, cls.baseFare)}
                                  className="w-full py-1 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-[11px] font-bold rounded-xs uppercase tracking-wider transition-colors"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PASSENGER DETAILS FORM */}
        {activeTab === 'passenger' && selectedTrain && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="bg-[#0F2C59] text-white p-3 rounded flex flex-wrap items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono-num text-sm">{selectedTrain.trainNumber} - {selectedTrain.trainName}</span>
                <span className="px-1.5 py-0.5 bg-amber-400 text-slate-900 font-bold rounded text-[11px]">
                  Class: {selectedClass}
                </span>
                <span className="text-slate-300">
                  {selectedTrain.sourceCode} ({selectedTrain.departureTime}) → {selectedTrain.destCode} ({selectedTrain.arrivalTime})
                </span>
              </div>
              <div className="font-mono-num font-bold text-amber-300">
                Date of Journey: {journeyDate}
              </div>
            </div>

            {/* Passenger Form Card */}
            <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="font-bold text-[#0F2C59] text-sm uppercase">
                  Passenger Details (Maximum 6 passengers)
                </h3>
                <button
                  type="button"
                  onClick={handleAddPassenger}
                  className="px-2.5 py-1 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Passenger
                </button>
              </div>

              <div className="space-y-3">
                {passengerList.map((p, idx) => (
                  <div key={idx} className="p-3 border border-slate-300 rounded bg-slate-50/70 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                    <div className="md:col-span-1 text-xs font-bold text-slate-600 font-mono-num">
                      #{idx + 1}
                    </div>

                    {/* Name */}
                    <div className="md:col-span-4">
                      <label className="block text-[10px] font-semibold text-slate-600">PASSENGER NAME</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={p.name}
                        onChange={(e) => handleUpdatePassenger(idx, 'name', e.target.value)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:outline-hidden focus:border-[#0F2C59]"
                      />
                    </div>

                    {/* Age */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-600">AGE</label>
                      <input
                        type="number"
                        min="5"
                        max="100"
                        value={p.age}
                        onChange={(e) => handleUpdatePassenger(idx, 'age', parseInt(e.target.value) || 20)}
                        className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono-num font-medium focus:outline-hidden focus:border-[#0F2C59]"
                      />
                    </div>

                    {/* Gender */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-600">GENDER</label>
                      <select
                        value={p.gender}
                        onChange={(e) => handleUpdatePassenger(idx, 'gender', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#0F2C59]"
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="TRANSGENDER">Transgender</option>
                      </select>
                    </div>

                    {/* Berth Preference */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-600">BERTH PREFERENCE</label>
                      <select
                        value={p.berthPreference}
                        onChange={(e) => handleUpdatePassenger(idx, 'berthPreference', e.target.value)}
                        className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs focus:outline-hidden focus:border-[#0F2C59]"
                      >
                        <option value="NO_PREFERENCE">No Preference</option>
                        <option value="LOWER">Lower Berth</option>
                        <option value="MIDDLE">Middle Berth</option>
                        <option value="UPPER">Upper Berth</option>
                        <option value="SIDE_LOWER">Side Lower</option>
                        <option value="SIDE_UPPER">Side Upper</option>
                      </select>
                    </div>

                    {/* Remove button */}
                    <div className="md:col-span-1 flex justify-end">
                      {passengerList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePassenger(idx)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Remove Passenger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Fare Summary & Proceed */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs">
                  <span className="text-slate-500">Total Ticket Fare: </span>
                  <span className="font-bold text-base text-[#0F2C59] font-mono-num">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500 ml-2 font-mono-num">
                    ({passengerList.length} passenger{passengerList.length > 1 ? 's' : ''} × ₹{selectedClassFare} + IRCTC Fee ₹{irctcConvenienceFee})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('results')}
                    className="px-3 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded text-xs hover:bg-slate-100"
                  >
                    Back to Results
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!passengerList[0].name.trim()) {
                        alert('Please enter at least the first passenger name.');
                        return;
                      }
                      setActiveTab('payment');
                    }}
                    className="px-4 py-1.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT SIMULATION */}
        {activeTab === 'payment' && selectedTrain && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-4">
              <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0F2C59]" />
                  <h3 className="font-bold text-[#0F2C59] text-sm uppercase">
                    IRCTC Simulated Payment Gateway
                  </h3>
                </div>
                <span className="font-bold text-base text-[#B91C1C] font-mono-num">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>

              {/* Trip Summary Card */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs mb-4">
                <div className="font-bold text-slate-800 font-mono-num">
                  {selectedTrain.trainNumber} - {selectedTrain.trainName} ({selectedClass})
                </div>
                <div className="text-slate-600 mt-1">
                  {selectedTrain.sourceCode} ({selectedTrain.departureTime}) → {selectedTrain.destCode} ({selectedTrain.arrivalTime}) on {journeyDate}
                </div>
                <div className="text-slate-500 mt-1 font-mono-num">
                  Passengers: {passengerList.map(p => p.name || 'Passenger').join(', ')} ({passengerList.length})
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">SELECT PAYMENT MODE</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-2.5 rounded border text-center text-xs font-bold transition-all ${
                      paymentMethod === 'UPI' ? 'border-[#0F2C59] bg-blue-50 text-[#0F2C59]' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    BHIM / UPI (Instant)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`p-2.5 rounded border text-center text-xs font-bold transition-all ${
                      paymentMethod === 'NET_BANKING' ? 'border-[#0F2C59] bg-blue-50 text-[#0F2C59]' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Net Banking (SBI / HDFC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARDS')}
                    className={`p-2.5 rounded border text-center text-xs font-bold transition-all ${
                      paymentMethod === 'CARDS' ? 'border-[#0F2C59] bg-blue-50 text-[#0F2C59]' : 'border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    Debit / Credit Card
                  </button>
                </div>

                {/* Simulated Payment Input */}
                {paymentMethod === 'UPI' && (
                  <div className="p-3 border border-slate-200 rounded bg-slate-50 space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700">ENTER VIRTUAL PAYMENT ADDRESS (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full h-8 px-3 bg-white border border-slate-300 rounded text-xs font-mono-num font-medium focus:outline-hidden focus:border-[#0F2C59]"
                    />
                    <p className="text-[10px] text-slate-500">
                      * Simulated Test Gateway: No real money is charged. Click below to trigger atomic DB booking transaction and generate 10-digit PNR.
                    </p>
                  </div>
                )}

                {paymentMethod !== 'UPI' && (
                  <div className="p-3 border border-slate-200 rounded bg-slate-50 text-xs text-slate-600">
                    Payment Gateway Simulator ready for {paymentMethod}. Standard 3D Secure verification will be simulated.
                  </div>
                )}
              </div>

              {/* Pay Button */}
              <div className="mt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('passenger')}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 font-semibold rounded text-xs hover:bg-slate-100"
                >
                  Back to Passenger Details
                </button>
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleConfirmPaymentAndBook}
                  className="px-5 py-2 bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing DB Transaction...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Pay ₹{grandTotal.toFixed(2)} & Generate PNR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ELECTRONIC RESERVATION SLIP (ERS) TICKET */}
        {activeTab === 'ticket' && latestBooking && (
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ticket Successfully Booked (PNR: {latestBooking.pnr})
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded flex items-center gap-1 hover:bg-slate-50"
                >
                  <Printer className="w-3.5 h-3.5" /> Print ERS Ticket
                </button>
                <button
                  onClick={() => setActiveTab('my-bookings')}
                  className="px-2.5 py-1 bg-[#0F2C59] text-white text-xs font-semibold rounded hover:bg-[#1E3A8A]"
                >
                  View in My Bookings
                </button>
              </div>
            </div>

            {/* Printable Ticket Box */}
            <div className="bg-white border-2 border-[#0F2C59] rounded p-4 text-xs font-mono-num shadow-sm print:border-none print:shadow-none space-y-3">
              {/* Ticket Watermark Header */}
              <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-widest">
                    INDIAN RAILWAYS PASSENGER RESERVATION SYSTEM (PRS)
                  </div>
                  <div className="text-base font-sans font-bold text-[#0F2C59]">
                    ELECTRONIC RESERVATION SLIP (ERS) - CONFIRMED
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">10-DIGIT PNR NUMBER</div>
                  <div className="text-lg font-bold text-[#B91C1C] tracking-wider">
                    {latestBooking.pnr}
                  </div>
                </div>
              </div>

              {/* Grid Journey Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 border border-slate-200 rounded">
                <div>
                  <span className="text-slate-500 block text-[10px]">TRAIN NUMBER & NAME:</span>
                  <span className="font-bold text-slate-900">{latestBooking.trainNumber} / {latestBooking.trainName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE OF JOURNEY:</span>
                  <span className="font-bold text-slate-900">{latestBooking.journeyDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">FROM → TO:</span>
                  <span className="font-bold text-slate-900">{latestBooking.sourceCode} → {latestBooking.destCode}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">CLASS & QUOTA:</span>
                  <span className="font-bold text-slate-900">{latestBooking.classCode} | GENERAL (GN)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DEPARTURE TIME:</span>
                  <span className="font-bold text-slate-900">{latestBooking.departureTime} HRS</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ARRIVAL TIME:</span>
                  <span className="font-bold text-slate-900">{latestBooking.arrivalTime} HRS</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">TOTAL FARE PAID:</span>
                  <span className="font-bold text-emerald-800">₹{latestBooking.totalFare.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PAYMENT TXN ID:</span>
                  <span className="font-bold text-slate-900 truncate block">{latestBooking.paymentId}</span>
                </div>
              </div>

              {/* Passenger List Table */}
              <div>
                <div className="font-sans font-bold text-slate-700 mb-1">PASSENGER DETAILS & BERTH ALLOCATION</div>
                <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-800 font-bold">
                      <th className="border border-slate-300 px-2 py-1">#</th>
                      <th className="border border-slate-300 px-2 py-1">Passenger Name</th>
                      <th className="border border-slate-300 px-2 py-1">Age</th>
                      <th className="border border-slate-300 px-2 py-1">Gender</th>
                      <th className="border border-slate-300 px-2 py-1">Booking Status</th>
                      <th className="border border-slate-300 px-2 py-1">Coach</th>
                      <th className="border border-slate-300 px-2 py-1">Berth No</th>
                      <th className="border border-slate-300 px-2 py-1">Berth Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestBooking.passengers.map((p, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="border border-slate-300 px-2 py-1">{idx + 1}</td>
                        <td className="border border-slate-300 px-2 py-1 font-bold">{p.name}</td>
                        <td className="border border-slate-300 px-2 py-1">{p.age}</td>
                        <td className="border border-slate-300 px-2 py-1">{p.gender}</td>
                        <td className="border border-slate-300 px-2 py-1 font-bold text-emerald-700">{p.status}</td>
                        <td className="border border-slate-300 px-2 py-1 font-bold text-[#0F2C59]">{p.allocatedCoach || 'B4'}</td>
                        <td className="border border-slate-300 px-2 py-1 font-bold">{p.allocatedBerth || '21'}</td>
                        <td className="border border-slate-300 px-2 py-1">{p.berthType || 'LOWER'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Barcode & Security Instructions */}
              <div className="pt-2 border-t border-slate-300 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-sans">
                <div className="space-y-0.5">
                  <p>• Valid government photo ID (Aadhaar/Voter/Passport/Driving License) is required during travel.</p>
                  <p>• ERS is authorized as valid travel ticket without printout when presented on mobile screen.</p>
                  <p>• Generated by Indian Railways PRS Servlet/JDBC Engine on {latestBooking.bookingDate}</p>
                </div>
                <div className="text-right font-mono-num font-bold text-slate-800">
                  ||||| | |||| |||||| || | |||| ||| <br />
                  *{latestBooking.pnr}*
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: MY BOOKINGS & CANCELLATION */}
        {activeTab === 'my-bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#0F2C59] text-base">My Booked Tickets & Cancellation Console</h2>
                <p className="text-xs text-slate-500">View journey details, download ERS slips, or cancel bookings with automatic refund calculation.</p>
              </div>
              <button
                onClick={() => setActiveTab('search')}
                className="px-3 py-1 bg-[#0F2C59] hover:bg-[#1E3A8A] text-white text-xs font-semibold rounded"
              >
                Book New Ticket
              </button>
            </div>

            <div className="space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white border border-[#CBD5E1] rounded shadow-xs p-4">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-2 mb-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">PNR:</span>
                      <span className="font-mono-num font-bold text-sm text-[#0F2C59]">{booking.pnr}</span>
                      <span className={`px-2 py-0.5 rounded-xs font-bold text-[10px] ${
                        booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        booking.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>

                    <div className="text-right text-slate-500 font-mono-num text-[11px]">
                      Booked on: {booking.bookingDate}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px]">TRAIN:</span>
                      <span className="font-bold text-slate-800 font-mono-num">{booking.trainNumber} - {booking.trainName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ROUTE & TIME:</span>
                      <span className="font-mono-num">{booking.sourceCode} ({booking.departureTime}) → {booking.destCode} ({booking.arrivalTime})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">JOURNEY DATE & CLASS:</span>
                      <span className="font-bold font-mono-num text-[#0F2C59]">{booking.journeyDate} | {booking.classCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">TOTAL FARE:</span>
                      <span className="font-bold font-mono-num text-slate-900">₹{booking.totalFare.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Passengers in this booking */}
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs mb-3">
                    <div className="font-semibold text-slate-700 mb-1 text-[11px]">Passenger Allocations:</div>
                    <div className="flex flex-wrap gap-2">
                      {booking.passengers.map((p, idx) => (
                        <div key={idx} className="bg-white border border-slate-300 px-2 py-1 rounded text-[11px]">
                          <span className="font-bold text-slate-800">{p.name}</span> ({p.age}, {p.gender[0]}) - Coach: <span className="font-bold font-mono-num text-[#0F2C59]">{p.allocatedCoach || 'B4'}</span> Berth: <span className="font-bold font-mono-num">{p.allocatedBerth || '21'}</span> ({p.berthType || 'LOWER'})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="text-[11px] text-slate-500">
                      {booking.bookingStatus === 'CANCELLED' && booking.refundAmount ? (
                        <span className="text-red-700 font-semibold font-mono-num">
                          Cancelled. Refund of ₹{booking.refundAmount.toFixed(2)} processed.
                        </span>
                      ) : (
                        <span>Valid for boarding with original Photo ID.</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setLatestBooking(booking); setActiveTab('ticket'); }}
                        className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View ERS
                      </button>

                      {booking.bookingStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => setCancellingBooking(booking)}
                          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancellation Confirmation Modal */}
            {cancellingBooking && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded border border-slate-300 max-w-md w-full p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-red-700 text-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Confirm Ticket Cancellation
                    </h3>
                    <button onClick={() => setCancellingBooking(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>

                  <p className="text-xs text-slate-700">
                    Are you sure you want to cancel PNR <span className="font-bold font-mono-num text-[#0F2C59]">{cancellingBooking.pnr}</span> for{' '}
                    <span className="font-bold">{cancellingBooking.trainNumber} - {cancellingBooking.trainName}</span>?
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1 font-mono-num">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Original Total Fare:</span>
                      <span className="font-bold">₹{cancellingBooking.totalFare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-700">
                      <span>Clerkage / Cancellation Charge:</span>
                      <span>- ₹{cancellingBooking.classCode.includes('1') ? (240 * cancellingBooking.passengers.length).toFixed(2) : (180 * cancellingBooking.passengers.length).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold border-t pt-1">
                      <span>Estimated Net Refund:</span>
                      <span>
                        ₹{(cancellingBooking.totalFare - (cancellingBooking.classCode.includes('1') ? 240 * cancellingBooking.passengers.length : 180 * cancellingBooking.passengers.length)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setCancellingBooking(null)}
                      className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={() => handleCancelTicket(cancellingBooking)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
                    >
                      Confirm Cancellation & Refund
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: ADMIN MASTER CONSOLE */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-4">
              <div className="border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#B91C1C]" />
                  <div>
                    <h2 className="font-bold text-[#0F2C59] text-sm uppercase">Admin PRS Master Control Panel</h2>
                    <p className="text-[11px] text-slate-500">Manage trains schedule, view passenger bookings audit, and control seat availability matrices.</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#B91C1C] text-white text-[11px] font-bold rounded">
                  ROLE: PRS_CHIEF_CONTROLLER
                </span>
              </div>

              {/* Add New Train Form */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 mb-4">
                <div className="font-bold text-xs text-[#0F2C59] mb-2 uppercase">Add New Train to System Master (Admin Feature)</div>
                <form onSubmit={handleAdminAddTrain} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 items-end text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Train Number (5-digit)</label>
                    <input
                      type="text"
                      placeholder="e.g. 12424"
                      value={newTrainNumber}
                      onChange={(e) => setNewTrainNumber(e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-slate-300 rounded font-mono-num font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Train Name</label>
                    <input
                      type="text"
                      placeholder="e.g. DIBRUGARH RAJDHANI"
                      value={newTrainName}
                      onChange={(e) => setNewTrainName(e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-slate-300 rounded font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Origin Station</label>
                    <select
                      value={newTrainSource}
                      onChange={(e) => setNewTrainSource(e.target.value)}
                      className="w-full h-8 px-1.5 bg-white border border-slate-300 rounded font-mono-num"
                    >
                      {stations.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Dest Station</label>
                    <select
                      value={newTrainDest}
                      onChange={(e) => setNewTrainDest(e.target.value)}
                      className="w-full h-8 px-1.5 bg-white border border-slate-300 rounded font-mono-num"
                    >
                      {stations.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">Dep / Arr Time</label>
                    <div className="flex gap-1">
                      <input
                        type="time"
                        value={newDepTime}
                        onChange={(e) => setNewDepTime(e.target.value)}
                        className="w-1/2 h-8 px-1 bg-white border border-slate-300 rounded text-[10px] font-mono-num"
                      />
                      <input
                        type="time"
                        value={newArrTime}
                        onChange={(e) => setNewArrTime(e.target.value)}
                        className="w-1/2 h-8 px-1 bg-white border border-slate-300 rounded text-[10px] font-mono-num"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full h-8 bg-[#15803D] hover:bg-[#166534] text-white font-bold rounded flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Save Train
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Trains Master Table */}
              <div>
                <div className="font-bold text-xs text-slate-800 mb-2">Active Train Master List ({trains.length} Trains):</div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-slate-300 text-left text-xs">
                    <thead>
                      <tr className="bg-slate-200 text-slate-800 font-bold">
                        <th className="border border-slate-300 px-2 py-1.5">Train #</th>
                        <th className="border border-slate-300 px-2 py-1.5">Train Name</th>
                        <th className="border border-slate-300 px-2 py-1.5">Origin</th>
                        <th className="border border-slate-300 px-2 py-1.5">Dest</th>
                        <th className="border border-slate-300 px-2 py-1.5">Departure</th>
                        <th className="border border-slate-300 px-2 py-1.5">Arrival</th>
                        <th className="border border-slate-300 px-2 py-1.5">Classes</th>
                        <th className="border border-slate-300 px-2 py-1.5">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trains.map(t => (
                        <tr key={t.trainNumber} className="hover:bg-slate-50 font-mono-num">
                          <td className="border border-slate-300 px-2 py-1.5 font-bold text-[#0F2C59]">{t.trainNumber}</td>
                          <td className="border border-slate-300 px-2 py-1.5 font-sans font-bold">{t.trainName}</td>
                          <td className="border border-slate-300 px-2 py-1.5">{t.sourceCode}</td>
                          <td className="border border-slate-300 px-2 py-1.5">{t.destCode}</td>
                          <td className="border border-slate-300 px-2 py-1.5">{t.departureTime}</td>
                          <td className="border border-slate-300 px-2 py-1.5">{t.arrivalTime}</td>
                          <td className="border border-slate-300 px-2 py-1.5 font-sans text-[11px]">
                            {t.classes.map(c => c.classCode).join(', ')}
                          </td>
                          <td className="border border-slate-300 px-2 py-1.5">
                            <button
                              onClick={() => handleAdminDeleteTrain(t.trainNumber)}
                              className="text-red-600 hover:text-red-800 font-sans text-[11px] font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: RESERVATION CHART (FORM E-1) PREVIEW */}
        {activeTab === 'chart' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white border-2 border-slate-400 rounded p-4 font-mono-num text-xs shadow-xs space-y-3">
              <div className="border-b-2 border-slate-800 pb-2 flex items-center justify-between font-sans">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">INDIAN RAILWAYS - FORM E-1</h3>
                  <div className="text-[11px] text-slate-600 font-mono-num">RESERVATION CHART FOR TRAIN 12952 (MUMBAI TEJAS RAJDHANI)</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400 font-bold text-[10px] rounded">
                    CHART STATUS: PREPARED
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1">Generated at {currentTime} IST</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 text-[11px] border border-slate-300">
                <div><strong>Coach:</strong> B4 (AC 3-Tier)</div>
                <div><strong>Date of Journey:</strong> {journeyDate}</div>
                <div><strong>From:</strong> NDLS (16:55)</div>
                <div><strong>To:</strong> CSMT (08:35)</div>
              </div>

              <table className="w-full border-collapse border border-slate-400 text-left text-[11px]">
                <thead>
                  <tr className="bg-slate-300 text-slate-900 font-bold">
                    <th className="border border-slate-400 px-2 py-1">Berth</th>
                    <th className="border border-slate-400 px-2 py-1">Berth Type</th>
                    <th className="border border-slate-400 px-2 py-1">PNR #</th>
                    <th className="border border-slate-400 px-2 py-1">Passenger Name</th>
                    <th className="border border-slate-400 px-2 py-1">Age</th>
                    <th className="border border-slate-400 px-2 py-1">Sex</th>
                    <th className="border border-slate-400 px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-slate-400 px-2 py-1 font-bold">21</td>
                    <td className="border border-slate-400 px-2 py-1">LOWER</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold">2849173021</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold font-sans">Rahul Sharma</td>
                    <td className="border border-slate-400 px-2 py-1">26</td>
                    <td className="border border-slate-400 px-2 py-1">M</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold text-emerald-700">CNF</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-400 px-2 py-1 font-bold">22</td>
                    <td className="border border-slate-400 px-2 py-1">MIDDLE</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold">2849173021</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold font-sans">Priya Sharma</td>
                    <td className="border border-slate-400 px-2 py-1">24</td>
                    <td className="border border-slate-400 px-2 py-1">F</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold text-emerald-700">CNF</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-slate-400 px-2 py-1 font-bold">23</td>
                    <td className="border border-slate-400 px-2 py-1">UPPER</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold">2849178841</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold font-sans">Sunita Verma</td>
                    <td className="border border-slate-400 px-2 py-1">52</td>
                    <td className="border border-slate-400 px-2 py-1">F</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold text-emerald-700">CNF</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="border border-slate-400 px-2 py-1 font-bold">24</td>
                    <td className="border border-slate-400 px-2 py-1">SIDE LOWER</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold">2849178841</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold font-sans">Ramesh Verma</td>
                    <td className="border border-slate-400 px-2 py-1">56</td>
                    <td className="border border-slate-400 px-2 py-1">M</td>
                    <td className="border border-slate-400 px-2 py-1 font-bold text-emerald-700">CNF</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 text-[10px] text-slate-500 font-sans flex justify-between items-center">
                <span>Verified by Train Ticket Examiner (TTE) - Charting Base Station: NDLS</span>
                <button
                  onClick={() => window.print()}
                  className="px-2 py-1 bg-slate-800 text-white rounded text-xs font-mono-num font-bold hover:bg-black"
                >
                  Print Form E-1
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#0F2C59] text-slate-300 border-t border-slate-800 text-xs mt-auto py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px]">
            © Indian Railways Passenger Reservation System (PRS) • Center for Railway Information Systems (CRIS)
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono-num">
            <span>Server: CRIS-PRS-PROD-04</span>
            <span>Security: 256-bit SSL Encrypted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
