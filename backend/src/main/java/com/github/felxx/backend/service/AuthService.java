package com.github.felxx.backend.service;

import com.github.felxx.backend.dto.auth.AuthRequest;
import com.github.felxx.backend.dto.auth.AuthResponse;
import com.github.felxx.backend.dto.auth.RegisterRequest;
import com.github.felxx.backend.exception.BusinessException;
import com.github.felxx.backend.exception.NotFoundException;
import com.github.felxx.backend.jwt.JwtService;
import com.github.felxx.backend.model.Person;
import com.github.felxx.backend.model.PersonProfile;
import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import com.github.felxx.backend.repository.PersonRepository;
import com.github.felxx.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PersonRepository personRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (request.getProfileType() == null ||
            (request.getProfileType() != ProfileType.BUYER && 
             request.getProfileType() != ProfileType.SELLER && 
             request.getProfileType() != ProfileType.ADMIN)) {
            throw new BusinessException("A profile type of 'BUYER', 'SELLER', or 'ADMIN' must be selected.");
        }

        Profile selectedProfile = profileRepository.findByType(request.getProfileType())
                .orElseThrow(() -> new NotFoundException("Profile not found: " + request.getProfileType()));

        var user = new Person();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        PersonProfile personProfile = new PersonProfile();
        personProfile.setPerson(user);
        personProfile.setProfile(selectedProfile);

        user.setPersonProfile(Collections.singletonList(personProfile));

        personRepository.save(user);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList()));

        var jwtToken = jwtService.generateToken(extraClaims, user);
        return AuthResponse.builder().token(jwtToken).build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = personRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found with email: " + request.getEmail()));
        
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", user.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(Collectors.toList()));

        var jwtToken = jwtService.generateToken(extraClaims, user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}