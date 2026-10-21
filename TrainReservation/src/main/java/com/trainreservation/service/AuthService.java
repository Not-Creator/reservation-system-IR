package com.trainreservation.service;

import com.trainreservation.dao.UserDAO;
import com.trainreservation.model.User;
import org.mindrot.jbcrypt.BCrypt;

/**
 * AuthService
 * 
 * Handles business logic for user authentication.
 * Implements secure password verification using BCrypt.checkpw.
 */
public class AuthService {

    private final UserDAO userDAO;

    public AuthService() {
        this.userDAO = new UserDAO();
    }

    // Constructor injection for unit testing
    public AuthService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    /**
     * Authenticates a user with email and plain-text password.
     * 
     * Security Best Practices:
     * 1. Never compare passwords using plain text .equals().
     * 2. BCrypt.checkpw() extracts the salt embedded in the stored hash and hashes the candidate password.
     * 3. Consistent generic error message ("Invalid email or password") prevents attacker user-enumeration.
     * 
     * @param email The user's input email
     * @param password The user's input plain-text password
     * @return User object on successful authentication, or null on failure
     */
    public User login(String email, String password) {
        if (email == null || password == null || email.trim().isEmpty() || password.trim().isEmpty()) {
            return null;
        }

        // 1. Fetch user by email
        User user = userDAO.findByEmail(email.trim());

        // 2. If user does not exist, return failure
        if (user == null) {
            return null;
        }

        // 3. Verify candidate password against stored BCrypt hash
        // BCrypt.checkpw handles timing and internal salt matching
        boolean passwordMatches = BCrypt.checkpw(password, user.getPasswordHash());

        if (passwordMatches) {
            return user;
        } else {
            return null;
        }
    }
}
