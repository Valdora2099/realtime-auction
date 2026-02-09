package com.project.bidpulse.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.bidpulse.Entity.BidEntity;
import com.project.bidpulse.Repository.BidRepository;

@Service
public class BidService {

    @Autowired
    private BidRepository repo;

    public BidEntity insert(BidEntity bid) {
        return repo.save(bid);
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
