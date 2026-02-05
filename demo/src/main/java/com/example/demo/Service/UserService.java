package com.example.demo.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Repository.UserRepository;
import com.example.demo.dto.Validation;

@Service
public class UserService {
    private UserRepository userRepository;
    private AuthorizationService authorizationService;

    public UserService(UserRepository userRepository,AuthorizationService authorizationService) {
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
    }

    public void ValidateAdmin(Validation requesterId) {
        authorizationService.authorize(requesterId.getRequesterId(), com.example.demo.enums.userRoleEnum.ADMIN);
    }

    public UserEntity createNewUser(UserEntity user) {
        return userRepository.save(user);
    }
    public UserEntity getUserById(Long id, Validation requester) {
        ValidateAdmin(requester);
        return userRepository.findById(id).orElse(null);
    }
    public void deleteUser(Long id, Validation requester) {
        ValidateAdmin(requester);
        userRepository.deleteById(id);
    }
    public List<UserEntity> getAllUsers(Validation requester) {
        ValidateAdmin(requester);
        return userRepository.findAll();
    }


}
