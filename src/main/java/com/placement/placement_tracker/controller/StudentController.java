
package com.placement.placement_tracker.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.placement.placement_tracker.model.Student;
import com.placement.placement_tracker.service.StudentService;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET all students
    @GetMapping
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    // POST student
    @PostMapping
    public String addStudent(@RequestBody Student student) {
        return studentService.addStudent(student);
    }

    // GET student by ID
    @GetMapping("/{id}")
    public Student getStudent(@PathVariable int id) {
        return studentService.getStudentById(id);
    }

    // PUT student
    @PutMapping("/{id}")
    public String updateStudent(
            @PathVariable int id,
            @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    // DELETE student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable int id) {
        return studentService.deleteStudent(id);
    }
}
