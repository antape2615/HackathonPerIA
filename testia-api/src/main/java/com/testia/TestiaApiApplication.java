package com.testia;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TestiaApiApplication {


	public static void main(String[] args) {
        // Cargar .env al entorno
        Dotenv dotenv = Dotenv.configure().load();
        // Pasar variables al System ENV para que Spring pueda leerlas
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
        System.setProperty("BREVO_API_KEY", dotenv.get("BREVO_API_KEY"));
        System.setProperty("BREVO_SENDER_EMAIL", dotenv.get("BREVO_SENDER_EMAIL"));
        System.setProperty("BREVO_SENDER_NAME", dotenv.get("BREVO_SENDER_NAME"));

        System.out.println("🔑 API_KEY cargada en System? " + System.getProperty("GROQ_API_KEY"));
        SpringApplication.run(TestiaApiApplication.class, args);
	}

}
