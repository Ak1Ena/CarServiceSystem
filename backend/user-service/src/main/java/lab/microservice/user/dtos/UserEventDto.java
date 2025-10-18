package lab.microservice.user.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

public class UserEventDto {

    @JsonProperty("event")
    private String event;

    @JsonProperty("userId")
    private Long userId;

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("data")
    private Map<String, Object> data;

    @JsonProperty("changes")
    private List<String> changes;

    // Default constructor
    public UserEventDto() {
        this.timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + "Z";
    }

    // Constructor
    public UserEventDto(String event, Long userId, Map<String, Object> data) {
        this();
        this.event = event;
        this.userId = userId;
        this.data = data;
    }

    // Constructor with changes
    public UserEventDto(String event, Long userId, Map<String, Object> data, List<String> changes) {
        this(event, userId, data);
        this.changes = changes;
    }

    // Getters and Setters
    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }

    public List<String> getChanges() {
        return changes;
    }

    public void setChanges(List<String> changes) {
        this.changes = changes;
    }

    @Override
    public String toString() {
        return "UserEventDto{" +
                "event='" + event + '\'' +
                ", userId=" + userId +
                ", timestamp='" + timestamp + '\'' +
                ", data=" + data +
                ", changes=" + changes +
                '}';
    }
}