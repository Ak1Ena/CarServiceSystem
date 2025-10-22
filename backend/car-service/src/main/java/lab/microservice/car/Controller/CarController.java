package lab.microservice.car.Controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDto> addCar(@RequestPart CarDto carDto,
            @RequestPart(value = "images", required = false) MultipartFile[] images) throws IOException {
        Car car = new Car();
        car.setModel(carDto.getModel());
        car.setPlateNumber(carDto.getPlateNumber());
        car.setUserId(carDto.getUserId());

        car.setImg1(null);
        car.setImg2(null);
        car.setImg3(null);
        car.setPrice(carDto.getPrice());
        car.setType(carDto.getType());
        if (images != null && images.length > 0) {
            if (images.length > 0)
                car.setImg1(images[0].getBytes());
            if (images.length > 1)
                car.setImg2(images[1].getBytes());
            if (images.length > 2)
                car.setImg3(images[2].getBytes());
        }
        car.setPickUp(carDto.getPickUp());
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
            dto.setImg1(car.getImg1());
            dto.setImg2(car.getImg2());
            dto.setImg3(car.getImg3());
            dto.setType(car.getType());
            dto.setPrice(car.getPrice());
            dto.setPickUp(car.getPickUp());
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
        dto.setImg1(car.getImg1());
        dto.setImg2(car.getImg2());
        dto.setImg3(car.getImg3());
        dto.setPrice(car.getPrice());
        dto.setType(car.getType());
        dto.setPickUp(car.getPickUp());
        return ResponseEntity.ok(dto);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CarDto> updateCar(@PathVariable Long id, @RequestPart CarDto carDto,
            @RequestPart(value = "images", required = false) MultipartFile[] images) throws IOException {
        Car car = carRepository.findById(id).orElse(null);
        if (carDto != null) {
            if (carDto.getModel() != null)
                car.setModel(carDto.getModel());
            if (carDto.getPlateNumber() != null)
                car.setPlateNumber(carDto.getPlateNumber());
            if (carDto.getUserId() != null)
                car.setUserId(carDto.getUserId());
            if (carDto.getPrice() != null)
                car.setPrice(carDto.getPrice());
            if (carDto.getType() != null)
                car.setType(carDto.getType());
            if (carDto.getPickUp() != null)
                car.setPickUp(carDto.getPickUp());
        }

        // อัปเดตรูปภาพ
        if (images != null && images.length > 0) {
            if (images.length > 0 && images[0] != null && !images[0].isEmpty())
                car.setImg1(images[0].getBytes());
            if (images.length > 1 && images[1] != null && !images[1].isEmpty())
                car.setImg2(images[1].getBytes());
            if (images.length > 2 && images[2] != null && !images[2].isEmpty())
                car.setImg3(images[2].getBytes());
        }

        Car updatedCar = carRepository.save(car);
        CarDto responseDto = new CarDto();
        responseDto.setId(updatedCar.getId());
        responseDto.setModel(updatedCar.getModel());
        responseDto.setPlateNumber(updatedCar.getPlateNumber());
        responseDto.setUserId(updatedCar.getUserId());
        responseDto.setImg1(updatedCar.getImg1());
        responseDto.setImg2(updatedCar.getImg2());
        responseDto.setImg3(updatedCar.getImg3());
        responseDto.setPickUp(updatedCar.getPickUp());
        responseDto.setPrice(updatedCar.getPrice());
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
            dto.setPrice(car.getPrice());
            dto.setImg1(car.getImg1());
            dto.setImg2(car.getImg2());
            dto.setImg3(car.getImg3());
            dto.setType(car.getType());
            dto.setPickUp(car.getPickUp());
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
    // public ResponseEntity<JsonNode> getCarWithUser(@PathVariable Long carId,
    // @PathVariable Long userId) {
    // JsonNode user = userClient.getUserById(userId);
    // if (user == null) {
    // return ResponseEntity.notFound().build();
    // }
    // Car car = carRepository.findById(carId).orElse(null);
    // if (car == null) {
    // return ResponseEntity.notFound().build();
    // }
    // ObjectMapper mapper = new ObjectMapper();
    // ObjectNode response = JsonNodeFactory.instance.objectNode();
    // response.set("car", mapper.valueToTree(car));
    // response.set("user", mapper.valueToTree(user));
    // return ResponseEntity.ok(response);
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
