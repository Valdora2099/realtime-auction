package com.project.bidpulse.security;

import com.project.bidpulse.Entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // 256-bit base64-encoded secret — change this in production!
    private static final String SECRET_BASE64 = "bmlkUHVsc2VTZWNyZXRLZXlGb3JKV1QyMDI2TXVzdEJlMzJCeXRlc0xvbmchIQ==";

    private static final long EXPIRY_MS = 1000L * 60 * 60 * 24; // 24 hours

    private SecretKey key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_BASE64));
    }

    /** Generate a signed HS256 JWT for the given user. */
    public String generateToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getUserId());
        claims.put("role", user.getRole());

        return Jwts.builder()
                .claims(claims)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(key())
                .compact();
    }

    /**
     * Parse and validate a JWT, returning its Claims. Throws on invalid/expired.
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractEmail(String token) {
        return validateToken(token).getSubject();
    }

    public String extractRole(String token) {
        return validateToken(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        Number id = validateToken(token).get("userId", Number.class);
        return id != null ? id.longValue() : null;
    }
}
