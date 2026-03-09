package com.project.bidpulse.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.bidpulse.Entity.AuctionEntity;
import com.project.bidpulse.Entity.UserEntity;
import com.project.bidpulse.Repository.AuctionRepository;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository repo;

    public AuctionEntity insert(AuctionEntity auction) {
        return repo.save(auction);
    }

    public List<AuctionEntity> getAll() {
        return repo.findAll();
    }

    public List<AuctionEntity> getBySellerId(Long sellerId) {
        return repo.findBySeller_UserId(sellerId);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public AuctionEntity update(Long id, AuctionEntity auction) {
        AuctionEntity existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setItemName(auction.getItemName());
            existing.setDescription(auction.getDescription());
            existing.setStartingPrice(auction.getStartingPrice());
            existing.setCurrentPrice(auction.getCurrentPrice());
            existing.setStartTime(auction.getStartTime());
            existing.setEndTime(auction.getEndTime());
            existing.setStatus(auction.getStatus());
            existing.setIsVerified(auction.getIsVerified());
            return repo.save(existing);
        }
        return null;
    }

    public AuctionEntity verify(Long id, Long adminUserId) {
        AuctionEntity existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setIsVerified(true);
            UserEntity admin = new UserEntity();
            admin.setUserId(adminUserId);
            existing.setVerifiedBy(admin);
            existing.setVerifiedAt(LocalDateTime.now());
            return repo.save(existing);
        }
        return null;
    }
}
