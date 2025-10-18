package lab.microservice.car.Kafka;

import java.util.List;
import java.util.logging.Logger;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lab.microservice.car.Controller.CarController;
import lab.microservice.car.entity.Car;
import lab.microservice.car.Repository.CarRepository;

@Component
public class CarListener {

	private static final Logger log = Logger.getLogger(CarListener.class.getName());
	private final CarController carController;
	private final CarRepository carRepository;

	public CarListener(CarController carController, CarRepository carRepository) {
		this.carController = carController;
		this.carRepository = carRepository;
	}

	@KafkaListener(topics = "user", groupId = "car-service-group")
	public void onDeleteUser(ConsumerRecord<String, String> record) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			JsonNode jsonNode = mapper.readTree(record.value());

			if ("user-deleted".equals(jsonNode.get("event").asText())) {
				Long userId = jsonNode.get("userId").asLong();
				List<Car> cars = carRepository.findByUserId(userId);
				cars.forEach(car -> {
					log.info("Deleting car: " + car.getId());
					carController.deleteCar(car.getId());
				});
			}
		} catch (Exception e) {
			log.severe("Failed to process Kafka message: " + record.value() + " error: " + e.getMessage());
		}
	}

	private String extract(String json, String key) {
		if (json == null)
			return null;
		String pattern = "\"" + key + "\"";
		int i = json.indexOf(pattern);
		if (i < 0)
			return null;
		int colon = json.indexOf(':', i + pattern.length());
		if (colon < 0)
			return null;
		int start = colon + 1;
		while (start < json.length() && Character.isWhitespace(json.charAt(start)))
			start++;
		boolean quoted = start < json.length() && json.charAt(start) == '"';
		if (quoted)
			start++;
		int end = start;
		while (end < json.length()) {
			char c = json.charAt(end);
			if ((quoted && c == '"') || (!quoted && (c == ',' || c == '}')))
				break;
			end++;
		}
		return json.substring(start, end);
	}
}
