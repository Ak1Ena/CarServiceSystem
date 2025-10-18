package lab.microservice.user.feign;

import lab.microservice.user.dtos.ReceiptDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "receipt-service", url = "http://localhost:8082/receipts")
public interface ReceiptClient {
    @GetMapping("/user/{userId}")
    List<ReceiptDto> getReceiptsByUserId(@PathVariable("userId") Long userId);
}