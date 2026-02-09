package com.project.bidpulse.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.bidpulse.Entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
