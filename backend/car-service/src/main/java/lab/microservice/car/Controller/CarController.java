package lab.microservice.car.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;

import lab.microservice.car.Dtos.CarDto;
import lab.microservice.car.entity.Car;
import lab.microservice.car.Fegien.UserClient;
import lab.microservice.car.Repository.CarRepository;

@RestController
@RequestMapping("/cars")
public class CarController {
    @Autowired
    final UserClient userClient;
    @Autowired
    private final KafkaTemplate<String, String> carKafkaTemplate;
    @Autowired
    private CarRepository carRepository;

    @Value("${app.kafka.topic:car}")
    private String topic;

     @Autowired
    public CarController(UserClient userClient,
                         KafkaTemplate<String, String> carKafkaTemplate,
                         CarRepository carRepository) {
        this.userClient = userClient;
        this.carKafkaTemplate = carKafkaTemplate;
        this.carRepository = carRepository;
    }

    @PostMapping
    public ResponseEntity<CarDto> addCar(@RequestBody CarDto carDto) {
        Car car = new Car();
        car.setModel(carDto.getModel());
        car.setPlateNumber(carDto.getPlateNumber());
        car.setUserId(carDto.getUserId());
        Car savedCar = carRepository.save(car);

        CarDto responseDto = new CarDto();
        responseDto.setId(savedCar.getId());
        responseDto.setModel(savedCar.getModel());
        responseDto.setPlateNumber(savedCar.getPlateNumber());
        responseDto.setUserId(savedCar.getUserId());
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<CarDto>> getAllCars() {
        List<Car> cars = carRepository.findAll();
        List<CarDto> carDtos = cars.stream().map(car -> {
            CarDto dto = new CarDto();
            dto.setId(car.getId());
            dto.setModel(car.getModel());
            dto.setPlateNumber(car.getPlateNumber());
            dto.setUserId(car.getUserId());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(carDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDto> getCarById(@PathVariable Long id) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        CarDto dto = new CarDto();
        dto.setId(car.getId());
        dto.setModel(car.getModel());
        dto.setPlateNumber(car.getPlateNumber());
        dto.setUserId(car.getUserId());
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CarDto> updateCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        if (carDto.getId() != null) {
            car.setId(carDto.getId());
        }
        if (carDto.getPlateNumber() != null) {
            car.setPlateNumber(carDto.getPlateNumber());

        }
        if (carDto.getUserId() != 0) {
            car.setUserId(carDto.getUserId());
        }
        Car updatedCar = carRepository.save(car);
        CarDto responseDto = new CarDto();
        responseDto.setId(updatedCar.getId());
        responseDto.setModel(updatedCar.getModel());
        responseDto.setPlateNumber(updatedCar.getPlateNumber());
        responseDto.setUserId(updatedCar.getUserId());
        carKafkaTemplate.send(topic, "Updated car: " + responseDto);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDto> replaceCar(@PathVariable Long id, @RequestBody CarDto carDto) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        car.setModel(carDto.getModel());
        car.setPlateNumber(carDto.getPlateNumber());
        car.setUserId(carDto.getUserId());
        Car updatedCar = carRepository.save(car);
        CarDto responseDto = new CarDto();
        responseDto.setId(updatedCar.getId());
        responseDto.setModel(updatedCar.getModel());
        responseDto.setPlateNumber(updatedCar.getPlateNumber());
        responseDto.setUserId(updatedCar.getUserId());
        carKafkaTemplate.send(topic, "Replaced car: " + responseDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<CarDto>> getCarsByUserId(@PathVariable Long id) {
        List<Car> cars = carRepository.findByUserId(id);
        List<CarDto> carDtos = cars.stream().map(car -> {
            CarDto dto = new CarDto();
            dto.setId(car.getId());
            dto.setModel(car.getModel());
            dto.setPlateNumber(car.getPlateNumber());
            dto.setUserId(car.getUserId());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(carDtos);
    }

    @GetMapping("/{carId}/user")
    public ResponseEntity<JsonNode> getCarWithUser(@PathVariable Long carId) {
        Car car = carRepository.findById(carId).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        JsonNode user = userClient.getUserById(car.getUserId());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode response = JsonNodeFactory.instance.objectNode();
        response.set("car", mapper.valueToTree(car));
        response.set("user", mapper.valueToTree(user));
        return ResponseEntity.ok(response);
    }
    // @GetMapping("{carId}/user/{userId}")
    // public ResponseEntity<JsonNode> getCarWithUser(@PathVariable Long carId, @PathVariable Long userId) {
    //     JsonNode user = userClient.getUserById(userId);
    //     if (user == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     Car car = carRepository.findById(carId).orElse(null);
    //     if (car == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     ObjectMapper mapper = new ObjectMapper();
    //     ObjectNode response = JsonNodeFactory.instance.objectNode();
    //     response.set("car", mapper.valueToTree(car));
    //     response.set("user", mapper.valueToTree(user));
    //     return ResponseEntity.ok(response);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        Car car = carRepository.findById(id).orElse(null);
        if (car == null) {
            return ResponseEntity.notFound().build();
        }
        carRepository.delete(car);
        JsonMapper jsonMapper = new JsonMapper();
        JsonNode jsonNode = jsonMapper.createObjectNode();
        ((ObjectNode) jsonNode).put("event", "car-deleted");
        ((ObjectNode) jsonNode).put("carId", id);
        carKafkaTemplate.send(topic, jsonNode.toString());
        return ResponseEntity.noContent().build();
    }

}
