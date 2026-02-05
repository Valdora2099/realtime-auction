    package com.example.demo.Entity;

    import com.example.demo.enums.userRoleEnum;

    import jakarta.persistence.*;
    import lombok.Data;

    @Data
    @Entity
    @Table(name = "users")
    public class UserEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long userId;

        private String name;
        private String email;
        private String password;

        @Enumerated(EnumType.STRING)
        private userRoleEnum role;

        public void setRole(userRoleEnum role) {
            this.role = role;
        }
        public userRoleEnum getRole() {
            return role;
        }
    }