-- =====================================================================
-- RAILWAY RESERVATION SYSTEM (PRS) - DATABASE SCHEMA
-- Target Database: MySQL 8.0+
-- College Mini Project: Java Servlets + JSP + JDBC + MySQL
-- Description: Contains tables for Users, Stations, Trains, Train Classes,
--              Seat Availability, Bookings, and Passengers.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS train_reservation_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE train_reservation_db;

-- Drop tables in reverse dependency order to avoid Foreign Key constraint issues
DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seat_availability;
DROP TABLE IF EXISTS train_classes;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

-- ---------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores both normal Passengers and Administrators.
-- Passwords are encrypted using BCrypt hash (60-char string).
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt hashed password
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. STATIONS TABLE
-- Master list of railway stations with standard 3-4 letter IRCTC codes.
-- ---------------------------------------------------------------------
CREATE TABLE stations (
    code VARCHAR(10) PRIMARY KEY, -- e.g. NDLS, CSMT, HWH
    name VARCHAR(100) NOT NULL,   -- e.g. New Delhi, Mumbai CSMT
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. TRAINS TABLE
-- Master list of trains with 5-digit number, route, and schedule.
-- ---------------------------------------------------------------------
CREATE TABLE trains (
    train_number VARCHAR(10) PRIMARY KEY, -- e.g. 12952, 12301 (5-digit)
    train_name VARCHAR(150) NOT NULL,
    source_station_code VARCHAR(10) NOT NULL,
    dest_station_code VARCHAR(10) NOT NULL,
    departure_time TIME NOT NULL,         -- 24-hour format e.g. '16:55:00'
    arrival_time TIME NOT NULL,           -- 24-hour format e.g. '08:35:00'
    distance_km INT NOT NULL,
    duration_hours VARCHAR(20) NOT NULL,  -- e.g. '15h 40m'
    runs_on_days VARCHAR(50) NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI,SAT,SUN',
    CONSTRAINT fk_train_source FOREIGN KEY (source_station_code) 
        REFERENCES stations(code) ON UPDATE CASCADE,
    CONSTRAINT fk_train_dest FOREIGN KEY (dest_station_code) 
        REFERENCES stations(code) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. TRAIN_CLASSES TABLE
-- Configures available travel classes (1A, 2A, 3A, SL, CC) and base fare per train.
-- ---------------------------------------------------------------------
CREATE TABLE train_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL,
    class_code VARCHAR(5) NOT NULL,       -- '1A', '2A', '3A', 'SL', 'CC'
    class_name VARCHAR(50) NOT NULL,      -- 'AC First Class', 'Sleeper', etc.
    total_seats INT NOT NULL DEFAULT 60,
    base_fare DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY uk_train_class (train_number, class_code),
    CONSTRAINT fk_class_train FOREIGN KEY (train_number) 
        REFERENCES trains(train_number) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. SEAT_AVAILABILITY TABLE
-- Tracks live quota availability (AVL, RAC, WL) for each date and class.
-- Critical for booking concurrency & row-level locking (SELECT ... FOR UPDATE).
-- ---------------------------------------------------------------------
CREATE TABLE seat_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    class_code VARCHAR(5) NOT NULL,
    available_seats INT NOT NULL DEFAULT 40,
    rac_seats INT NOT NULL DEFAULT 10,
    wl_seats INT NOT NULL DEFAULT 0,
    current_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE', -- e.g. 'AVL 40', 'RAC 05', 'WL 08'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_train_date_class (train_number, journey_date, class_code),
    CONSTRAINT fk_avail_train FOREIGN KEY (train_number) 
        REFERENCES trains(train_number) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. BOOKINGS TABLE
-- Stores ticket header details, unique 10-digit PNR, user, and payment info.
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number VARCHAR(10) NOT NULL UNIQUE, -- 10-digit numeric string
    user_id INT NOT NULL,
    train_number VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    class_code VARCHAR(5) NOT NULL,
    source_code VARCHAR(10) NOT NULL,
    dest_code VARCHAR(10) NOT NULL,
    total_passengers INT NOT NULL,
    total_fare DECIMAL(10, 2) NOT NULL,
    booking_status ENUM('CONFIRMED', 'RAC', 'WAITLISTED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    payment_id VARCHAR(50) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    refund_amount DECIMAL(10, 2) DEFAULT 0.00,
    cancellation_date TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_train FOREIGN KEY (train_number) 
        REFERENCES trains(train_number) ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. PASSENGERS TABLE
-- Individual passenger records linked to a booking (name, age, gender, berth).
-- ---------------------------------------------------------------------
CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'TRANSGENDER') NOT NULL,
    berth_preference VARCHAR(30) DEFAULT 'NO_PREFERENCE', -- 'LOWER', 'MIDDLE', 'UPPER', etc.
    allocated_coach VARCHAR(10) DEFAULT NULL,            -- e.g. 'B4', 'S3'
    allocated_berth VARCHAR(10) DEFAULT NULL,            -- e.g. '32', '45'
    berth_type VARCHAR(20) DEFAULT NULL,                 -- 'LOWER', 'MIDDLE', 'UPPER', 'SIDE LOWER'
    booking_status VARCHAR(20) NOT NULL DEFAULT 'CNF',   -- 'CNF', 'RAC', 'WL'
    CONSTRAINT fk_passenger_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- USEFUL INDEXES FOR FAST QUERYING
-- ---------------------------------------------------------------------
CREATE INDEX idx_train_search ON trains(source_station_code, dest_station_code);
CREATE INDEX idx_seat_search ON seat_availability(train_number, journey_date, class_code);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_pnr ON bookings(pnr_number);
