package com.hdfc.analytics.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HDFC Branch Analytics API")
                        .version("1.0.0")
                        .description("REST API for HDFC Bank Branch Operations Visual Analytics Dashboard")
                        .contact(new Contact()
                                .name("Cognizant Development Team")
                                .email("support@cognizant.com")))
                .servers(List.of(
                        new Server().url("http://localhost:8081").description("Development Server"),
                        new Server().url("http://localhost:8080").description("Alternative Development Server")
                ));
    }
}