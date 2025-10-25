package com.ccmart.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import com.ccmart.backend.repository.UserRepository;
import com.ccmart.backend.model.User;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import javax.crypto.SecretKey;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Autowired
    private UserRepository userRepository;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                Claims claims = Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String userId = claims.getSubject();
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Load user and authorities
                    try {
                        Long id = Long.valueOf(userId);
                        User user = userRepository.findById(id).orElse(null);
                        if (user != null) {
                            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase());
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getId(), null, Collections.singletonList(authority));
                            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    } catch (NumberFormatException nfe) {
                        // ignore invalid subject
                    }
                }
            } catch (Exception ex) {
                // invalid token - leave security context empty
            }
        }

        filterChain.doFilter(request, response);
    }
}
