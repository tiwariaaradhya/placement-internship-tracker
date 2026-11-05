package com.placement.placement_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.placement.placement_tracker.model.Company;
import com.placement.placement_tracker.service.CompanyService;

@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @GetMapping
    public List<Company> getCompanies() {
        return companyService.getAllCompanies();
    }

    @PostMapping
    public String addCompany(@RequestBody Company company) {
        return companyService.addCompany(company);
    }

    @GetMapping("/{id}")
    public Company getCompany(@PathVariable int id) {
        return companyService.getCompanyById(id);
    }

    @PutMapping("/{id}")
    public String updateCompany(
            @PathVariable int id,
            @RequestBody Company company) {
        return companyService.updateCompany(id, company);
    }

    @DeleteMapping("/{id}")
    public String deleteCompany(@PathVariable int id) {
        return companyService.deleteCompany(id);
    }
}
