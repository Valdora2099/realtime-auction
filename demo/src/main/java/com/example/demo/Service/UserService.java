package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Repository.UserRepository;

@Service
public class UserService {
    private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity createNewUser(UserEntity user) {
        return userRepository.save(user);
    }
    public UserEntity getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }


}
