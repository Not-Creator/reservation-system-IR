package com.trainreservation.dao;

import com.trainreservation.model.User;
import com.trainreservation.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * UserDAO (Data Access Object)
 * 
 * Handles all database operations related to the 'users' table.
 * All SQL statements are strictly encapsulated here using PreparedStatement.
 */
public class UserDAO {

    /**
     * Finds a user by their unique email address.
     * Uses PreparedStatement with '?' placeholder to prevent SQL Injection.
     * Uses Try-With-Resources to guarantee the Connection, PreparedStatement, 
     * and ResultSet are cleanly closed even if an exception occurs.
     * 
     * @param email The user's registered email
     * @return User object if found, or null if no user matches
     */
    public User findByEmail(String email) {
        String sql = "SELECT id, name, email, password_hash, phone, role FROM users WHERE email = ?";

        // Try-with-resources: automatically closes conn, stmt, and rs in reverse order
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);

            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    User user = new User();
                    user.setId(rs.getInt("id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setPasswordHash(rs.getString("password_hash"));
                    user.setPhone(rs.getString("phone"));
                    user.setRole(rs.getString("role"));
                    return user;
                }
            }

        } catch (SQLException e) {
            System.err.println("[UserDAO] Error finding user by email: " + e.getMessage());
            e.printStackTrace();
        }

        return null; // Return null if not found or an error occurred
    }
}
