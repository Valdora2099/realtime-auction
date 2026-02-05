package com.example.demo.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Repository.UserRepository;
import com.example.demo.enums.userRoleEnum;

public class AuthorizationService {

    private UserRepository userRepository;

    public AuthorizationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public boolean authorize(Long requesterId,userRoleEnum requiredRole) {
        UserEntity requester = userRepository.findById(requesterId).orElse(null);
        if (requester == null) {
            return false; // User not found
        }
        return requester.getRole() == requiredRole;
    }
    
}
