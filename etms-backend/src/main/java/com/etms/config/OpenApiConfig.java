package com.etms.config;

import io.swagger.v3.oas.models.*;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  @Bean
  public OpenAPI customOpenAPI() {

    SecurityScheme bearerScheme = new SecurityScheme()
        .type(SecurityScheme.Type.HTTP)
        .scheme("bearer")
        .bearerFormat("JWT");

    return new OpenAPI()
        .info(new Info()
            .title("ETMS API")
            .version("1.0")
            .description("Employee Task Management System"))
        .components(new Components()
            .addSecuritySchemes("bearerAuth", bearerScheme))
        .addSecurityItem(new SecurityRequirement()
            .addList("bearerAuth"));
  }
}
