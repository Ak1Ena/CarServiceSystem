package lab.microservice.receipt.FeignClient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

import lab.microservice.receipt.Dtos.CarDto;

@FeignClient(name = "car-service")
public interface CarFeignClient {
    @GetMapping("/car/user/{userId}")
    List<CarDto> getCarsByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/car/{carid}")
    CarDto getCarByCarId(@PathVariable("carid") Long carId);

    @GetMapping("/car/{carid}/user")
    JsonNode getCarAndOwnerByCarId(@PathVariable("carid") Long carId);
}
