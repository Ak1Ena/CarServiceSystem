package lab.microservice.payment.FeignClient;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "receipt-service")
public interface ReceiptFeignClient {
    @GetMapping("/receipts/{id}")
    JsonNode getReceiptAmountById(@PathVariable("id") Long id);

}
