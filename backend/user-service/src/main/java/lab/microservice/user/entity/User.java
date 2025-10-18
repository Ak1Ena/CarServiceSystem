package lab.microservice.user.entity;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.smartcardio.Card;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "users") // ใช้ชื่อ users เพื่อเลี่ยง keyword "user"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // เปลี่ยนจาก id เป็น userId
    @Column(nullable = false)
    private String name; // เปลี่ยนจาก firstName, lastName เป็น name
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false, unique = true)
    private String phone; // เปลี่ยนจาก phoneNumber เป็น phone
    @Column(nullable = false)
    private String password;
    private String address;
    // เพิ่ม username field
    @Column(unique = true, nullable = false)
    private String username;
    // เพิ่ม status enum
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.ACTIVE;
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "role")
    private UserRole userRole;


    // Constructors
    public User() {
    }


    public User(String username, String email, String name, String phone, UserRole role) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.userRole = role;
    }

    // Getters and Setters - ปรับให้ตรงกับโค้ดเดิม
    public Long getId() {
        return userId;
    } // สำหรับ compatibility

    public void setId(Long id) {
        this.userId = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // เพิ่ม methods สำหรับ compatibility กับโค้ดเดิม
    public String getFirstName() {
        String[] parts = name != null ? name.split(" ", 2) : new String[] { "", "" };
        return parts[0];
    }

    public String getLastName() {
        String[] parts = name != null ? name.split(" ", 2) : new String[] { "", "" };
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

    public String getPhoneNumber() {
        return phone;
    } // alias

    public void setPhoneNumber(String phoneNumber) {
        this.phone = phoneNumber;
    }

    public void setUserRole(UserRole userRole){
        this.userRole = userRole;
    }
    public UserRole getUserRole(){
        return userRole;
    }

    // User Status Enum
    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }

    public enum UserRole{
        USER,OWNER
    }
}