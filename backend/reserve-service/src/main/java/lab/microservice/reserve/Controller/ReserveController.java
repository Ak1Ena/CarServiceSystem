package lab.microservice.reserve.Controller;

import lab.microservice.reserve.entity.Reserve;
import lab.microservice.reserve.Dtos.CarDto;
import lab.microservice.reserve.Dtos.PaymentDto;
import lab.microservice.reserve.Dtos.ReceiptDto;
import lab.microservice.reserve.Dtos.ReserveDto;
import lab.microservice.reserve.Dtos.UserDto;
import lab.microservice.reserve.Dtos.PaymentDto.PaymentStatus;
import lab.microservice.reserve.FeignClient.CarClient;
import lab.microservice.reserve.FeignClient.PaymentClient;
import lab.microservice.reserve.FeignClient.ReceiptClient;
import lab.microservice.reserve.FeignClient.UserFeignClient;
import lab.microservice.reserve.Repo.ReserveRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/reserves")
public class ReserveController {

    private final ReserveRepository reserveRepository;
    private final ReceiptClient receiptClient;
    private final CarClient carClient;
    private final UserFeignClient userClient;
    private final PaymentClient paymentClient;

    @Autowired
    public ReserveController(ReserveRepository reserveRepository, ReceiptClient receiptClient, CarClient carClient, UserFeignClient userClient, PaymentClient paymentClient) {
        this.reserveRepository = reserveRepository;
        this.receiptClient = receiptClient;
        this.carClient = carClient;
        this.userClient = userClient;
        this.paymentClient = paymentClient;
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
    @GetMapping("/car/{id}")
    public ResponseEntity<List<Reserve>> getReserveByCarId(@PathVariable Long id){
        List<Reserve> allReserves = reserveRepository.findByCarId(id);
        if (allReserves.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(allReserves);
    }
    @GetMapping("/owner/{id}")
    public ResponseEntity<List<Map<String,Object>>> getReserveByOwnerId(@PathVariable Long id){
        try{
            List<Map<String,Object>> result = new ArrayList<>();
            List<CarDto> cars = carClient.getCarsByUserId(id);
           for (CarDto car : cars) {
                List<Reserve> reservesForCar = reserveRepository.findByCarId(car.getId());
                if (!reservesForCar.isEmpty()) {
                    Map<String, Object> carRes = new HashMap<>();
                    carRes.put("car", car);
                    List<Map<String, Object>> reserves = new ArrayList<>();
                    for (Reserve reserve : reservesForCar) {
                        UserDto user = userClient.getUserById(reserve.getUserId());
                        Map<String,Object> reserveInfo = new HashMap<>();
                        reserveInfo.put("reserve", reserve);
                        reserveInfo.put("user", user.getName());
                        reserves.add(reserveInfo);
                    }
                    carRes.put("reserves", reserves);
                    result.add(carRes);
                }
            }

            return ResponseEntity.ok(result);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        
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
                    if (dto.getStatus() != null && dto.getStatus().equalsIgnoreCase("SUCCESS")) {
                        PaymentDto paymentDto = new PaymentDto();
                        paymentDto.setUserId(dto.getUserId());
                        try{
                            paymentDto.setUserName(userClient.getUserById(dto.getUserId()).getUsername());
                        }catch( Exception e ){
                            paymentDto.setUserName("UNKNOWN");
                        }
                        paymentDto.setGrandTotal(BigDecimal.valueOf(dto.getPrice()));
                        paymentDto.setPaidAt(null);
                        paymentDto.setPaymentMethod("CASH");
                        paymentDto.setStatus(String.valueOf(PaymentStatus.PENDING));
                        paymentDto.setReserveId(dto.getId());
                        paymentDto.setGrandTotal(BigDecimal.valueOf(dto.getPrice()));
                        paymentClient.createPayment(paymentDto);
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
