package com.project.bidpulse.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "auctions")
public class AuctionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long auctionId;

    private String itemName;
    private String description;
    private Double startingPrice;
    private Double currentPrice;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status;

    private Boolean isVerified;

    @ManyToOne
    @JoinColumn(name = "seller_id", referencedColumnName = "userId")
    private UserEntity seller;

    @ManyToOne
    @JoinColumn(name = "verified_by", referencedColumnName = "userId")
    private UserEntity verifiedBy;

    private LocalDateTime verifiedAt;
}
