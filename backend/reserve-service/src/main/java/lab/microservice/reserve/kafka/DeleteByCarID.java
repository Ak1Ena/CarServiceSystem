    package lab.microservice.reserve.kafka;

    import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
    import com.fasterxml.jackson.databind.ObjectMapper;

    import lab.microservice.reserve.Repo.ReserveRepository;
import lab.microservice.reserve.entity.Reserve;

import java.util.List;
import java.util.Map;

    @Component
    public class DeleteByCarID {

        private final ReserveRepository reserveRepository;
        private final ObjectMapper objectMapper;

        public DeleteByCarID(ReserveRepository reserveRepository, ObjectMapper objectMapper) {
            this.reserveRepository = reserveRepository;
            this.objectMapper = objectMapper;
        }

        @KafkaListener(topics = "car", groupId = "reserve-service")
        public void consume(String message) {
            try {
                System.out.println("[DeleteByCarID] Received message: " + message);

                Map<String, Object> event = objectMapper.readValue(message, Map.class);
                String eventType = (String) event.get("event");

                if ("car-deleted".equals(eventType)) {
                    Long carId = ((Number) event.get("carId")).longValue();
                    if(reserveRepository.existsByCarId(carId)) {
                        List<Reserve> reserves = reserveRepository.findByCarId(carId);
                        reserveRepository.deleteAll(reserves);
                        System.out.println("[DeleteByCarID] Deleted reserve with carId=" + carId);
                    } else {
                        System.out.println("[DeleteByCarID] carId=" + carId + " not found in reserve");
                    }
                    // if (reserveRepository.existsByCarId(carId)) {
                    //     reserveRepository.deleteByCarId(carId);
                    //     System.out.println("[DeleteByCarID] Deleted reserve with carId=" + carId);
                    // } else {
                    //     System.out.println("[DeleteByCarID] carId=" + carId + " not found in reserve");
                    // }
                } else {
                    System.out.println("[DeleteByCarID] Ignored eventType=" + eventType);
                }
            } catch (Exception e) {
                System.err.println("[DeleteByCarID] Error processing message");
                e.printStackTrace();
            }
        }
    }
