package com.example.demo.Service;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Repository.BidRepository;
import com.example.demo.dto.Validation;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BidService {
    
    AuthorizationService authorizationService;

    private BidRepository bidRepository;
    public BidService(BidRepository bidRepository, AuthorizationService authorizationService) {
        this.bidRepository = bidRepository;
        this.authorizationService = authorizationService;
    }
    
    public void ValidateSeller(Validation requesterId) {
        authorizationService.authorize(requesterId.getRequesterId(), com.example.demo.enums.userRoleEnum.SELLER);
    }
    
    // Create
    public BidEntity createBid(BidEntity bid) {
        return bidRepository.save(bid);
    }
    
    // Read
    public Optional<BidEntity> getBidById(Long id) {
        return bidRepository.findById(id);
    }
    
    public List<BidEntity> getAllBids() {
        return bidRepository.findAll();
    }
    
    // Update
    public BidEntity updateBid(Long id, BidEntity bidDetails) {
        return bidRepository.findById(id).map(bid -> {
            bid.setBidAmount(bidDetails.getBidAmount());
            return bidRepository.save(bid);
        }).orElse(null);
    }
    
    // Delete
    public boolean deleteBid(Long id) {
        if (bidRepository.existsById(id)) {
            bidRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
