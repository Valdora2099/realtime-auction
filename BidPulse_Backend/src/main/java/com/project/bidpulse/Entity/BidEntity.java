package com.project.bidpulse.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JsonIgnoreProperties({ "seller", "verifiedBy", "verifiedAt", "bids" })
    private AuctionEntity auction;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userId")
    @JsonIgnoreProperties({ "password", "bids", "auctions" })
    private UserEntity user;
}
