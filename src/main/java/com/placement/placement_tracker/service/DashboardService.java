
package com.placement.placement_tracker.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.placement.placement_tracker.repository.StudentRepository;
import com.placement.placement_tracker.repository.CompanyRepository;
import com.placement.placement_tracker.repository.InternshipRepository;
import com.placement.placement_tracker.repository.ApplicationRepository;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardService(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            InternshipRepository internshipRepository,
            ApplicationRepository applicationRepository) {

        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalStudents", studentRepository.count());
        stats.put("totalCompanies", companyRepository.count());
        stats.put("totalInternships", internshipRepository.count());

        stats.put("totalApplications", applicationRepository.count());

        stats.put("pendingApplications",
                applicationRepository.countByStatusIgnoreCase("Pending"));

        stats.put("acceptedApplications",
                applicationRepository.countByStatusIgnoreCase("Accepted"));

        stats.put("rejectedApplications",
                applicationRepository.countByStatusIgnoreCase("Rejected"));

        return stats;
    }
}
