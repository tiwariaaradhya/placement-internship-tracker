
package com.placement.placement_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.placement.placement_tracker.model.Application;
import com.placement.placement_tracker.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Add application
    @PostMapping
    public String addApplication(@RequestBody Application application) {
        return applicationService.addApplication(application);
    }

    // Get all applications
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable int id) {
        return applicationService.getApplicationById(id);
    }

    // Update application
    @PutMapping("/{id}")
    public String updateApplication(
            @PathVariable int id,
            @RequestBody Application application) {

        return applicationService.updateApplication(id, application);
    }

    // Delete application
    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable int id) {
        return applicationService.deleteApplication(id);
    }
}
