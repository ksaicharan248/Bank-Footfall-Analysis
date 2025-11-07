package com.hdfc.branchanalytics.dto;

import java.util.List;

/**
 * Performance Trends Analytics DTO
 * Contains revenue trends, transaction patterns, and growth metrics
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
public class PerformanceTrendsDTO {
    
    private Double dailyRevenue; // Average daily revenue
    private Integer transactionCount; // Total transaction count
    private Double revenueGrowth; // Revenue growth percentage
    private Double transactionGrowth; // Transaction growth percentage
    private String peakHour; // Peak hour of activity
    private Double efficiency; // Overall efficiency percentage
    private List<Double> revenueChart; // Revenue chart data (7 days)
    private List<Integer> transactionChart; // Transaction chart data (7 days)
    
    // Constructors
    public PerformanceTrendsDTO() {}
    
    public PerformanceTrendsDTO(Double dailyRevenue, Integer transactionCount, 
                                Double revenueGrowth, Double transactionGrowth,
                                String peakHour, Double efficiency,
                                List<Double> revenueChart, List<Integer> transactionChart) {
        this.dailyRevenue = dailyRevenue;
        this.transactionCount = transactionCount;
        this.revenueGrowth = revenueGrowth;
        this.transactionGrowth = transactionGrowth;
        this.peakHour = peakHour;
        this.efficiency = efficiency;
        this.revenueChart = revenueChart;
        this.transactionChart = transactionChart;
    }
    
    // Getters and Setters
    public Double getDailyRevenue() { return dailyRevenue; }
    public void setDailyRevenue(Double dailyRevenue) { this.dailyRevenue = dailyRevenue; }
    
    public Integer getTransactionCount() { return transactionCount; }
    public void setTransactionCount(Integer transactionCount) { this.transactionCount = transactionCount; }
    
    public Double getRevenueGrowth() { return revenueGrowth; }
    public void setRevenueGrowth(Double revenueGrowth) { this.revenueGrowth = revenueGrowth; }
    
    public Double getTransactionGrowth() { return transactionGrowth; }
    public void setTransactionGrowth(Double transactionGrowth) { this.transactionGrowth = transactionGrowth; }
    
    public String getPeakHour() { return peakHour; }
    public void setPeakHour(String peakHour) { this.peakHour = peakHour; }
    
    public Double getEfficiency() { return efficiency; }
    public void setEfficiency(Double efficiency) { this.efficiency = efficiency; }
    
    public List<Double> getRevenueChart() { return revenueChart; }
    public void setRevenueChart(List<Double> revenueChart) { this.revenueChart = revenueChart; }
    
    public List<Integer> getTransactionChart() { return transactionChart; }
    public void setTransactionChart(List<Integer> transactionChart) { this.transactionChart = transactionChart; }
}
