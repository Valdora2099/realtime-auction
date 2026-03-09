package com.project.bidpulse.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.bidpulse.Entity.AuctionEntity;
import com.project.bidpulse.Service.AuctionService;

@RestController
@RequestMapping("/auctions")
public class AuctionController {

    @Autowired
    private AuctionService service;

    @PostMapping("/add")
    public AuctionEntity insert(@RequestBody AuctionEntity auction) {
        return service.insert(auction);
    }

    @GetMapping("/get")
    public List<AuctionEntity> getAll() {
        return service.getAll();
    }

    /** Returns only the auctions belonging to a specific seller */
    @GetMapping("/seller/{sellerId}")
    public List<AuctionEntity> getBySeller(@PathVariable Long sellerId) {
        return service.getBySellerId(sellerId);
    }

    @DeleteMapping("/del/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "Auction deleted successfully";
    }

    @PutMapping("/put/{id}")
    public AuctionEntity update(@PathVariable Long id, @RequestBody AuctionEntity auction) {
        return service.update(id, auction);
    }

    /**
     * Verify an auction — sets isVerified=true, verifiedBy (admin), verifiedAt.
     * PUT /auctions/verify/{id} body: { "adminUserId": 1 }
     */
    @PutMapping("/verify/{id}")
    public ResponseEntity<?> verify(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        Long adminUserId = body.getOrDefault("adminUserId", 0L);
        AuctionEntity updated = service.verify(id, adminUserId);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
