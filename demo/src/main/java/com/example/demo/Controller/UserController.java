package com.example.demo.Controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private UserService user;

    public UserController(UserService user) {
        this.user = user;
    }

    @PostMapping("/create")
    public UserEntity createUser(@RequestBody UserEntity userEntity) {
        return user.createNewUser(userEntity);
    }
    @GetMapping("/{id}")
    public UserEntity getUser(@PathVariable Long id) {
        return user.getUserById(id);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        user.deleteUser(id);
    }
    @GetMapping("/getall")
    public List<UserEntity> getAllUsers() {
        return user.getAllUsers();
    }
}

