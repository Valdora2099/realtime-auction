package com.example.demo.Controller;

import com.example.demo.Entity.BidEntity;
import com.example.demo.Service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bids")
public class BidController {
    
    @Autowired
    private BidService bidService;
    
    // Create
    @PostMapping
    public ResponseEntity<BidEntity> createBid(@RequestBody BidEntity bid) {
        BidEntity createdBid = bidService.createBid(bid);
        return new ResponseEntity<>(createdBid, HttpStatus.CREATED);
    }
    
    // Read all
    @GetMapping
    public ResponseEntity<List<BidEntity>> getAllBids() {
        List<BidEntity> bids = bidService.getAllBids();
        return ResponseEntity.ok(bids);
    }
    
    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<BidEntity> getBidById(@PathVariable Long id) {
        Optional<BidEntity> bid = bidService.getBidById(id);
        return bid.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<BidEntity> updateBid(@PathVariable Long id, @RequestBody BidEntity bidDetails) {
        BidEntity updatedBid = bidService.updateBid(id, bidDetails);
        if (updatedBid != null) {
            return ResponseEntity.ok(updatedBid);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable Long id) {
        if (bidService.deleteBid(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
