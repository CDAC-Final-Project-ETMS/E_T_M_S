package com.etms.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final CustomUserDetailsService userDetailsService;

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) {
      String path = request.getServletPath();

      return path.equals("/api/auth/login")
          || path.equals("/api/auth/forgot-password")
          || path.equals("/api/auth/reset-password")
          || path.equals("/api/auth/bootstrap-admin");
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain chain)
          throws ServletException, IOException {

      String authHeader = request.getHeader("Authorization");

      if (authHeader != null && authHeader.startsWith("Bearer ")) {

          String token = authHeader.substring(7);
          String username = jwtUtil.extractUsername(token);

          if (username != null &&
              SecurityContextHolder.getContext().getAuthentication() == null) {

              UserDetails userDetails =
                  userDetailsService.loadUserByUsername(username);

              // 🔒 BLOCK INACTIVE USERS EVEN WITH VALID TOKEN
              if (userDetails instanceof CustomUserDetails cud) {
                  if (!cud.isActive()) {
                      SecurityContextHolder.clearContext();
                      response.sendError(
                          HttpServletResponse.SC_UNAUTHORIZED,
                          "Account deactivated"
                      );
                      return;
                  }
              }

              if (jwtUtil.validateToken(token, userDetails.getUsername())) {

                  UsernamePasswordAuthenticationToken authToken =
                      new UsernamePasswordAuthenticationToken(
                          userDetails,
                          null,
                          userDetails.getAuthorities()
                      );

                  authToken.setDetails(
                          new WebAuthenticationDetailsSource()
                                  .buildDetails(request));

                  SecurityContextHolder.getContext()
                          .setAuthentication(authToken);
              }
          }
      }

      chain.doFilter(request, response);
  }
}
