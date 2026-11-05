
package com.placement.placement_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.placement.placement_tracker.model.Internship;

public interface InternshipRepository
        extends JpaRepository<Internship, Integer> {
}
