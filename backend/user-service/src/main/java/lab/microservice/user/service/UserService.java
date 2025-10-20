package lab.microservice.user.service;

import lab.microservice.user.dtos.UserDto;
import lab.microservice.user.entity.User;
import lab.microservice.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserEventPublisher userEventPublisher;
    
    // Read operations...
    public List<UserDto> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public Optional<UserDto> getUserById(Long id) {
        logger.info("Fetching user by id: {}", id);
        return userRepository.findById(id)
                .map(UserDto::fromEntity);
    }
    
    public Optional<UserDto> getUserByUsername(String username) {
        logger.info("Fetching user by username: {}", username);
        return userRepository.findByUsername(username)
                .map(UserDto::fromEntity);
    }
    
    public Optional<UserDto> getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
                .map(UserDto::fromEntity);
    }
    
    public List<UserDto> getUsersByStatus(User.UserStatus status) {
        logger.info("Fetching users by status: {}", status);
        return userRepository.findByStatus(status)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<UserDto> searchUsersByName(String name) {
        logger.info("Searching users by name: {}", name);
        return userRepository.findByNameContaining(name)
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
    
    /**
     * สร้าง User ใหม่ + ส่ง Kafka Event
     */
    public UserDto createUser(UserDto userDto) {
        logger.info("Creating new user with username: {}", userDto.getUsername());
        
        // Validation
        if (userRepository.existsByUsername(userDto.getUsername())) {
            logger.error("Username already exists: {}", userDto.getUsername());
            throw new RuntimeException("Username already exists: " + userDto.getUsername());
        }
        
        if (userRepository.existsByEmail(userDto.getEmail())) {
            logger.error("Email already exists: {}", userDto.getEmail());
            throw new RuntimeException("Email already exists: " + userDto.getEmail());
        }
        
        try {
            User user = userDto.toEntity();
            User savedUser = userRepository.save(user);
            
            logger.info("Successfully created user with id: {}", savedUser.getId());
            
            // ส่ง Kafka Event
            userEventPublisher.publishUserCreatedEvent(savedUser);
            
            return UserDto.fromEntity(savedUser);
        } catch (Exception e) {
            logger.error("Error creating user with username: {}", userDto.getUsername(), e);
            throw new RuntimeException("Failed to create user", e);
        }
    }
    
    /**
     * อัพเดท User + ส่ง Kafka Event
     */
    public UserDto updateUser(Long id, UserDto userDto) {
        logger.info("Updating user with id: {}", id);
        
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", id);
                    return new RuntimeException("User not found with id: " + id);
                });
        
        // สร้าง copy ของ existing user สำหรับเปรียบเทียบ
        User oldUser = copyUser(existingUser);
        
        // Validation
        if (!existingUser.getUsername().equals(userDto.getUsername()) && 
            userRepository.existsByUsername(userDto.getUsername())) {
            logger.error("Username already exists: {}", userDto.getUsername());
            throw new RuntimeException("Username already exists: " + userDto.getUsername());
        }
        
        if (!existingUser.getEmail().equals(userDto.getEmail()) && 
            userRepository.existsByEmail(userDto.getEmail())) {
            logger.error("Email already exists: {}", userDto.getEmail());
            throw new RuntimeException("Email already exists: " + userDto.getEmail());
        }
        
        try {
            // Update fields
            existingUser.setUsername(userDto.getUsername());
            existingUser.setEmail(userDto.getEmail());
            existingUser.setName(userDto.getName());
            existingUser.setPhoneNumber(userDto.getPhoneNumber());
            existingUser.setAddress(userDto.getAddress());
            existingUser.setUserRole(userDto.getRole());
            if (userDto.getStatus() != null) {
                existingUser.setStatus(userDto.getStatus());
            }
            
            User updatedUser = userRepository.save(existingUser);
            logger.info("Successfully updated user with id: {}", updatedUser.getId());
            
            // ส่ง Kafka Event
            userEventPublisher.publishUserUpdatedEvent(oldUser, updatedUser);
            
            return UserDto.fromEntity(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user with id: {}", id, e);
            throw new RuntimeException("Failed to update user", e);
        }
    }
    
    /**
     * ลบ User + ส่ง Kafka Event
     */
    public void deleteUser(Long id) {
        logger.info("Deleting user with id: {}", id);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", id);
                    return new RuntimeException("User not found with id: " + id);
                });
        
        try {
            // ส่ง Kafka Event ก่อนลบ (เพื่อให้ services อื่นได้ข้อมูล)
            userEventPublisher.publishUserDeletedEvent(user);
            
            // ลบจากฐานข้อมูล
            userRepository.delete(user);
            logger.info("Successfully deleted user with id: {}", id);
            
        } catch (Exception e) {
            logger.error("Error deleting user with id: {}", id, e);
            throw new RuntimeException("Failed to delete user with id: " + id, e);
        }
    }
    
    /**
     * เปลี่ยนสถานะ User + ส่ง Kafka Event
     */
    public UserDto updateUserStatus(Long id, User.UserStatus newStatus) {
        logger.info("Updating user status for id: {} to status: {}", id, newStatus);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("User not found with id: {}", id);
                    return new RuntimeException("User not found with id: " + id);
                });
        
        User.UserStatus oldStatus = user.getStatus();
        
        // ถ้าสถานะเหมือนเดิม ไม่ต้องทำอะไร
        if (oldStatus == newStatus) {
            logger.info("User status is already {}, no update needed", newStatus);
            return UserDto.fromEntity(user);
        }
        
        try {
            user.setStatus(newStatus);
            User updatedUser = userRepository.save(user);
            
            logger.info("Successfully updated user status for id: {} from {} to {}", 
                      id, oldStatus, newStatus);
            
            // ส่ง Kafka Event
            userEventPublisher.publishUserStatusChangedEvent(updatedUser, oldStatus, newStatus);
            
            return UserDto.fromEntity(updatedUser);
        } catch (Exception e) {
            logger.error("Error updating user status for id: {}", id, e);
            throw new RuntimeException("Failed to update user status", e);
        }
    }
    

    private User copyUser(User original) {
        User copy = new User();
        copy.setId(original.getId());
        copy.setUsername(original.getUsername());
        copy.setEmail(original.getEmail());
        copy.setName(original.getName());
        copy.setPhoneNumber(original.getPhoneNumber());
        copy.setAddress(original.getAddress());
        copy.setStatus(original.getStatus());
        copy.setCreatedAt(original.getCreatedAt());
        copy.setUpdatedAt(original.getUpdatedAt());
        return copy;
    }
    
    public boolean existsById(Long id) {
        return userRepository.existsById(id);
    }
    
    public long countUsers() {
        return userRepository.count();
    }
}