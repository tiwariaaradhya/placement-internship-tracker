
package com.placement.placement_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.placement_tracker.model.Application;
import com.placement.placement_tracker.repository.ApplicationRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    // Add application
    public String addApplication(Application application) {

        application.setId(null);
        applicationRepository.save(application);

        return "Application submitted successfully!";
    }

    // Get all applications
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Get application by ID
    public Application getApplicationById(int id) {
        return applicationRepository.findById(id).orElse(null);
    }

    // Update application
    public String updateApplication(int id, Application updatedApplication) {

        Application existing = getApplicationById(id);

        if (existing == null) {
            return "Application not found!";
        }

        existing.setStudentId(updatedApplication.getStudentId());
        existing.setInternshipId(updatedApplication.getInternshipId());
        existing.setApplicationDate(updatedApplication.getApplicationDate());
        existing.setStatus(updatedApplication.getStatus());

        applicationRepository.save(existing);

        return "Application updated successfully!";
    }

    // Delete application
    public String deleteApplication(int id) {

        if (!applicationRepository.existsById(id)) {
            return "Application not found!";
        }

        applicationRepository.deleteById(id);

        return "Application deleted successfully!";
    }
}
