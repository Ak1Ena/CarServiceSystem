package lab.microservice.reserve.Controller;

import lab.microservice.reserve.entity.Reserve;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import lab.microservice.reserve.FeignClient.ReceiptClient;
import lab.microservice.reserve.Repo.ReserveRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reserves")
public class ReserveController {
    @Autowired
    private ReserveRepository reserveRepository;

    private final ReceiptClient receiptClient;

    public ReserveController(ReserveRepository reserveRepository, ReceiptClient receiptClient) {
        this.reserveRepository = reserveRepository;
        this.receiptClient = receiptClient;
    }

    // GET all
    @GetMapping
    public List<ReserveDto> getAllReserves() {
        return reserveRepository.findAll().stream()
                .map(reserve -> new ReserveDto(
                        reserve.getId(),
                        reserve.getCarId(),
                        reserve.getUserId(),
                        reserve.getStartDate(),
                        reserve.getEndDate()))
                .collect(Collectors.toList());
    }

    // GET by id
    @GetMapping("/{id}/receipt")
    public ResponseEntity<ReceiptDto> getReceiptByReserveId(@PathVariable Long id) {
        try {
            ReceiptDto receipt = receiptClient.getByReserveId(id);
            return ResponseEntity.ok(receipt);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // POST
    @PostMapping
    public ReserveDto createReserve(@RequestBody ReserveDto dto) {
        // 1) Save ลง DB
        Reserve reserve = new Reserve(
                null,
                dto.getCarId(),
                dto.getUserId(),
                dto.getStartDate(),
                dto.getEndDate());
        Reserve saved = reserveRepository.save(reserve);
        return new ReserveDto(
                saved.getId(),
                saved.getCarId(),
                saved.getUserId(),
                saved.getStartDate(),
                saved.getEndDate());
    }

    // PUT
    @PutMapping("/{id}")
    public ReserveDto updateReserve(@PathVariable Long id, @RequestBody ReserveDto dto) {
        return reserveRepository.findById(id).map(reserve -> {
            reserve.setCarId(dto.getCarId());
            reserve.setUserId(dto.getUserId());
            reserve.setStartDate(dto.getStartDate());
            reserve.setEndDate(dto.getEndDate());
            Reserve updated = reserveRepository.save(reserve);
            return new ReserveDto(
                    updated.getId(),
                    updated.getCarId(),
                    updated.getUserId(),
                    updated.getStartDate(),
                    updated.getEndDate());
        }).orElse(null);
    }

    // PATCH
    @PatchMapping("/{id}")
    public ReserveDto patchReserve(@PathVariable Long id, @RequestBody ReserveDto dto) {
        return reserveRepository.findById(id).map(reserve -> {
            if (dto.getCarId() != null)
                reserve.setCarId(dto.getCarId());
            if (dto.getUserId() != null)
                reserve.setUserId(dto.getUserId());
            if (dto.getStartDate() != null)
                reserve.setStartDate(dto.getStartDate());
            if (dto.getEndDate() != null)
                reserve.setEndDate(dto.getEndDate());
            Reserve updated = reserveRepository.save(reserve);
            return new ReserveDto(
                    updated.getId(),
                    updated.getCarId(),
                    updated.getUserId(),
                    updated.getStartDate(),
                    updated.getEndDate());
        }).orElse(null);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void deleteReserve(@PathVariable Long id) {
        reserveRepository.deleteById(id);
    }
    
}