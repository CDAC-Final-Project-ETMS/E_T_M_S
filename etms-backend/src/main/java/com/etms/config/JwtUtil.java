package com.etms.config;

import javax.crypto.SecretKey;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function; // ✅ ADD

@Component
public class JwtUtil {

  private final String SECRET = "etms-secret-key-etms-secret-key-etms"; 
  private final long EXPIRATION = 1000 * 60 * 60 * 24;

  private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(SECRET.getBytes());
  }

  public String generateToken(String username, String role) {
    return Jwts.builder()
      .subject(username)
      .claim("role", role)
      .issuedAt(new Date())
      .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
      .signWith(getSigningKey())
      .compact();
  }

  public String extractUsername(String token) {
    Claims claims = Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();

    return claims.getSubject();
  }

  public boolean validateToken(String token, String username) {
    return extractUsername(token).equals(username);
  }

  // ✅ ADD THESE TWO METHODS

  public <T> T extractClaim(String token, Function<Claims, T> resolver) {
    Claims claims = Jwts.parser()
      .verifyWith(getSigningKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();

    return resolver.apply(claims);
  }

  public String extractRole(String token) {
    return extractClaim(token, claims -> claims.get("role", String.class));
  }
}
