package com.jobtracker.app.web;

import com.jobtracker.app.model.JobApplication;
import com.jobtracker.app.model.ApplicationStatus;
import com.jobtracker.app.model.Priority;
import com.jobtracker.app.repo.JobApplicationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/job-applications")
@CrossOrigin(origins = {"http://localhost:5173"})
public class JobApplicationController {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationController(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @GetMapping
    public List<JobApplication> list() {
        return jobApplicationRepository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication create(@RequestBody JobApplication jobApplication) {
        jobApplication.setId(null);
        jobApplication.setCreatedAt(OffsetDateTime.now());
        jobApplication.setUpdatedAt(OffsetDateTime.now());
        return jobApplicationRepository.save(jobApplication);
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @RequestBody JobApplication jobApplication) {
        return jobApplicationRepository.findById(id)
                .map(existingApplication -> {
                    existingApplication.setCompanyName(jobApplication.getCompanyName());
                    existingApplication.setJobTitle(jobApplication.getJobTitle());
                    existingApplication.setJobDescription(jobApplication.getJobDescription());
                    existingApplication.setLocation(jobApplication.getLocation());
                    existingApplication.setJobType(jobApplication.getJobType());
                    existingApplication.setStatus(jobApplication.getStatus());
                    existingApplication.setPriority(jobApplication.getPriority());
                    existingApplication.setSource(jobApplication.getSource());
                    existingApplication.setJobUrl(jobApplication.getJobUrl());
                    existingApplication.setContactPerson(jobApplication.getContactPerson());
                    existingApplication.setContactEmail(jobApplication.getContactEmail());
                    existingApplication.setAppliedDate(jobApplication.getAppliedDate());
                    existingApplication.setInterviewDate(jobApplication.getInterviewDate());
                    existingApplication.setFollowUpDate(jobApplication.getFollowUpDate());
                    existingApplication.setNotes(jobApplication.getNotes());
                    existingApplication.setSalaryRange(jobApplication.getSalaryRange());
                    existingApplication.setUpdatedAt(OffsetDateTime.now());
                    return jobApplicationRepository.save(existingApplication);
                })
                .orElseThrow(() -> new RuntimeException("Job application not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        jobApplicationRepository.deleteById(id);
    }

    @GetMapping("/{id}")
    public JobApplication getById(@PathVariable Long id) {
        return jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job application not found with id: " + id));
    }

    @GetMapping("/status/{status}")
    public List<JobApplication> getByStatus(@PathVariable ApplicationStatus status) {
        return jobApplicationRepository.findByStatus(status);
    }

    @GetMapping("/priority/{priority}")
    public List<JobApplication> getByPriority(@PathVariable Priority priority) {
        return jobApplicationRepository.findByPriority(priority);
    }

    @GetMapping("/search")
    public List<JobApplication> search(@RequestParam(required = false) String company,
                                      @RequestParam(required = false) String title,
                                      @RequestParam(required = false) String location) {
        if (company != null && !company.isEmpty()) {
            return jobApplicationRepository.findByCompanyNameContainingIgnoreCase(company);
        } else if (title != null && !title.isEmpty()) {
            return jobApplicationRepository.findByJobTitleContainingIgnoreCase(title);
        } else if (location != null && !location.isEmpty()) {
            return jobApplicationRepository.findByLocationContainingIgnoreCase(location);
        }
        return jobApplicationRepository.findAll();
    }

    @GetMapping("/follow-up")
    public List<JobApplication> getApplicationsNeedingFollowUp() {
        return jobApplicationRepository.findApplicationsNeedingFollowUp(OffsetDateTime.now());
    }

    @GetMapping("/upcoming-interviews")
    public List<JobApplication> getUpcomingInterviews(@RequestParam(defaultValue = "7") int days) {
        OffsetDateTime startDate = OffsetDateTime.now();
        OffsetDateTime endDate = startDate.plusDays(days);
        return jobApplicationRepository.findUpcomingInterviews(startDate, endDate);
    }

    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        for (ApplicationStatus status : ApplicationStatus.values()) {
            Long count = jobApplicationRepository.countByStatus(status);
            stats.put(status.name().toLowerCase(), count);
        }
        
        return stats;
    }
}
