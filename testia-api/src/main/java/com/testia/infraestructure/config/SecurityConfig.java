package com.testia.infraestructure.config;

import com.testia.infraestructure.adapter.in.security.CustomAccessDeniedHandler;
import com.testia.infraestructure.adapter.in.security.CustomAuthenticationEntryPoint;
import com.testia.infraestructure.adapter.in.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            CustomAccessDeniedHandler customAccessDeniedHandler,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    }

    // ============================================================
    //                  SECURITY FILTER CHAIN
    // ============================================================
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess ->
                        sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth

                        // ====================================================
                        //                    PUBLIC AUTH
                        // ====================================================
                        .requestMatchers("/api/v1/auth/**").permitAll()

                        // ====================================================
                        //                TEST GENERATION (AI)
                        // ====================================================
                        .requestMatchers(HttpMethod.POST, "/api/v1/tests/generate")
                        .hasAnyRole("ADMIN", "RECRUITER")

                        // ====================================================
                        //                 TEST ASSIGNMENT
                        // ====================================================
                        .requestMatchers(HttpMethod.POST, "/api/v1/tests/assign")
                        .hasAnyRole("ADMIN","RECRUITER")

                        // ====================================================
                        //               DASHBOARD / ASSIGNED TESTS
                        // ====================================================
                        .requestMatchers(HttpMethod.GET, "/api/v1/tests/assigned")
                        .hasAnyRole("ADMIN", "RECRUITER", "CANDIDATE")

                        // ====================================================
                        //                  CANDIDATE FLOW
                        // ====================================================
                        .requestMatchers("/api/v1/candidate/**")
                        .hasRole("CANDIDATE")

                        // ====================================================
                        //                      ADMIN
                        // ====================================================
                        .requestMatchers("/api/v1/admin/**")
                        .hasAnyRole("ADMIN", "RECRUITER")

                        .requestMatchers("/api/v1/dashboard/**")
                        .hasRole("ADMIN")
                        // ====================================================
                        //                EVERYTHING ELSE
                        // ====================================================
                        .requestMatchers("/api/v1/auth/set-password").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // ============================================================
    //                            CORS
    // ============================================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(List.of("*")); // Cambiar en producción
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", config);

        return src;
    }
}
