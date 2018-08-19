package com.progressive.code.crud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
@PropertySource("classpath:/application.properties")
public class CrudApp {

    public static void main(String[] args) {
        SpringApplication.run(CrudApp.class, args);
    }

}
