package lab.microservice.user.dtos;

public class ReceiptDto {
    private Long id;
    private Double amount;
    private Long userId;

    public ReceiptDto() {}

    public ReceiptDto(Long id, Double amount, Long userId) {
        this.id = id;
        this.amount = amount;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Double getAmount() {
        return amount;
    }
    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
