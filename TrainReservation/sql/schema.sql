-- =====================================================================
-- STEP 1: PREPARE THE DATABASE - USERS TABLE
-- Railway Reservation System (PRS)
-- Columns: id, name, email (UNIQUE), password_hash, phone, role (USER or ADMIN)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS train_reservation_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE train_reservation_db;

DROP TABLE IF EXISTS passengers;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seat_availability;
DROP TABLE IF EXISTS train_classes;
DROP TABLE IF EXISTS trains;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS users;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- BCrypt 60-char hash string, never plain text
    phone VARCHAR(15) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. STATIONS TABLE
CREATE TABLE stations (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- 3. TRAINS TABLE
CREATE TABLE trains (
    train_number VARCHAR(10) PRIMARY KEY,
    train_name VARCHAR(150) NOT NULL,
    source_station_code VARCHAR(10) NOT NULL,
    dest_station_code VARCHAR(10) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    distance_km INT NOT NULL,
    duration_hours VARCHAR(20) NOT NULL,
    runs_on_days VARCHAR(50) NOT NULL DEFAULT 'MON,TUE,WED,THU,FRI,SAT,SUN',
    CONSTRAINT fk_train_source FOREIGN KEY (source_station_code) REFERENCES stations(code),
    CONSTRAINT fk_train_dest FOREIGN KEY (dest_station_code) REFERENCES stations(code)
) ENGINE=InnoDB;

-- 4. TRAIN_CLASSES TABLE
CREATE TABLE train_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL,
    class_code VARCHAR(5) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL DEFAULT 60,
    base_fare DECIMAL(10, 2) NOT NULL,
    UNIQUE KEY uk_train_class (train_number, class_code),
    CONSTRAINT fk_class_train FOREIGN KEY (train_number) REFERENCES trains(train_number) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. SEAT_AVAILABILITY TABLE
CREATE TABLE seat_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_number VARCHAR(10) NOT NULL,
    journey_date DATE NOT NULL,
    class_code VARCHAR(5) NOT NULL,
    available_seats INT NOT NULL DEFAULT 40,
    rac_seats INT NOT NULL DEFAULT 10,
    wl_seats INT NOT NULL DEFAULT 0,
    current_status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    UNIQUE KEY uk_train_date_class (train_number, journey_date, class_code),
    CONSTRAINT fk_avail_train FOREIGN KEY (train_number) REFERENCES trains(train_number) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. BOOKINGS TABLE
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_number VARCHAR(10) NOT NULL UNIQUE,
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
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_train FOREIGN KEY (train_number) REFERENCES trains(train_number)
) ENGINE=InnoDB;

-- 7. PASSENGERS TABLE
CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    passenger_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('MALE', 'FEMALE', 'TRANSGENDER') NOT NULL,
    berth_preference VARCHAR(30) DEFAULT 'NO_PREFERENCE',
    allocated_coach VARCHAR(10) DEFAULT NULL,
    allocated_berth VARCHAR(10) DEFAULT NULL,
    berth_type VARCHAR(20) DEFAULT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'CNF',
    CONSTRAINT fk_passenger_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;
