package com.testia.infraestructure.adapter.in.security;

import com.testia.infraestructure.adapter.out.jwt.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    public JwtAuthFilter(JwtService jwtService,
                         AuthenticationEntryPoint authenticationEntryPoint) {
        this.jwtService = jwtService;
        this.authenticationEntryPoint = authenticationEntryPoint;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String normalizedHeader = authHeader.trim().toLowerCase();

        if (!normalizedHeader.startsWith("bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7).trim();

        if (token.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Claims claims = jwtService.validateToken(token);

            if (claims == null) {
                throw new BadCredentialsException("Invalid or expired token");
            }

            String userId = claims.getSubject();
            Object roleClaim = claims.get("role");

            Collection<? extends GrantedAuthority> authorities =
                    extractAuthorities(roleClaim);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (AuthenticationException ex) {
            authenticationEntryPoint.commence(request, response, ex);
            return;
        } catch (Exception ex) {
            // Convertimos cualquier error a AuthenticationException
            AuthenticationException authEx =
                    new BadCredentialsException("Invalid or expired token");

            authenticationEntryPoint.commence(request, response, authEx);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private Collection<? extends GrantedAuthority> extractAuthorities(Object roleClaim) {
        if (roleClaim instanceof String role) {
            return List.of(() -> "ROLE_" + role);
        } else if (roleClaim instanceof List<?> roleList) {
            return roleList.stream()
                    .map(String::valueOf)
                    .map(role -> (GrantedAuthority) () -> "ROLE_" + role)
                    .collect(Collectors.toList());
        }
        return List.of();
    }
}
