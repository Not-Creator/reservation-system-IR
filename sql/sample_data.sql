-- =====================================================================
-- RAILWAY RESERVATION SYSTEM (PRS) - SAMPLE DATA
-- 8 Key Indian Stations, 6 Premier Trains, Realistic Classes & Fares,
-- Seed Users (with BCrypt hashes), and Initial Seat Availabilities
-- =====================================================================

USE train_reservation_db;

-- ---------------------------------------------------------------------
-- 1. SEED USERS
-- Password for admin: 'Admin@123'
-- Password for user:  'User@123'
-- BCrypt cost factor 10 hashes generated using standard BCrypt algorithm
-- ---------------------------------------------------------------------
INSERT INTO users (id, username, password_hash, full_name, email, phone, role) VALUES
(1, 'admin', '$2a$10$WqB3j8K4DvhbV96F2bZ8wOB2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', 'PRS Chief Controller', 'admin@railnet.gov.in', '9811002233', 'ADMIN'),
(2, 'rahul_sharma', '$2a$10$fV3G6tK8LvhbV96F2bZ8wOn2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', 'Rahul Sharma', 'rahul.sharma@gmail.com', '9876543210', 'USER'),
(3, 'priya_patel', '$2a$10$fV3G6tK8LvhbV96F2bZ8wOn2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', 'Priya Patel', 'priya.patel@gmail.com', '9822334455', 'USER');

-- ---------------------------------------------------------------------
-- 2. SEED STATIONS (8 Major Indian Railway Hubs)
-- ---------------------------------------------------------------------
INSERT INTO stations (code, name, city, state) VALUES
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi'),
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra'),
('HWH',  'Howrah Junction', 'Kolkata', 'West Bengal'),
('SBC',  'KSR Bengaluru City Junction', 'Bengaluru', 'Karnataka'),
('MAS',  'MGR Chennai Central', 'Chennai', 'Tamil Nadu'),
('PNBE', 'Patna Junction', 'Patna', 'Bihar'),
('ADI',  'Ahmedabad Junction', 'Ahmedabad', 'Gujarat'),
('CNB',  'Kanpur Central', 'Kanpur', 'Uttar Pradesh');

-- ---------------------------------------------------------------------
-- 3. SEED TRAINS (6 Real Premier Trains with 24-hr Timings)
-- ---------------------------------------------------------------------
INSERT INTO trains (train_number, train_name, source_station_code, dest_station_code, departure_time, arrival_time, distance_km, duration_hours, runs_on_days) VALUES
('12952', 'MUMBAI TEJAS RAJDHANI', 'NDLS', 'CSMT', '16:55:00', '08:35:00', 1384, '15h 40m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12951', 'MUMBAI RAJDHANI EXPRESS', 'CSMT', 'NDLS', '17:00:00', '08:32:00', 1384, '15h 32m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12301', 'HOWRAH RAJDHANI EXPRESS', 'HWH',  'NDLS', '16:50:00', '10:05:00', 1451, '17h 15m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12302', 'NEW DELHI - HOWRAH RAJDHANI', 'NDLS', 'HWH',  '16:55:00', '09:55:00', 1451, '17h 00m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12622', 'TAMIL NADU SUPERFAST EXP', 'NDLS', 'MAS',  '21:05:00', '06:35:00', 2182, '33h 30m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12009', 'MUMBAI - AHMEDABAD SHATABDI', 'CSMT', 'ADI',  '06:20:00', '12:45:00', 493,  '06h 25m', 'MON,TUE,WED,THU,FRI,SAT');

-- ---------------------------------------------------------------------
-- 4. SEED TRAIN CLASSES & BASE FARES
-- Real-world pricing and capacity configurations
-- ---------------------------------------------------------------------
-- 12952 (NDLS -> CSMT Tejas Rajdhani)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12952', '1A', 'AC First Class', 24, 4850.00),
('12952', '2A', 'AC 2-Tier', 54, 2920.00),
('12952', '3A', 'AC 3-Tier', 72, 2090.00);

-- 12951 (CSMT -> NDLS Rajdhani)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12951', '1A', 'AC First Class', 24, 4850.00),
('12951', '2A', 'AC 2-Tier', 54, 2920.00),
('12951', '3A', 'AC 3-Tier', 72, 2090.00);

-- 12301 (HWH -> NDLS Howrah Rajdhani)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12301', '1A', 'AC First Class', 24, 4920.00),
('12301', '2A', 'AC 2-Tier', 54, 2980.00),
('12301', '3A', 'AC 3-Tier', 72, 2140.00);

