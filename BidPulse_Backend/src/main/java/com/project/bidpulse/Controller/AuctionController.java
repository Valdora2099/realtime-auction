package com.project.bidpulse.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

    @DeleteMapping("/del/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "Auction deleted successfully";
    }

    @PutMapping("/put/{id}")
    public AuctionEntity update(@PathVariable Long id, @RequestBody AuctionEntity auction) {
        return service.update(id, auction);
    }
}
