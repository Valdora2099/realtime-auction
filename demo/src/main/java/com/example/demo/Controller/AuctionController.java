package com.example.demo.Controller;

import com.example.demo.Entity.AuctionEntity;
import com.example.demo.Service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    
    @Autowired
    private AuctionService auctionService;
    
    // Create
    @PostMapping
    public ResponseEntity<AuctionEntity> createAuction(@RequestBody AuctionEntity auction) {
        AuctionEntity createdAuction = auctionService.createAuction(auction);
        return new ResponseEntity<>(createdAuction, HttpStatus.CREATED);
    }
    
    // Read all
    @GetMapping
    public ResponseEntity<List<AuctionEntity>> getAllAuctions() {
        List<AuctionEntity> auctions = auctionService.getAllAuctions();
        return ResponseEntity.ok(auctions);
    }
    
    // Read by ID
    @GetMapping("/{id}")
    public ResponseEntity<AuctionEntity> getAuctionById(@PathVariable Long id) {
        Optional<AuctionEntity> auction = auctionService.getAuctionById(id);
        return auction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Update
    @PutMapping("/{id}")
    public ResponseEntity<AuctionEntity> updateAuction(@PathVariable Long id, @RequestBody AuctionEntity auctionDetails) {
        AuctionEntity updatedAuction = auctionService.updateAuction(id, auctionDetails);
        if (updatedAuction != null) {
            return ResponseEntity.ok(updatedAuction);
        }
        return ResponseEntity.notFound().build();
    }
    
    // Delete
    @DeleteMapping("/{id}")
    public List<AuctionEntity> deleteAuction(@PathVariable Long id) {
        return auctionService.deleteAuction(id);
    }
}
