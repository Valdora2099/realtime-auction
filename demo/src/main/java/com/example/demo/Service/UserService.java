package com.example.demo.Service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity createNewUser(UserEntity user) {
        return userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
}
