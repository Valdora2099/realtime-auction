package com.project.bidpulse.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.project.bidpulse.Entity.BidEntity;
import com.project.bidpulse.Service.BidService;

@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidService service;

    @PostMapping("/add")
    public BidEntity insert(@RequestBody BidEntity bid) {
        return service.insert(bid);
    }

    @GetMapping("/get")
    public List<BidEntity> getAll() {
        return service.getAll();
    }

    @DeleteMapping("/del/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteById(id);
        return "Bid deleted successfully";
    }

    @PutMapping("/put/{id}")
    public BidEntity update(@PathVariable Long id, @RequestBody BidEntity bid) {
        return service.update(id, bid);
    }
}
