package com.project.bidpulse.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.bidpulse.Entity.BidEntity;

public interface BidRepository extends JpaRepository<BidEntity, Long> {
}
