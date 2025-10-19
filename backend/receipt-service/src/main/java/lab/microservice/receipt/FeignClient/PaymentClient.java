package lab.microservice.receipt.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "payment-service")
public interface PaymentClient {
    @GetMapping("/payment/{id}")
    JsonNode getPaymentByPaymentId(@PathVariable("id") Long id);
}
