package com.jobtracker.app.repo;

import com.jobtracker.app.model.JobApplication;
import com.jobtracker.app.model.ApplicationStatus;
import com.jobtracker.app.model.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    
    List<JobApplication> findByStatus(ApplicationStatus status);
    
    List<JobApplication> findByPriority(Priority priority);
    
    List<JobApplication> findByCompanyNameContainingIgnoreCase(String companyName);
    
    List<JobApplication> findByJobTitleContainingIgnoreCase(String jobTitle);
    
    List<JobApplication> findByLocationContainingIgnoreCase(String location);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.followUpDate <= :date AND ja.status NOT IN ('OFFER_ACCEPTED', 'REJECTED', 'WITHDRAWN')")
    List<JobApplication> findApplicationsNeedingFollowUp(@Param("date") OffsetDateTime date);
    
    @Query("SELECT ja FROM JobApplication ja WHERE ja.interviewDate BETWEEN :startDate AND :endDate")
    List<JobApplication> findUpcomingInterviews(@Param("startDate") OffsetDateTime startDate, @Param("endDate") OffsetDateTime endDate);
    
    @Query("SELECT COUNT(ja) FROM JobApplication ja WHERE ja.status = :status")
    Long countByStatus(@Param("status") ApplicationStatus status);
}
