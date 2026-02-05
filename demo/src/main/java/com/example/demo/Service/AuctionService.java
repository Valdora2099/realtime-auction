package com.example.demo.Service;

import com.example.demo.Entity.AuctionEntity;
import com.example.demo.Repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {
    
    @Autowired
    private AuctionRepository auctionRepository;
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    // Create
    public AuctionEntity createAuction(AuctionEntity auction) {
        return auctionRepository.save(auction);
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    // Read
    public Optional<AuctionEntity> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }
    @PreAuthorize("hasRole('BIDDER') or hasRole('ADMIN')")
    public List<AuctionEntity> getAllAuctions() {
        return auctionRepository.findAll();
    }
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    // Update
    public AuctionEntity updateAuction(Long id, AuctionEntity auctionDetails) {
        return auctionRepository.findById(id).map(auction -> {
            auction.setItemName(auctionDetails.getItemName());
            auction.setDescription(auctionDetails.getDescription());
            return auctionRepository.save(auction);
        }).orElse(null);
    }
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    // Delete
    public List<AuctionEntity> deleteAuction(Long id) {
        if (auctionRepository.existsById(id)) {
            auctionRepository.deleteById(id);
        }
        return getAllAuctions();
    }
}
