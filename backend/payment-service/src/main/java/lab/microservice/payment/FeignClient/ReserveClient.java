package lab.microservice.payment.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

import lab.microservice.payment.Dtos.ReserveDto;

@FeignClient(name = "reserve-service")
public interface ReserveClient {
    @GetMapping("/reserves/{id}")
    ReserveDto getReserveByReserveId(@PathVariable("id") Long id);
}