package com.placement.placement_tracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.placement.placement_tracker.model.Student;
import com.placement.placement_tracker.repository.StudentRepository;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Add student
    public String addStudent(Student student) {
        student.setId(null);
        studentRepository.save(student);
        return "Student added successfully!";
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Find student by ID
    public Student getStudentById(int id) {
        return studentRepository.findById(id).orElse(null);
    }

    // Update student
    public String updateStudent(int id, Student updatedStudent) {

        Optional<Student> optionalStudent = studentRepository.findById(id);

        if (optionalStudent.isEmpty()) {
            return "Student not found!";
        }

        Student existing = optionalStudent.get();

        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setBranch(updatedStudent.getBranch());
        existing.setGraduationYear(updatedStudent.getGraduationYear());

        studentRepository.save(existing);

        return "Student updated successfully!";
    }

    // Delete student
    public String deleteStudent(int id) {

        if (!studentRepository.existsById(id)) {
            return "Student not found!";
        }

        studentRepository.deleteById(id);

        return "Student deleted successfully!";
    }
}