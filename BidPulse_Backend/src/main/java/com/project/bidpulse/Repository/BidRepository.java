package com.project.bidpulse.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.project.bidpulse.Entity.BidEntity;

public interface BidRepository extends JpaRepository<BidEntity, Long> {

    List<BidEntity> findByAuction_AuctionId(Long auctionId);
}
