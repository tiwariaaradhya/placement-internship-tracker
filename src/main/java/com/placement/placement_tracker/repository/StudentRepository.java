
package com.placement.placement_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.placement.placement_tracker.model.Student;

public interface StudentRepository extends JpaRepository<Student, Integer> {

}
