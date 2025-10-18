package lab.microservice.user.dtos;

public class CarDto {
    private Long id;
    private String model;
    private String plateNumber;
    private Long userId;

    public CarDto() {}

    public CarDto(Long id, String model, String plateNumber, Long userId) {
        this.id = id;
        this.model = model;
        this.plateNumber = plateNumber;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }
    public void setModel(String model) {
        this.model = model;
    }

    public String getPlateNumber() {
        return plateNumber;
    }
    public void setPlateNumber(String plateNumber) {
        this.plateNumber = plateNumber;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
