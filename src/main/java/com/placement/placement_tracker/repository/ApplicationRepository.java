
package com.placement.placement_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.placement.placement_tracker.model.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Integer> {

    long countByStatusIgnoreCase(String status);
}
