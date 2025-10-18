package lab.microservice.payment.Dtos;

import java.time.LocalDateTime;

public class PaymentEventDto {
    private Long receiptId;
    private Long paymentId;
    private String status;
    private String paymentMethod;
    private String event;
    private String paidAt;
    public Long getReceiptId() {
        return receiptId;
    }
    public void setReceiptId(Long receiptId) {
        this.receiptId = receiptId;
    }
    public Long getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
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
    public String getEvent() {
        return event;
    }
    public void setEvent(String event) {
        this.event = event;
    }
    public String getPaidAt() {
        return paidAt;
    }
    public void setPaidAt(String paidAt) {
        this.paidAt = paidAt;
    }

    
    

    
    
    
}
