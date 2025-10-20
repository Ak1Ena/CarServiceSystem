package lab.microservice.receipt.FeignClient;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

import lab.microservice.receipt.Dtos.ReserveDto;

@FeignClient(name = "reserve-service")
public interface ReserveClient {
    @GetMapping("/reserves/{id}")
    ReserveDto getReserveByReserveId(@PathVariable("id") Long id);

    @GetMapping("/reserves/car/{id}")
    List<ReserveDto> getReserveByCarId(@PathVariable("id") Long carId);
}