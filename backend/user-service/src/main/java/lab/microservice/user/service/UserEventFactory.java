package lab.microservice.user.service;

import lab.microservice.user.dtos.UserEventDto;
import lab.microservice.user.entity.User;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class UserEventFactory {
    
    /**
     * สร้าง User Created Event
     */
   public UserEventDto createUserCreatedEvent(User user) {
    Map<String, Object> data = new HashMap<>();
    data.put("username", user.getUsername());
    data.put("email", user.getEmail());
    data.put("name", user.getName()); 
    data.put("phone", user.getPhone()); 
    data.put("address", user.getAddress());
    data.put("status", user.getStatus().toString());
    
    return new UserEventDto("user-created", user.getId(), data);
}
    
    /**
     * สร้าง User Updated Event
     */
    public UserEventDto createUserUpdatedEvent(User oldUser, User newUser, List<String> changedFields) {
        Map<String, Object> data = new HashMap<>();
        data.put("username", newUser.getUsername());
        data.put("email", newUser.getEmail());
        data.put("firstName", newUser.getFirstName());
        data.put("lastName", newUser.getLastName());
        data.put("phoneNumber", newUser.getPhoneNumber());
        data.put("address", newUser.getAddress());
        data.put("status", newUser.getStatus().toString());
        
        return new UserEventDto("user-updated", newUser.getId(), data, changedFields);
    }
    
    /**
     * สร้าง User Deleted Event
     */
    public UserEventDto createUserDeletedEvent(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("username", user.getUsername());
        data.put("email", user.getEmail());
        
        return new UserEventDto("user-deleted", user.getId(), data);
    }
    
    /**
     * สร้าง User Status Changed Event
     */
    public UserEventDto createUserStatusChangedEvent(User user, User.UserStatus oldStatus, User.UserStatus newStatus) {
        Map<String, Object> data = new HashMap<>();
        data.put("username", user.getUsername());
        data.put("email", user.getEmail());
        data.put("oldStatus", oldStatus.toString());
        data.put("newStatus", newStatus.toString());
        
        return new UserEventDto("user-status-changed", user.getId(), data);
    }
    
    /**
     * เปรียบเทียบ User และหา changed fields
     */
    public List<String> getChangedFields(User oldUser, User newUser) {
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