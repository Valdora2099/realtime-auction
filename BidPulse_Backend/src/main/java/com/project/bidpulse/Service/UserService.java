package com.project.bidpulse.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.bidpulse.Entity.UserEntity;
import com.project.bidpulse.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public UserEntity insert(UserEntity user) {
        return repo.save(user);
    }

    public List<UserEntity> getAll() {
        return repo.findAll();
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public UserEntity update(Long id, UserEntity user) {
        UserEntity existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setName(user.getName());
            existing.setEmail(user.getEmail());
            existing.setPassword(user.getPassword());
            existing.setRole(user.getRole());
            return repo.save(existing);
        }
        return null;
    }
}
