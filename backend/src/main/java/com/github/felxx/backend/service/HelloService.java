package com.github.felxx.backend.service;

import org.springframework.stereotype.Service;

import com.github.felxx.backend.model.Calculator;

@Service
public class HelloService {
    public Calculator sum(Calculator calculator) {
        calculator.setResult(calculator.getValue1() + calculator.getValue2());
        return calculator;
    }
}
