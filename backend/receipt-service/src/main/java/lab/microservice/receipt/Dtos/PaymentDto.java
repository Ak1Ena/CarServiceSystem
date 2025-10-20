package lab.microservice.receipt.Dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {
    private Long paymentId;
    private Long reserveId;
    private Long userId;
    private String userName;
    private String status;
    private String paymentMethod;
    private BigDecimal grandTotal;
    private LocalDateTime paidAt;

    public Long getReserveId() {
        return reserveId;
    }
    public void setReserveId(Long reserveId) {
        this.reserveId = reserveId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getPaymentMethod() {
        return paymentMethod;
    }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
    public BigDecimal getGrandTotal() {
        return grandTotal;
    }
    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }
    public LocalDateTime getPaidAt() {
        return paidAt;
    }
    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public Long getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }
    
    
    

    
}
