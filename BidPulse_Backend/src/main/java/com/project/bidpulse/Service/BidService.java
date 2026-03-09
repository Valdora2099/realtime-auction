package com.project.bidpulse.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.bidpulse.Entity.BidEntity;
import com.project.bidpulse.Repository.AuctionRepository;
import com.project.bidpulse.Repository.BidRepository;

@Service
public class BidService {

    @Autowired
    private BidRepository repo;

    @Autowired
    private AuctionRepository auctionRepo;

    /**
     * Save the bid AND update the auction's currentPrice if this bid is higher.
     * bidTime is always stamped server-side to avoid ISO-8601 parsing issues.
     */
    @Transactional
    public BidEntity insert(BidEntity bid) {
        // Always stamp bid time on the server
        bid.setBidTime(LocalDateTime.now());

        BidEntity saved = repo.save(bid);

        // Atomically update auction's current price
        if (bid.getAuction() != null && bid.getAuction().getAuctionId() != null) {
            auctionRepo.findById(bid.getAuction().getAuctionId()).ifPresent(auction -> {
                Double current = auction.getCurrentPrice();
                if (current == null || bid.getBidAmount() > current) {
                    auction.setCurrentPrice(bid.getBidAmount());
                    auctionRepo.save(auction);
                }
            });
        }

        return saved;
    }

    public List<BidEntity> getAll() {
        return repo.findAll();
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }

    public BidEntity update(Long id, BidEntity bid) {
        BidEntity existing = repo.findById(id).orElse(null);
        if (existing != null) {
            existing.setBidAmount(bid.getBidAmount());
            existing.setBidTime(bid.getBidTime());
            return repo.save(existing);
        }
        return null;
    }
}
