package lab.microservice.user.repository;

import lab.microservice.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // ใช้ username field ใหม่
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    // ใช้ email field ที่มีอยู่แล้ว
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // ใช้ phone field แทน phoneNumber
    @Query("SELECT u FROM User u WHERE u.phone = :phone")
    Optional<User> findByPhone(@Param("phone") String phone);
    
    // search by name
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    // search by status
    List<User> findByStatus(User.UserStatus status);
    
    // สำหรับ compatibility กับโค้ดเดิม
    @Query("SELECT u FROM User u WHERE u.phone = :phoneNumber")
    Optional<User> findByPhoneNumber(@Param("phoneNumber") String phoneNumber);
}