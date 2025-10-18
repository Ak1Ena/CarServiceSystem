package lab.microservice.payment.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "user-service")
public interface UserFeignClient {
    @GetMapping("/users/{id}")
    JsonNode getUserById(@PathVariable("id") Long id);
}