<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Indian Railways PRS</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

    <%-- Include Shared Header --%>
    <%@ include file="includes/header.jspf" %>

    <div class="prs-container">
        <!-- Narrow Centered Form Box (380px) with 1px Solid Border -->
        <div style="max-width: 380px; margin: 40px auto;">
            <div class="prs-card">
                <div class="prs-card-header">
                    User Login • IRCTC PRS
                </div>
                
                <div class="prs-card-body">
                    <%-- Error Message Alert --%>
                    <c:if test="${not empty error}">
                        <div class="prs-alert-error">
                            ${error}
                        </div>
                    </c:if>

                    <%-- Login Form --%>
                    <form method="post" action="login">
                        <div class="prs-form-group">
                            <label class="prs-label" for="email">Registered Email Address</label>
                            <input type="email" 
                                   id="email" 
                                   name="email" 
                                   class="prs-input" 
                                   required 
                                   autocomplete="email"
                                   placeholder="name@example.com"
                                   value="${param.email}">
                        </div>

                        <div class="prs-form-group">
                            <label class="prs-label" for="password">Password</label>
                            <input type="password" 
                                   id="password" 
                                   name="password" 
                                   class="prs-input" 
                                   required 
                                   autocomplete="current-password"
                                   placeholder="Enter your password">
                        </div>

                        <div style="margin-top: 24px; margin-bottom: 16px;">
                            <button type="submit" class="prs-btn-primary">
                                Secure Sign In
                            </button>
                        </div>
                    </form>

                    <%-- Link to Registration --%>
                    <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; text-align: center; font-size: 11px; color: #64748B;">
                        New to PRS? <a href="register.jsp" style="color: #0F2C59; font-weight: 700; text-decoration: none;">Register for an Account</a>
                    </div>
                </div>
            </div>

            <%-- Default test credentials box for student demo / viva --%>
            <div style="margin-top: 16px; padding: 12px; background: #F1F5F9; border: 1px dashed #94A3B8; font-size: 11px; color: #475569;">
                <strong>Test Accounts for Viva Demo:</strong><br>
                • Passenger: <code>rahul.sharma@gmail.com</code> / <code>User@123</code><br>
                • Admin: <code>admin@railnet.gov.in</code> / <code>Admin@123</code>
            </div>
        </div>
    </div>

    <%-- Include Shared Footer --%>
    <%@ include file="includes/footer.jspf" %>

</body>
</html>
