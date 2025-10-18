package lab.microservice.reserve.FeignClient;

import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "receipt-service", url = "http://localhost:8082")
public interface ReceiptClient {

    // // สร้าง Receipt พร้อมกับ Reserve
    // @PostMapping("/receipts")
    // void createReceipt(ReserveDto dto);

    // ดึง Receipt ที่ผูกกับ Reserve
    @GetMapping("/receipts/reserve/{reserveId}")
    ReceiptDto getByReserveId(@PathVariable("reserveId") Long reserveId);
}
