package com.project.bidpulse.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.project.bidpulse.Entity.UserEntity;
import com.project.bidpulse.Repository.UserRepository;
import com.project.bidpulse.Service.UserService;
import com.project.bidpulse.security.JwtUtil;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /** Register — password is auto-hashed inside UserService.insert() */
    @PostMapping("/add")
    public ResponseEntity<?> insert(@RequestBody UserEntity user) {
        // Check if email already taken
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "An account with this email already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }
        UserEntity saved = service.insert(user);
        // Don't return the password hash
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }

    /** Get all users (admin protected via JWT filter) */
    @GetMapping("/get")
    public List<UserEntity> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/del/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "User deleted successfully";
    }

    @PutMapping("/put/{id}")
    public UserEntity update(@PathVariable Long id, @RequestBody UserEntity user) {
        return service.update(id, user);
    }

    /**
     * Login — verifies BCrypt password, returns { token, user }.
     * POST /users/login body: { "email": "...", "password": "..." }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Email and password are required.");
            return ResponseEntity.badRequest().body(err);
        }

        Optional<UserEntity> found = userRepository.findByEmail(email);
        if (found.isEmpty() || !passwordEncoder.matches(password, found.get().getPassword())) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        UserEntity user = found.get();
        String token = jwtUtil.generateToken(user);

        // Scrub password before sending to client
        user.setPassword(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }
}