-- 12302 (NDLS -> HWH Howrah Rajdhani)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12302', '1A', 'AC First Class', 24, 4920.00),
('12302', '2A', 'AC 2-Tier', 54, 2980.00),
('12302', '3A', 'AC 3-Tier', 72, 2140.00);

-- 12622 (NDLS -> MAS Tamil Nadu SF Exp - includes Sleeper)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12622', '2A', 'AC 2-Tier', 48, 3210.00),
('12622', '3A', 'AC 3-Tier', 72, 2240.00),
('12622', 'SL', 'Sleeper Class', 120, 840.00);

-- 12009 (CSMT -> ADI Shatabdi Express - Chair Car)
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12009', 'EC', 'Executive Anubhuti CC', 46, 2190.00),
('12009', 'CC', 'AC Chair Car', 78, 1145.00);

-- ---------------------------------------------------------------------
-- 5. SEED INITIAL SEAT AVAILABILITY (Date-wise dynamic booking pool)
-- Seeded for dates: Tomorrow, Tomorrow + 1, Tomorrow + 2
-- ---------------------------------------------------------------------
INSERT INTO seat_availability (train_number, journey_date, class_code, available_seats, rac_seats, wl_seats, current_status) VALUES
-- Train 12952 (NDLS to CSMT)
('12952', CURRENT_DATE + INTERVAL 1 DAY, '1A', 8,  0, 0, 'AVAILABLE 08'),
('12952', CURRENT_DATE + INTERVAL 1 DAY, '2A', 22, 0, 0, 'AVAILABLE 22'),
('12952', CURRENT_DATE + INTERVAL 1 DAY, '3A', 45, 0, 0, 'AVAILABLE 45'),

('12952', CURRENT_DATE + INTERVAL 2 DAY, '1A', 2,  0, 0, 'AVAILABLE 02'),
('12952', CURRENT_DATE + INTERVAL 2 DAY, '2A', 0,  4, 0, 'RAC 04'),
('12952', CURRENT_DATE + INTERVAL 2 DAY, '3A', 15, 0, 0, 'AVAILABLE 15'),

('12952', CURRENT_DATE + INTERVAL 3 DAY, '1A', 0,  0, 3, 'WL 03'),
('12952', CURRENT_DATE + INTERVAL 3 DAY, '2A', 18, 0, 0, 'AVAILABLE 18'),
('12952', CURRENT_DATE + INTERVAL 3 DAY, '3A', 30, 0, 0, 'AVAILABLE 30'),

-- Train 12301 (HWH to NDLS)
('12301', CURRENT_DATE + INTERVAL 1 DAY, '2A', 12, 0, 0, 'AVAILABLE 12'),
('12301', CURRENT_DATE + INTERVAL 1 DAY, '3A', 34, 0, 0, 'AVAILABLE 34'),

-- Train 12622 (NDLS to MAS)
('12622', CURRENT_DATE + INTERVAL 1 DAY, '3A', 19, 0, 0, 'AVAILABLE 19'),
('12622', CURRENT_DATE + INTERVAL 1 DAY, 'SL', 64, 0, 0, 'AVAILABLE 64'),

-- Train 12009 (CSMT to ADI)
('12009', CURRENT_DATE + INTERVAL 1 DAY, 'CC', 42, 0, 0, 'AVAILABLE 42'),
('12009', CURRENT_DATE + INTERVAL 1 DAY, 'EC', 14, 0, 0, 'AVAILABLE 14');

-- ---------------------------------------------------------------------
-- 6. SAMPLE BOOKING & PASSENGER RECORD
-- Useful for demonstrating "My Bookings" and "Cancellation" during viva!
-- ---------------------------------------------------------------------
INSERT INTO bookings (id, pnr_number, user_id, train_number, journey_date, class_code, source_code, dest_code, total_passengers, total_fare, booking_status, payment_id, payment_status)
VALUES (1, '2849173021', 2, '12952', CURRENT_DATE + INTERVAL 1 DAY, '3A', 'NDLS', 'CSMT', 2, 4180.00, 'CONFIRMED', 'TXN_IRCTC_992182', 'SUCCESS');

INSERT INTO passengers (booking_id, passenger_name, age, gender, berth_preference, allocated_coach, allocated_berth, berth_type, booking_status) VALUES
(1, 'Rahul Sharma', 26, 'MALE', 'LOWER', 'B4', '21', 'LOWER', 'CNF'),
(1, 'Priya Sharma', 24, 'FEMALE', 'MIDDLE', 'B4', '22', 'MIDDLE', 'CNF');
