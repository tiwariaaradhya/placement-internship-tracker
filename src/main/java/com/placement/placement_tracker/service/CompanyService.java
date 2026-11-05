
package com.placement.placement_tracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.placement.placement_tracker.model.Company;
import com.placement.placement_tracker.repository.CompanyRepository;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    // Add company
    public String addCompany(Company company) {
        company.setId(null);
        companyRepository.save(company);

        return "Company added successfully!";
    }

    // Get all companies
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    // Get company by ID
    public Company getCompanyById(int id) {
        return companyRepository.findById(id).orElse(null);
    }

    // Update company
    public String updateCompany(int id, Company updatedCompany) {

        Company existing = getCompanyById(id);

        if (existing == null) {
            return "Company not found!";
        }

        existing.setName(updatedCompany.getName());
        existing.setLocation(updatedCompany.getLocation());
        existing.setIndustry(updatedCompany.getIndustry());
        existing.setWebsite(updatedCompany.getWebsite());

        companyRepository.save(existing);

        return "Company updated successfully!";
    }

    // Delete company
    public String deleteCompany(int id) {

        if (!companyRepository.existsById(id)) {
            return "Company not found!";
        }

        companyRepository.deleteById(id);

        return "Company deleted successfully!";
    }
}
