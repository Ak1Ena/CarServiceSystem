package lab.microservice.receipt.FeignClient;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

public interface CarFeignClient {
    @GetMapping("/cars/{id}")
    JsonNode getCarById(@PathVariable("id") Long id);
}
