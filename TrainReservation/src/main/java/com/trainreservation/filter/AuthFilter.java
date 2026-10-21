package com.trainreservation.filter;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * AuthFilter
 * 
 * Intercepts requests to protected pages (booking, passengers, ticket, my-bookings).
 * 
 * Key Viva Questions Answered:
 * 1. Why set Cache-Control headers?
 *    - To prevent the browser from caching sensitive authenticated pages.
 *      Without these headers, pressing the browser "Back" button after logout displays cached passenger data!
 * 
 * 2. How to prevent redirect loops?
 *    - By explicitly allowing public resources (login, register, static CSS/JS) to pass through without checks.
 */
@WebFilter(filterName = "AuthFilter", urlPatterns = {
        "/booking", 
        "/booking/*", 
        "/passenger", 
        "/passengers.jsp",
        "/payment.jsp", 
        "/ticket", 
        "/ticket.jsp", 
        "/my-bookings", 
        "/my-bookings.jsp",
        "/cancel"
})
public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization if needed
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        // 1. Set anti-cache headers to protect sensitive user pages from browser history cache
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
        response.setHeader("Pragma", "no-cache");                                  // HTTP 1.0
        response.setDateHeader("Expires", 0);                                       // Proxies

        // 2. Check if a valid session exists with an authenticated userId
        HttpSession session = request.getSession(false);
        boolean isLoggedIn = (session != null && session.getAttribute("userId") != null);

        if (isLoggedIn) {
            // User is authenticated, proceed along filter chain
            chain.doFilter(request, response);
        } else {
            // User is not logged in, redirect to login page
            response.sendRedirect(request.getContextPath() + "/login.jsp");
        }
    }

    @Override
    public void destroy() {
        // Cleanup if needed
    }
}
