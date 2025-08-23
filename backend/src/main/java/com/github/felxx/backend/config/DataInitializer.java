package com.github.felxx.backend.config;

import com.github.felxx.backend.model.Profile;
import com.github.felxx.backend.model.ProfileType;
import com.github.felxx.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProfileRepository profileRepository;

    @Override
    public void run(String... args) throws Exception {
        if (profileRepository.findByType(ProfileType.BUYER).isEmpty()) {
            Profile buyerProfile = new Profile();
            buyerProfile.setType(ProfileType.BUYER);
            profileRepository.save(buyerProfile);
        }

        if (profileRepository.findByType(ProfileType.SELLER).isEmpty()) {
            Profile sellerProfile = new Profile();
            sellerProfile.setType(ProfileType.SELLER);
            profileRepository.save(sellerProfile);
        }

        if (profileRepository.findByType(ProfileType.ADMIN).isEmpty()) {
            Profile adminProfile = new Profile();
            adminProfile.setType(ProfileType.ADMIN);
            profileRepository.save(adminProfile);
        }
    }
}