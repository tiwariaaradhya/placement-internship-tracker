
package com.placement.placement_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.placement.placement_tracker.model.Internship;
import com.placement.placement_tracker.service.InternshipService;

@RestController
@RequestMapping("/internships")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    // Add internship
    @PostMapping
    public String addInternship(@RequestBody Internship internship) {
        return internshipService.addInternship(internship);
    }

    // Get all internships
    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    // Get internship by ID
    @GetMapping("/{id}")
    public Internship getInternshipById(@PathVariable int id) {
        return internshipService.getInternshipById(id);
    }

    // Update internship
    @PutMapping("/{id}")
    public String updateInternship(
            @PathVariable int id,
            @RequestBody Internship internship) {

        return internshipService.updateInternship(id, internship);
    }

    // Delete internship
    @DeleteMapping("/{id}")
    public String deleteInternship(@PathVariable int id) {
        return internshipService.deleteInternship(id);
    }
}
