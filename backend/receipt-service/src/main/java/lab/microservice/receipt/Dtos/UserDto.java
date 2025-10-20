package lab.microservice.receipt.Dtos;


import java.time.LocalDateTime;

public class UserDto {
    
    private Long userId;
    private Long id; // สำหรับ compatibility
    
    private String username;
    
    private String name;
    
    private String email;
    
    private String phone;
    
    private String password;
    
    private String address;
    
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserRole role;
    
    // Constructors
    public UserDto() {}
    
    public UserDto(String name, String email, String phone,UserRole role) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }
    
  
    
    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { 
        this.userId = userId;
        this.id = userId; // sync
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { 
        this.id = id;
        this.userId = id; // sync
    }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Compatibility methods สำหรับโค้ดเดิม
    public String getFirstName() {
        String[] parts = name != null ? name.split(" ", 2) : new String[]{"", ""};
        return parts[0];
    }
    
    public String getLastName() {
        String[] parts = name != null ? name.split(" ", 2) : new String[]{"", ""};
        return parts.length > 1 ? parts[1] : "";
    }
    
    public void setFirstName(String firstName) {
        if (firstName != null) {
            String lastName = getLastName();
            this.name = firstName + (lastName.isEmpty() ? "" : " " + lastName);
        }
    }
    
    public void setLastName(String lastName) {
        if (lastName != null) {
            String firstName = getFirstName();
            this.name = firstName + (lastName.isEmpty() ? "" : " " + lastName);
        }
    }
    
    public String getPhoneNumber() { return phone; }
    public void setPhoneNumber(String phoneNumber) { this.phone = phoneNumber; }
    public UserRole getUserRole(){return role;}
    public void setUserRole(UserRole role){this.role = role;}
     public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }

    public enum UserRole{
        USER,OWNER
    }
}