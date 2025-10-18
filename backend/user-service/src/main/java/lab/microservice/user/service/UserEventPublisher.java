package lab.microservice.user.service;

import lab.microservice.user.dtos.UserEventDto;
import lab.microservice.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserEventPublisher {
    
    private static final Logger logger = LoggerFactory.getLogger(UserEventPublisher.class);
    
    @Autowired
    private KafkaTemplate<String, UserEventDto> kafkaTemplate;
    
    @Value("${app.kafka.topic:user}")
    private String userEventsTopic;
    
    /**
     * ส่ง Event เมื่อสร้าง User ใหม่
     */
    public void publishUserCreatedEvent(User user) {
        logger.info("Publishing USER_CREATED event for user id: {}", user.getId());
        
        try {
            // สร้างข้อมูลสำหรับ Event
            Map<String, Object> userData = createUserDataMap(user);
            
            // สร้าง UserEventDto
            UserEventDto event = new UserEventDto(
                "USER_CREATED", 
                user.getId(), 
                userData
            );
            
            // ส่งไป Kafka
            kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
            logger.info("Successfully published USER_CREATED event for user id: {}", user.getId());
            
        } catch (Exception e) {
            logger.error("Failed to publish USER_CREATED event for user id: {}", user.getId(), e);
            // อย่าให้ Kafka error ทำให้ transaction fail
        }
    }
    
    /**
     * ส่ง Event เมื่ออัพเดท User
     */
    public void publishUserUpdatedEvent(User oldUser, User newUser) {
        logger.info("Publishing USER_UPDATED event for user id: {}", newUser.getId());
        
        try {
            // หาค่าที่เปลี่ยนแปลง
            List<String> changes = findChangedFields(oldUser, newUser);
            
            if (changes.isEmpty()) {
                logger.info("No changes detected for user id: {}, skipping event", newUser.getId());
                return;
            }
            
            // สร้างข้อมูลสำหรับ Event
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("oldData", createUserDataMap(oldUser));
            eventData.put("newData", createUserDataMap(newUser));
            
            // สร้าง UserEventDto พร้อม changes
            UserEventDto event = new UserEventDto(
                "USER_UPDATED", 
                newUser.getId(), 
                eventData, 
                changes
            );
            
            // ส่งไป Kafka
            kafkaTemplate.send(userEventsTopic, newUser.getId().toString(), event);
            logger.info("Successfully published USER_UPDATED event for user id: {} with changes: {}", 
                      newUser.getId(), changes);
            
        } catch (Exception e) {
            logger.error("Failed to publish USER_UPDATED event for user id: {}", newUser.getId(), e);
        }
    }
    
    /**
     * ส่ง Event เมื่อลบ User
     */
    public void publishUserDeletedEvent(User user) {
        logger.info("Publishing USER_DELETED event for user id: {}", user.getId());
        
        try {
            // สร้างข้อมูลสำหรับ Event
            Map<String, Object> userData = createUserDataMap(user);
            
            // สร้าง UserEventDto
            UserEventDto event = new UserEventDto(
                "user-deleted", 
                user.getId(), 
                userData
            );
            
            // ส่งไป Kafka
            kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
            logger.info("Successfully published USER_DELETED event for user id: {}", user.getId());
            
        } catch (Exception e) {
            logger.error("Failed to publish USER_DELETED event for user id: {}", user.getId(), e);
        }
    }
    
    /**
     * ส่ง Event เมื่อเปลี่ยนสถานะ User
     */
    public void publishUserStatusChangedEvent(User user, User.UserStatus oldStatus, User.UserStatus newStatus) {
        logger.info("Publishing USER_STATUS_CHANGED event for user id: {} from {} to {}", 
                  user.getId(), oldStatus, newStatus);
        
        try {
            // สร้างข้อมูลสำหรับ Event
            Map<String, Object> statusData = new HashMap<>();
            statusData.put("userId", user.getId());
            statusData.put("username", user.getUsername());
            statusData.put("email", user.getEmail());
            statusData.put("oldStatus", oldStatus.toString());
            statusData.put("newStatus", newStatus.toString());
            
            // สร้าง UserEventDto พร้อม changes
            UserEventDto event = new UserEventDto(
                "USER_STATUS_CHANGED", 
                user.getId(), 
                statusData, 
                List.of("status")
            );
            
            // ส่งไป Kafka
            kafkaTemplate.send(userEventsTopic, user.getId().toString(), event);
            logger.info("Successfully published USER_STATUS_CHANGED event for user id: {}", user.getId());
            
        } catch (Exception e) {
            logger.error("Failed to publish USER_STATUS_CHANGED event for user id: {}", user.getId(), e);
        }
    }
    
    /**
     * ส่ง Event สำหรับการ Login/Logout
     */
    public void publishUserAuthEvent(Long userId, String eventType, Map<String, Object> authData) {
        logger.info("Publishing {} event for user id: {}", eventType, userId);
        
        try {
            UserEventDto event = new UserEventDto(eventType, userId, authData);
            
            kafkaTemplate.send(userEventsTopic, userId.toString(), event);
            logger.info("Successfully published {} event for user id: {}", eventType, userId);
            
        } catch (Exception e) {
            logger.error("Failed to publish {} event for user id: {}", eventType, userId, e);
        }
    }
    
    // Helper Methods
    
    /**
     * แปลง User Entity เป็น Map สำหรับส่งใน Event
     */
    private Map<String, Object> createUserDataMap(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("email", user.getEmail());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("phoneNumber", user.getPhoneNumber());
        userData.put("address", user.getAddress());
        userData.put("status", user.getStatus() != null ? user.getStatus().toString() : null);
        userData.put("createdAt", user.getCreatedAt());
        userData.put("updatedAt", user.getUpdatedAt());
        return userData;
    }
    
    /**
     * เปรียบเทียบ User เก่าและใหม่เพื่อหาค่าที่เปลี่ยนแปลง
     */
    private List<String> findChangedFields(User oldUser, User newUser) {
        List<String> changes = new ArrayList<>();
        
        if (!Objects.equals(oldUser.getUsername(), newUser.getUsername())) {
            changes.add("username");
        }
        if (!Objects.equals(oldUser.getEmail(), newUser.getEmail())) {
            changes.add("email");
        }
        if (!Objects.equals(oldUser.getFirstName(), newUser.getFirstName())) {
            changes.add("firstName");
        }
        if (!Objects.equals(oldUser.getLastName(), newUser.getLastName())) {
            changes.add("lastName");
        }
        if (!Objects.equals(oldUser.getPhoneNumber(), newUser.getPhoneNumber())) {
            changes.add("phoneNumber");
        }
        if (!Objects.equals(oldUser.getAddress(), newUser.getAddress())) {
            changes.add("address");
        }
        if (!Objects.equals(oldUser.getStatus(), newUser.getStatus())) {
            changes.add("status");
        }
        
        return changes;
    }
}