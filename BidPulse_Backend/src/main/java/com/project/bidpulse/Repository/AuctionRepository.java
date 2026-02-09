package com.project.bidpulse.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.bidpulse.Entity.AuctionEntity;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Long> {
}
