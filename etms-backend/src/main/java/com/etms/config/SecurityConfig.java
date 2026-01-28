package com.etms.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.web.cors.CorsConfigurationSource;



@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

  private final JwtFilter jwtFilter;
  private final CustomUserDetailsService userDetailsService;
  private final CorsConfigurationSource corsConfigurationSource;


  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
    .cors(cors -> cors.configurationSource(corsConfigurationSource)) // ✅ FIXED

      .csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth

    		    // 🔓 PUBLIC
    		    .requestMatchers(
    		        "/api/auth/login",
    		        "/api/auth/forgot-password",
    		        "/api/auth/reset-password",
    		        "/api/bootstrap-admin",
    		        "/swagger-ui/**",
    		        "/v3/api-docs/**",
    		        "/swagger-ui.html"
    		    ).permitAll()

    		    // 🔐 PASSWORD CHANGE
    		    .requestMatchers("/api/auth/change-password")
    		        .hasAnyRole("ADMIN","EMPLOYEE")

    		     // 🔐 ADMIN TASK ROUTES
    		        .requestMatchers("/api/tasks/history")
    		            .hasRole("ADMIN")

    		        .requestMatchers(HttpMethod.GET, "/api/tasks")
    		            .hasRole("ADMIN")

    		        .requestMatchers(HttpMethod.POST, "/api/tasks")
    		            .hasRole("ADMIN")

    		        .requestMatchers(HttpMethod.DELETE, "/api/tasks/**")
    		            .hasRole("ADMIN")

    		        // 🔐 EMPLOYEE TASK ROUTES
    		        .requestMatchers("/api/tasks/my")
    		            .hasRole("EMPLOYEE")

    		        .requestMatchers("/api/tasks/history/my")
    		            .hasRole("EMPLOYEE")

    		        .requestMatchers("/api/tasks/*/complete")
    		            .hasRole("EMPLOYEE")

    		        // 🔐 BOTH (status updates + fallback)
    		        .requestMatchers(HttpMethod.PUT, "/api/tasks/**")
    		            .hasAnyRole("ADMIN","EMPLOYEE")

//    		        .requestMatchers("/api/tasks/**")
//    		            .hasAnyRole("ADMIN","EMPLOYEE")


    		    // 🔐 EMPLOYEES (ADMIN ONLY)
    		    .requestMatchers("/api/employees/**")
    		        .hasRole("ADMIN")

    		    .anyRequest().authenticated()
    		)



      .sessionManagement(sess -> sess
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      );

    http.addFilterBefore(jwtFilter,
        UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
  
  
}
