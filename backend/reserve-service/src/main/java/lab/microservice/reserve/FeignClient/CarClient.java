package lab.microservice.reserve.FeignClient;

import lab.microservice.reserve.Dtos.CarDto;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/car/{id}")
    CarDto getCarByCarId(@PathVariable Long id);
}
