package com.trainreservation.servlet;

import com.trainreservation.model.User;
import com.trainreservation.service.AuthService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * LoginServlet
 * 
 * Maps to /login.
 * 
 * Key Viva Questions Answered:
 * 1. Why do we redirect instead of forward on successful login?
 *    - PRG (Post/Redirect/Get) pattern: Redirecting sends HTTP 302 to the browser,
 *      which changes the URL bar to index.jsp and prevents duplicate form submissions on page refresh.
 * 
 * 2. Why invalidate the old session before creating a new one?
 *    - To prevent Session Fixation attacks: an attacker cannot preset a session ID before login.
 */
@WebServlet(name = "LoginServlet", urlPatterns = {"/login"})
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private AuthService authService;

    @Override
    public void init() throws ServletException {
        this.authService = new AuthService();
    }

    /**
     * Handles GET requests by presenting the login form.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Forward to login.jsp
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }

    /**
     * Handles POST requests by authenticating credentials and creating a fresh session.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // 1. Validate inputs are not empty
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            request.setAttribute("error", "Email and password are required.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
            return;
        }

        // 2. Call AuthService to verify user and BCrypt hash
        User user = authService.login(email.trim(), password);

        // 3. Check authentication result
        if (user == null) {
            // Keep error message generic to prevent account enumeration
            request.setAttribute("error", "Invalid email or password.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
            return;
        }

        // 4. Invalidate old session to prevent Session Fixation attack
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        // 5. Create a brand new session and store essential user attributes
        HttpSession session = request.getSession(true);
        session.setAttribute("userId", user.getId());
        session.setAttribute("userName", user.getName());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userRole", user.getRole());

        // 6. Redirect based on role (Post-Redirect-Get pattern)
        if (user.isAdmin()) {
            response.sendRedirect(request.getContextPath() + "/admin/trains.jsp");
        } else {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
        }
    }
}
