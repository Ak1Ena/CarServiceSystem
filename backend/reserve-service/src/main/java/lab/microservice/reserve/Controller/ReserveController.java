package lab.microservice.reserve.Controller;

import lab.microservice.reserve.entity.Reserve;
import lab.microservice.reserve.Dtos.CarDto;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import lab.microservice.reserve.Dtos.UserDto;
import lab.microservice.reserve.FeignClient.CarClient;
import lab.microservice.reserve.FeignClient.ReceiptClient;
import lab.microservice.reserve.Repo.ReserveRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
                        reserve.getEndDate()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserve> getReserveById(@PathVariable Long id){
        if (id != null) {
            Optional<Reserve> reserve = reserveRepository.findById(id);
            if (!reserve.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(reserve.get());
        }else{
            return ResponseEntity.badRequest().build();
        }
    }
    // GET receipt by reserve id
    // @GetMapping("/{id}/receipt")
    // public ResponseEntity<ReceiptDto> getReceiptByReserveId(@PathVariable Long id) {
    //     try {
    //         ReceiptDto receipt = receiptClient.getByReserveId(id);
    //         return ResponseEntity.ok(receipt);
    //     } catch (Exception e) {
    //         return ResponseEntity.notFound().build();
    //     }
    // }
    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Reserve>> getReserveByOwnerId(@PathVariable Long id){
        List<CarDto> cars = carClient.getCarsByUserId(id);
        List<Reserve> allReserves = new ArrayList<>();
        for(CarDto car : cars){
            List<Reserve> reservesForCar = reserveRepository.findByCarId(car.getId());
            allReserves.addAll(reservesForCar);
        } 
        if (allReserves.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(allReserves);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Reserve>> getReserveByUserId(@PathVariable Long id){
        List<Reserve> reserves = reserveRepository.findByUserId(id);
        if (reserves.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reserves);
    }
    // POST
    @PostMapping
    public ResponseEntity<ReserveDto> createReserve(@RequestBody ReserveDto dto) {
        Reserve reserve = new Reserve(
                null,
                dto.getCarId(),
                dto.getUserId(),
                dto.getStartDate(),
                dto.getEndDate()
        );
        reserve.setStatus("Wating");
        reserve.setPrice(carClient.getCarByCarId(dto.getCarId()).getPrice());

        Reserve saved = reserveRepository.save(reserve);

        ReserveDto responseDto = new ReserveDto(
                saved.getId(),
                saved.getCarId(),
                saved.getUserId(),
                saved.getStartDate(),
                saved.getEndDate()
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
                    reserve.setStatus(dto.getStatus());
                    Reserve updated = reserveRepository.save(reserve);

                    ReserveDto response = new ReserveDto(
                            updated.getId(),
                            updated.getCarId(),
                            updated.getUserId(),
                            updated.getStartDate(),
                            updated.getEndDate()
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
                    if (dto.getStatus() != null) {
                        reserve.setStatus(dto.getStatus());
                    }
                    Reserve updated = reserveRepository.save(reserve);

                    ReserveDto response = new ReserveDto(
                            updated.getId(),
                            updated.getCarId(),
                            updated.getUserId(),
                            updated.getStartDate(),
                            updated.getEndDate()
                    );
                    response.setStatus(updated.getStatus());
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
