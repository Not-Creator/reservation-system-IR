-- =====================================================================
-- STEP 1: SAMPLE DATA WITH BCRYPT TEST USERS
-- Password for admin: 'Admin@123'
-- Password for user:  'User@123'
-- =====================================================================

USE train_reservation_db;

-- Insert test users with BCrypt hash (cost 10). Never store plain text passwords!
INSERT INTO users (id, name, email, password_hash, phone, role) VALUES
(1, 'PRS Chief Controller', 'admin@railnet.gov.in', '$2a$10$WqB3j8K4DvhbV96F2bZ8wOB2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', '9811002233', 'ADMIN'),
(2, 'Rahul Sharma', 'rahul.sharma@gmail.com', '$2a$10$fV3G6tK8LvhbV96F2bZ8wOn2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', '9876543210', 'USER'),
(3, 'Priya Patel', 'priya.patel@gmail.com', '$2a$10$fV3G6tK8LvhbV96F2bZ8wOn2qWf4rV02C23jG1vQ7.OqT.kZ3.SZe', '9822334455', 'USER');

-- Stations
INSERT INTO stations (code, name, city, state) VALUES
('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi'),
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra'),
('HWH',  'Howrah Junction', 'Kolkata', 'West Bengal'),
('SBC',  'KSR Bengaluru City Junction', 'Bengaluru', 'Karnataka'),
('MAS',  'MGR Chennai Central', 'Chennai', 'Tamil Nadu'),
('PNBE', 'Patna Junction', 'Patna', 'Bihar'),
('ADI',  'Ahmedabad Junction', 'Ahmedabad', 'Gujarat'),
('CNB',  'Kanpur Central', 'Kanpur', 'Uttar Pradesh');

-- Trains
INSERT INTO trains (train_number, train_name, source_station_code, dest_station_code, departure_time, arrival_time, distance_km, duration_hours, runs_on_days) VALUES
('12952', 'MUMBAI TEJAS RAJDHANI', 'NDLS', 'CSMT', '16:55:00', '08:35:00', 1384, '15h 40m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12951', 'MUMBAI RAJDHANI EXPRESS', 'CSMT', 'NDLS', '17:00:00', '08:32:00', 1384, '15h 32m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12301', 'HOWRAH RAJDHANI EXPRESS', 'HWH',  'NDLS', '16:50:00', '10:05:00', 1451, '17h 15m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12302', 'NEW DELHI - HOWRAH RAJDHANI', 'NDLS', 'HWH',  '16:55:00', '09:55:00', 1451, '17h 00m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12622', 'TAMIL NADU SUPERFAST EXP', 'NDLS', 'MAS',  '21:05:00', '06:35:00', 2182, '33h 30m', 'MON,TUE,WED,THU,FRI,SAT,SUN'),
('12009', 'MUMBAI - AHMEDABAD SHATABDI', 'CSMT', 'ADI',  '06:20:00', '12:45:00', 493,  '06h 25m', 'MON,TUE,WED,THU,FRI,SAT');

-- Classes & Fares
INSERT INTO train_classes (train_number, class_code, class_name, total_seats, base_fare) VALUES
('12952', '1A', 'AC First Class', 24, 4850.00),
('12952', '2A', 'AC 2-Tier', 54, 2920.00),
('12952', '3A', 'AC 3-Tier', 72, 2090.00),
('12301', '2A', 'AC 2-Tier', 54, 2980.00),
('12301', '3A', 'AC 3-Tier', 72, 2140.00),
('12622', '3A', 'AC 3-Tier', 72, 2240.00),
('12622', 'SL', 'Sleeper Class', 120, 840.00),
('12009', 'EC', 'Executive Anubhuti CC', 46, 2190.00),
('12009', 'CC', 'AC Chair Car', 78, 1145.00);

-- Seat Availability
INSERT INTO seat_availability (train_number, journey_date, class_code, available_seats, rac_seats, wl_seats, current_status) VALUES
('12952', CURRENT_DATE + INTERVAL 1 DAY, '1A', 8,  0, 0, 'AVAILABLE 08'),
('12952', CURRENT_DATE + INTERVAL 1 DAY, '2A', 22, 0, 0, 'AVAILABLE 22'),
('12952', CURRENT_DATE + INTERVAL 1 DAY, '3A', 45, 0, 0, 'AVAILABLE 45'),
('12301', CURRENT_DATE + INTERVAL 1 DAY, '2A', 12, 0, 0, 'AVAILABLE 12'),
('12301', CURRENT_DATE + INTERVAL 1 DAY, '3A', 34, 0, 0, 'AVAILABLE 34'),
('12622', CURRENT_DATE + INTERVAL 1 DAY, '3A', 19, 0, 0, 'AVAILABLE 19'),
('12622', CURRENT_DATE + INTERVAL 1 DAY, 'SL', 64, 0, 0, 'AVAILABLE 64');
