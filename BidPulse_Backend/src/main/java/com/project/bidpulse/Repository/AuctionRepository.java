package com.project.bidpulse.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.bidpulse.Entity.AuctionEntity;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Long> {

    List<AuctionEntity> findBySeller_UserId(Long sellerId);
}
