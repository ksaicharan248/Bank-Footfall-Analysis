package com.hdfc.branchanalytics.dto;

/**
 * Service Efficiency Analytics DTO
 * Contains efficiency metrics and performance indicators
 * 
 * @author Cognizant Development Team
 * @version 1.0.0
 */
public class ServiceEfficiencyDTO {
    
    private Double waitTime; // Average wait time in minutes
    private Double transactionSpeed; // Transaction speed percentage
    private Double staffUtilization; // Staff utilization percentage
    
    // Constructors
    public ServiceEfficiencyDTO() {}
    
    public ServiceEfficiencyDTO(Double waitTime, Double transactionSpeed, Double staffUtilization) {
        this.waitTime = waitTime;
        this.transactionSpeed = transactionSpeed;
        this.staffUtilization = staffUtilization;
    }
    
    // Getters and Setters
    public Double getWaitTime() { return waitTime; }
    public void setWaitTime(Double waitTime) { this.waitTime = waitTime; }
    
    public Double getTransactionSpeed() { return transactionSpeed; }
    public void setTransactionSpeed(Double transactionSpeed) { this.transactionSpeed = transactionSpeed; }
    
    public Double getStaffUtilization() { return staffUtilization; }
    public void setStaffUtilization(Double staffUtilization) { this.staffUtilization = staffUtilization; }
}
