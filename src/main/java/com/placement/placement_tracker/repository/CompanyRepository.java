
package com.placement.placement_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.placement.placement_tracker.model.Company;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
