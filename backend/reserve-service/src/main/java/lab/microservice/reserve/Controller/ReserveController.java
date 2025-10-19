package lab.microservice.reserve.Controller;

import lab.microservice.reserve.entity.Reserve;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import lab.microservice.reserve.FeignClient.CarClient;
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

    private final ReserveRepository reserveRepository;
    private final ReceiptClient receiptClient;
    private final CarClient carClient;

    @Autowired
    public ReserveController(ReserveRepository reserveRepository, ReceiptClient receiptClient, CarClient carClient) {
        this.reserveRepository = reserveRepository;
        this.receiptClient = receiptClient;
        this.carClient = carClient;
    }


    // GET all
    @GetMapping
    public ResponseEntity<List<ReserveDto>> getAllReserves() {
        List<ReserveDto> list = reserveRepository.findAll().stream()
                .map(reserve -> new ReserveDto(
                        reserve.getId(),
                        reserve.getCarId(),
                        reserve.getUserId(),
                        reserve.getStartDate(),
                        reserve.getEndDate(),
                        reserve.getOwnerId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // GET receipt by reserve id
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
    public ResponseEntity<ReserveDto> createReserve(@RequestBody ReserveDto dto) {
        Reserve reserve = new Reserve(
                null,
                dto.getCarId(),
                dto.getUserId(),
                dto.getStartDate(),
                dto.getEndDate(),
                dto.getOwnerId()
        );

        Reserve saved = reserveRepository.save(reserve);

        ReserveDto responseDto = new ReserveDto(
                saved.getId(),
                saved.getCarId(),
                saved.getUserId(),
                saved.getStartDate(),
                saved.getEndDate(),
                saved.getOwnerId()
        );

        return ResponseEntity.ok(responseDto);
    }

    // PUT
    @PutMapping("/{id}")
    public ResponseEntity<ReserveDto> updateReserve(@PathVariable Long id, @RequestBody ReserveDto dto) {
        return reserveRepository.findById(id)
                .map(reserve -> {
                    reserve.setCarId(dto.getCarId());
                    reserve.setUserId(dto.getUserId());
                    reserve.setStartDate(dto.getStartDate());
                    reserve.setEndDate(dto.getEndDate());
                    reserve.setOwnerId(dto.getOwnerId());
                    Reserve updated = reserveRepository.save(reserve);

                    ReserveDto response = new ReserveDto(
                            updated.getId(),
                            updated.getCarId(),
                            updated.getUserId(),
                            updated.getStartDate(),
                            updated.getEndDate(),
                            updated.getOwnerId()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // PATCH
    @PatchMapping("/{id}")
    public ResponseEntity<ReserveDto> patchReserve(@PathVariable Long id, @RequestBody ReserveDto dto) {
        return reserveRepository.findById(id)
                .map(reserve -> {
                    if (dto.getCarId() != null) reserve.setCarId(dto.getCarId());
                    if (dto.getUserId() != null) reserve.setUserId(dto.getUserId());
                    if (dto.getStartDate() != null) reserve.setStartDate(dto.getStartDate());
                    if (dto.getEndDate() != null) reserve.setEndDate(dto.getEndDate());
                    if (dto.getOwnerId() != null) reserve.setOwnerId(dto.getOwnerId());
                    Reserve updated = reserveRepository.save(reserve);

                    ReserveDto response = new ReserveDto(
                            updated.getId(),
                            updated.getCarId(),
                            updated.getUserId(),
                            updated.getStartDate(),
                            updated.getEndDate(),
                            updated.getOwnerId()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserve(@PathVariable Long id) {
        if (!reserveRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reserveRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
