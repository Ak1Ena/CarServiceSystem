package lab.microservice.reserve.FeignClient;

import lab.microservice.reserve.Dtos.CarDto;
import lab.microservice.reserve.Dtos.PaymentDto;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "payment-service")
public interface PaymentClient {
    @PostMapping("/payments")
    void createPayment(@RequestBody PaymentDto dto);
}
