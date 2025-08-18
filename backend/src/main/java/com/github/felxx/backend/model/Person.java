package com.github.felxx.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "person")
public class Person implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(nullable = false)
    private String password;

    private String validationCode;

    private LocalDateTime validationCodeExpiration;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Setter(value = AccessLevel.NONE)
    private List<PersonProfile> personProfiles;

    public void setPersonProfile(List<PersonProfile> personProfiles) {
        for (PersonProfile p : personProfiles) {
            p.setPerson(this);
        }
        this.personProfiles = personProfiles;
    }

    @Lob
    private byte[] profilePicture;

    @OneToMany(mappedBy = "creator")
    private List<Category> createdCategories;

    @OneToMany(mappedBy = "publisher")
    private List<Auction> publishedAuctions;

    @OneToMany(mappedBy = "bidder")
    private List<Bid> bids;

    @OneToMany(mappedBy = "writer")
    private List<Feedback> writtenFeedbacks;

    @OneToMany(mappedBy = "recipient")
    private List<Feedback> receivedFeedbacks;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return personProfiles.stream()
                .map(profile -> new SimpleGrantedAuthority(profile.getProfile().getType().name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}