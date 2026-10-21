package com.trainreservation.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

/**
 * DBConnection Utility Class
 * 
 * Purpose:
 * Centralizes the creation and management of JDBC database connections to MySQL.
 * 
 * Key Viva Exam Questions Answered:
 * 1. Why do we load the JDBC driver in a static block?
 *    - The static block executes once when the class is loaded into the JVM.
 *      Class.forName("com.mysql.cj.jdbc.Driver") registers the MySQL driver with DriverManager.
 * 
 * 2. Why load credentials from db.properties rather than hardcoding?
 *    - Separation of concerns and security: Credentials can be changed per environment (dev, test, prod)
 *      without recompiling Java code.
 * 
 * 3. Why provide close() helper methods?
 *    - Database connections, statements, and result sets consume precious database and OS socket resources.
 *      Failing to close them causes "connection leaks", exhausting the database pool.
 */
public class DBConnection {

    private static String url;
    private static String user;
    private static String password;
    private static String driver;

    // Static block to initialize driver and load properties once when class is loaded
    static {
        try {
            Properties props = new Properties();
            InputStream in = DBConnection.class.getClassLoader().getResourceAsStream("db.properties");
            
            if (in != null) {
                props.load(in);
                url = props.getProperty("db.url");
                user = props.getProperty("db.user");
                password = props.getProperty("db.password");
                driver = props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
            } else {
                // Fallback default values if db.properties is missing
                url = "jdbc:mysql://localhost:3306/train_reservation_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
                user = "root";
                password = "password";
                driver = "com.mysql.cj.jdbc.Driver";
            }

            // Register JDBC driver with DriverManager
            Class.forName(driver);
            System.out.println("[DBConnection] MySQL JDBC Driver loaded successfully.");

        } catch (Exception e) {
            System.err.println("[DBConnection] Error initializing database configuration: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Obtains a new connection to the MySQL database.
     * 
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    /**
     * Safely closes a Connection.
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("[DBConnection] Failed to close Connection: " + e.getMessage());
            }
        }
    }

    /**
     * Safely closes a Statement / PreparedStatement.
     */
    public static void close(Statement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                System.err.println("[DBConnection] Failed to close Statement: " + e.getMessage());
            }
        }
    }

    /**
     * Safely closes a ResultSet.
     */
    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                System.err.println("[DBConnection] Failed to close ResultSet: " + e.getMessage());
            }
        }
    }

    /**
     * Overloaded convenience method to close all three resources at once.
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        close(rs);
        close(stmt);
        close(conn);
    }

    /**
     * Overloaded convenience method for statements without ResultSets (e.g. INSERT, UPDATE).
     */
    public static void close(Connection conn, Statement stmt) {
        close(stmt);
        close(conn);
    }
}
