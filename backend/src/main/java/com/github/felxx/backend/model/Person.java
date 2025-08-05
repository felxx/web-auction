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
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "person")
public class Person {

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

    private boolean enabled = false;

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
}