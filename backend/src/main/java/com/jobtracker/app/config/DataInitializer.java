package com.jobtracker.app.config;

import com.jobtracker.app.model.JobApplication;
import com.jobtracker.app.model.ApplicationStatus;
import com.jobtracker.app.model.Priority;
import com.jobtracker.app.repo.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Override
    public void run(String... args) throws Exception {
        // Clear existing data
        jobApplicationRepository.deleteAll();

        // Add sample job applications
        JobApplication app1 = new JobApplication();
        app1.setCompanyName("Google");
        app1.setJobTitle("Senior Software Engineer");
        app1.setJobDescription("We are looking for a Senior Software Engineer to join our team. You will work on cutting-edge projects and collaborate with world-class engineers.");
        app1.setLocation("Mountain View, CA");
        app1.setJobType("Full-time");
        app1.setStatus(ApplicationStatus.UNDER_REVIEW);
        app1.setPriority(Priority.HIGH);
        app1.setSource("LinkedIn");
        app1.setJobUrl("https://careers.google.com/jobs/results/123456");
        app1.setContactPerson("Sarah Johnson");
        app1.setContactEmail("sarah.johnson@google.com");
        app1.setAppliedDate(OffsetDateTime.now().minusDays(5));
        app1.setInterviewDate(OffsetDateTime.now().plusDays(3));
        app1.setFollowUpDate(OffsetDateTime.now().plusDays(7));
        app1.setNotes("Applied through LinkedIn. Received confirmation email. Waiting for next steps.");
        app1.setSalaryRange("$150,000 - $200,000");
        app1.setCreatedAt(OffsetDateTime.now().minusDays(5));
        app1.setUpdatedAt(OffsetDateTime.now().minusDays(5));
        jobApplicationRepository.save(app1);

        JobApplication app2 = new JobApplication();
        app2.setCompanyName("Microsoft");
        app2.setJobTitle("Full Stack Developer");
        app2.setJobDescription("Join our Azure team as a Full Stack Developer. You'll work on cloud services and help build the future of computing.");
        app2.setLocation("Seattle, WA");
        app2.setJobType("Full-time");
        app2.setStatus(ApplicationStatus.PHONE_SCREEN);
        app2.setPriority(Priority.MEDIUM);
        app2.setSource("Company Website");
        app2.setJobUrl("https://careers.microsoft.com/us/en/job/123456");
        app2.setContactPerson("Mike Chen");
        app2.setContactEmail("mike.chen@microsoft.com");
        app2.setAppliedDate(OffsetDateTime.now().minusDays(3));
        app2.setInterviewDate(OffsetDateTime.now().plusDays(1));
        app2.setFollowUpDate(OffsetDateTime.now().plusDays(5));
        app2.setNotes("Phone screen scheduled for tomorrow. Prepared for technical questions about React and Node.js.");
        app2.setSalaryRange("$120,000 - $160,000");
        app2.setCreatedAt(OffsetDateTime.now().minusDays(3));
        app2.setUpdatedAt(OffsetDateTime.now().minusDays(3));
        jobApplicationRepository.save(app2);

        JobApplication app3 = new JobApplication();
        app3.setCompanyName("Amazon");
        app3.setJobTitle("Software Development Engineer");
        app3.setJobDescription("Work on AWS services and help scale the world's largest cloud platform. Focus on distributed systems and scalability.");
        app3.setLocation("Seattle, WA");
        app3.setJobType("Full-time");
        app3.setStatus(ApplicationStatus.TECHNICAL_INTERVIEW);
        app3.setPriority(Priority.HIGH);
        app3.setSource("Indeed");
        app3.setJobUrl("https://www.amazon.jobs/en/jobs/123456");
        app3.setContactPerson("Alex Rodriguez");
        app3.setContactEmail("alex.rodriguez@amazon.com");
        app3.setAppliedDate(OffsetDateTime.now().minusDays(7));
        app3.setInterviewDate(OffsetDateTime.now().plusDays(2));
        app3.setFollowUpDate(OffsetDateTime.now().plusDays(4));
        app3.setNotes("Passed phone screen. Technical interview scheduled. Reviewing system design and algorithms.");
        app3.setSalaryRange("$130,000 - $180,000");
        app3.setCreatedAt(OffsetDateTime.now().minusDays(7));
        app3.setUpdatedAt(OffsetDateTime.now().minusDays(7));
        jobApplicationRepository.save(app3);

        JobApplication app4 = new JobApplication();
        app4.setCompanyName("Netflix");
        app4.setJobTitle("Frontend Engineer");
        app4.setJobDescription("Join our streaming platform team. Work on React applications that serve millions of users worldwide.");
        app4.setLocation("Los Gatos, CA");
        app4.setJobType("Full-time");
        app4.setStatus(ApplicationStatus.APPLIED);
        app4.setPriority(Priority.MEDIUM);
        app4.setSource("LinkedIn");
        app4.setJobUrl("https://jobs.netflix.com/jobs/123456");
        app4.setContactPerson("Lisa Wang");
        app4.setContactEmail("lisa.wang@netflix.com");
        app4.setAppliedDate(OffsetDateTime.now().minusDays(2));
        app4.setFollowUpDate(OffsetDateTime.now().plusDays(5));
        app4.setNotes("Just applied. Waiting for response. Company culture seems great.");
        app4.setSalaryRange("$140,000 - $190,000");
        app4.setCreatedAt(OffsetDateTime.now().minusDays(2));
        app4.setUpdatedAt(OffsetDateTime.now().minusDays(2));
        jobApplicationRepository.save(app4);

        JobApplication app5 = new JobApplication();
        app5.setCompanyName("Meta");
        app5.setJobTitle("React Developer");
        app5.setJobDescription("Work on Facebook's frontend applications. Build user interfaces that connect billions of people.");
        app5.setLocation("Menlo Park, CA");
        app5.setJobType("Full-time");
        app5.setStatus(ApplicationStatus.OFFER_RECEIVED);
        app5.setPriority(Priority.CRITICAL);
        app5.setSource("Company Website");
        app5.setJobUrl("https://www.metacareers.com/jobs/123456");
        app5.setContactPerson("David Kim");
        app5.setContactEmail("david.kim@meta.com");
        app5.setAppliedDate(OffsetDateTime.now().minusDays(10));
        app5.setInterviewDate(OffsetDateTime.now().minusDays(3));
        app5.setFollowUpDate(OffsetDateTime.now().plusDays(2));
        app5.setNotes("Received offer! $160k base + $40k signing bonus. Need to respond by Friday.");
        app5.setSalaryRange("$160,000 - $200,000");
        app5.setCreatedAt(OffsetDateTime.now().minusDays(10));
        app5.setUpdatedAt(OffsetDateTime.now().minusDays(10));
        jobApplicationRepository.save(app5);

        System.out.println("Sample job application data initialized successfully!");
    }
}
