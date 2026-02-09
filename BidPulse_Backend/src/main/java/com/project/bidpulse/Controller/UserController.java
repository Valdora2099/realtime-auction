package com.project.bidpulse.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.bidpulse.Entity.UserEntity;
import com.project.bidpulse.Service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService service;

    @PostMapping("/add")
    public UserEntity insert(@RequestBody UserEntity user) {
        return service.insert(user);
    }

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
}
