package com.hdfc.branchanalytics.dto;

/**
 * Customer Satisfaction Analytics DTO
 * Contains satisfaction score, trends, and detailed star rating breakdown
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
public class CustomerSatisfactionDTO {
    
    private Double score; // Average satisfaction score (1-5 stars)
    private Double change; // Change from previous period
    private Integer reviewCount; // Total number of reviews
    private StarRatingBreakdown breakdown; // Detailed star breakdown
    
    // Nested class for star rating breakdown
    public static class StarRatingBreakdown {
        private Integer fiveStars;
        private Integer fourStars;
        private Integer threeStars;
        private Integer twoStars;
        private Integer oneStar;
        
        // Constructors
        public StarRatingBreakdown() {}
        
        public StarRatingBreakdown(Integer fiveStars, Integer fourStars, Integer threeStars, 
                                   Integer twoStars, Integer oneStar) {
            this.fiveStars = fiveStars;
            this.fourStars = fourStars;
            this.threeStars = threeStars;
            this.twoStars = twoStars;
            this.oneStar = oneStar;
        }
        
        // Getters and Setters
        public Integer getFiveStars() { return fiveStars; }
        public void setFiveStars(Integer fiveStars) { this.fiveStars = fiveStars; }
        
        public Integer getFourStars() { return fourStars; }
        public void setFourStars(Integer fourStars) { this.fourStars = fourStars; }
        
        public Integer getThreeStars() { return threeStars; }
        public void setThreeStars(Integer threeStars) { this.threeStars = threeStars; }
        
        public Integer getTwoStars() { return twoStars; }
        public void setTwoStars(Integer twoStars) { this.twoStars = twoStars; }
        
        public Integer getOneStar() { return oneStar; }
        public void setOneStar(Integer oneStar) { this.oneStar = oneStar; }
        
        // Helper method to get total count
        public Integer getTotal() {
            return (fiveStars != null ? fiveStars : 0) +
                   (fourStars != null ? fourStars : 0) +
                   (threeStars != null ? threeStars : 0) +
                   (twoStars != null ? twoStars : 0) +
                   (oneStar != null ? oneStar : 0);
        }
    }
    
    // Constructors
    public CustomerSatisfactionDTO() {}
    
    public CustomerSatisfactionDTO(Double score, Double change, Integer reviewCount, 
                                   StarRatingBreakdown breakdown) {
        this.score = score;
        this.change = change;
        this.reviewCount = reviewCount;
        this.breakdown = breakdown;
    }
    
    // Getters and Setters
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    
    public Double getChange() { return change; }
    public void setChange(Double change) { this.change = change; }
    
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    
    public StarRatingBreakdown getBreakdown() { return breakdown; }
    public void setBreakdown(StarRatingBreakdown breakdown) { this.breakdown = breakdown; }
}
