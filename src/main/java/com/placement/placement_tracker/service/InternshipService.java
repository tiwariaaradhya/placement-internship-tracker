
package com.placement.placement_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.placement_tracker.model.Internship;
import com.placement.placement_tracker.repository.InternshipRepository;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;

    public InternshipService(InternshipRepository internshipRepository) {
        this.internshipRepository = internshipRepository;
    }

    // Add internship
    public String addInternship(Internship internship) {

        internship.setId(null);
        internshipRepository.save(internship);

        return "Internship added successfully!";
    }

    // Get all internships
    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }

    // Get internship by ID
    public Internship getInternshipById(int id) {
        return internshipRepository.findById(id).orElse(null);
    }

    // Update internship
    public String updateInternship(int id, Internship updatedInternship) {

        Internship existing = getInternshipById(id);

        if (existing == null) {
            return "Internship not found!";
        }

        existing.setTitle(updatedInternship.getTitle());
        existing.setCompanyId(updatedInternship.getCompanyId());
        existing.setLocation(updatedInternship.getLocation());
        existing.setStipend(updatedInternship.getStipend());
        existing.setDuration(updatedInternship.getDuration());
        existing.setRequiredSkills(updatedInternship.getRequiredSkills());

        internshipRepository.save(existing);

        return "Internship updated successfully!";
    }

    // Delete internship
    public String deleteInternship(int id) {

        if (!internshipRepository.existsById(id)) {
            return "Internship not found!";
        }

        internshipRepository.deleteById(id);

        return "Internship deleted successfully!";
    }
}
