package com.project.bidpulse;

// CorsConfig.java is no longer needed.
// CORS is now configured directly inside SecurityConfig via CorsConfigurationSource.
// This file is kept as a placeholder to avoid confusion; it registers no beans.

import org.springframework.context.annotation.Configuration;

@Configuration
public class CorsConfig {
    // CORS is handled in SecurityConfig.corsConfigurationSource()
}
