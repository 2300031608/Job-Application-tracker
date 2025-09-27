package com.jobtracker.app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "job_applications")
@Getter
@Setter
@NoArgsConstructor
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String jobTitle;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(length = 100)
    private String location;

    @Column(length = 50)
    private String jobType; // Full-time, Part-time, Contract, Internship

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority = Priority.MEDIUM;

    @Column(length = 100)
    private String source; // LinkedIn, Indeed, Company Website, etc.

    @Column(length = 200)
    private String jobUrl;

    @Column(length = 100)
    private String contactPerson;

    @Column(length = 200)
    private String contactEmail;

    @Column(name = "applied_date")
    private OffsetDateTime appliedDate;

    @Column(name = "interview_date")
    private OffsetDateTime interviewDate;

    @Column(name = "follow_up_date")
    private OffsetDateTime followUpDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "salary_range")
    private String salaryRange;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();
}
