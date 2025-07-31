package com.github.felxx.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "feedbacks")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String comment;

    private Integer rating;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "writer_id")
    private Person writer;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private Person recipient;
}
