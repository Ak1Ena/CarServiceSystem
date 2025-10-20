package lab.microservice.payment.FeignClient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

import lab.microservice.payment.Dtos.CarDto;

@FeignClient(name = "car-service")
public interface CarFeignClient {
    @GetMapping("/cars/user/{userId}")
    List<CarDto> getCarsByUserId(@PathVariable("userId") Long userId);

    @GetMapping("/cars/{carid}")
    CarDto getCarByCarId(@PathVariable("carid") Long carId);

    @GetMapping("/cars/{carid}/user")
    JsonNode getCarAndOwnerByCarId(@PathVariable("carid") Long carId);
}
