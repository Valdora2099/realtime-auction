package com.example.demo.Service;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Repository.BidRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BidService {
    

    private BidRepository bidRepository;
    public BidService(BidRepository bidRepository) {
        this.bidRepository = bidRepository;
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    // Create
    public BidEntity createBid(BidEntity bid) {
        return bidRepository.save(bid);
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    // Read
    public Optional<BidEntity> getBidById(Long id) {
        return bidRepository.findById(id);
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    public List<BidEntity> getAllBids() {
        return bidRepository.findAll();
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    // Update
    public BidEntity updateBid(Long id, BidEntity bidDetails) {
        return bidRepository.findById(id).map(bid -> {
            bid.setBidAmount(bidDetails.getBidAmount());
            return bidRepository.save(bid);
        }).orElse(null);
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    // Delete
    public boolean deleteBid(Long id) {
        if (bidRepository.existsById(id)) {
            bidRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
