package com.github.felxx.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.felxx.backend.model.Calculator;
import com.github.felxx.backend.service.HelloService;

@RestController
public class Hello {

    @Autowired
    private HelloService helloService;

    @GetMapping("/")
    public String hello() {
        return "Hello, Spring!";
    }

    @GetMapping("/sum")
    public Integer sum(@RequestParam("v1") Integer value1, @RequestParam("v2") Integer value2) {
        return value1 + value2;
    }

    @PostMapping("/sum")
    public Calculator sum(@RequestBody Calculator calculator) {
        return helloService.sum(calculator);
    }
}
