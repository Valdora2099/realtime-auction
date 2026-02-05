package com.example.demo.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "bids")
public class BidEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bidId;

    private Double bidAmount;
    private LocalDateTime bidTime;

    @ManyToOne
    @JoinColumn(name = "auction_id", referencedColumnName = "auctionId")
    private AuctionEntity auction;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    private UserEntity user;
}