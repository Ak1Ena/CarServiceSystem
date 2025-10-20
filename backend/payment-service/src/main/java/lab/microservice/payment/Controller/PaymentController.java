/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package lab.microservice.payment.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lab.microservice.payment.Dtos.CarDto;
import lab.microservice.payment.Dtos.PaymentDto;
import lab.microservice.payment.Dtos.PaymentEventDto;
import lab.microservice.payment.Dtos.ReserveDto;
import lab.microservice.payment.Entity.Payment;
import lab.microservice.payment.Entity.PaymentMethod;
import lab.microservice.payment.Entity.PaymentStatus;
import lab.microservice.payment.FeignClient.CarFeignClient;
import lab.microservice.payment.FeignClient.ReceiptFeignClient;
import lab.microservice.payment.FeignClient.ReserveClient;
import lab.microservice.payment.FeignClient.UserFeignClient;
import lab.microservice.payment.Repository.PaymentRepository;

/**
 *
 * @author User
 */

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentRepository repo;
    @Autowired
    private KafkaTemplate<String, String> kafka;
    private final UserFeignClient userClient;
    private final ReceiptFeignClient receiptClient;
    private final CarFeignClient carClient;
    private final ReserveClient reserveClient;
    ObjectMapper mapper = new ObjectMapper();
    private static final DateTimeFormatter PAID_AT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

    public PaymentController(PaymentRepository repo, KafkaTemplate<String, String> kafka, UserFeignClient userClient,
            ReceiptFeignClient receiptClient, CarFeignClient carClient, ReserveClient reserveClient) {
        this.repo = repo;
        this.kafka = kafka;
        this.userClient = userClient;
        this.receiptClient = receiptClient;
        this.carClient = carClient;
        this.reserveClient = reserveClient;
    }

    // getAll
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(repo.findAll());
    }

    // @GetMapping("/car/{paymendId}")
    // public ResponseEntity<JsonNode> getCarWithRenterByPaymentId(@PathVariable
    // Long paymendId){
    // Payment payment = repo.findByPaymentId(paymendId);
    // if (payment == null) {
    // return ResponseEntity.notFound().build();
    // }
    // ReserveDto reserve =
    // reserveClient.getReserveByReserveId(payment.getReserveId());
    // CarDto carDto = carClient.getCarByCarId(reserve.getCarId());
    // JsonNode renter = userClient.getUserById(reserve.getUserId());
    // JsonNode carOwner = userClient.getUserById(carDto.getUserId());

    // ObjectMapper mapper = new ObjectMapper();
    // ObjectNode result = JsonNodeFactory.instance.objectNode();

    // result.set("payment", mapper.valueToTree(payment));
    // result.set("reserve", mapper.valueToTree(reserve));
    // result.set("car", renter);
    // result.set("carOwner", carOwner);
    // return ResponseEntity.ok(result);
    // }
    // getByPaymentId
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<JsonNode> getPaymentDetailsForOwner(@PathVariable Long ownerId){
        try {
            
       
            List<CarDto> cars = carClient.getCarsByUserId(ownerId);
            ObjectMapper mapper = new ObjectMapper();
            ArrayNode res = mapper.createArrayNode();
            for(CarDto car : cars){
                List<ReserveDto> reserves = reserveClient.getReserveByCarId(car.getId());
                ObjectNode carNode = mapper.createObjectNode();
                carNode.set("car", mapper.valueToTree(car));
                ArrayNode resercesArr = mapper.createArrayNode();
                for(ReserveDto reserve : reserves){
                    Payment payment = repo.findByReserveId(reserve.getId());
                    ObjectNode reservNode = mapper.createObjectNode();
                    reservNode.set("reserve",mapper.valueToTree(reserve));

                    JsonNode renter = userClient.getUserById(reserve.getUserId());
                    reservNode.set("renter", renter);

                    if (payment != null) {
                        reservNode.set("payment", mapper.valueToTree(payment));
                    }else{
                        reservNode.putNull("payment");
                    }
                    resercesArr.add(reservNode);
                }
                carNode.set("reserves",resercesArr);
                res.add(carNode);
            }
            ObjectNode result = mapper.createObjectNode();
            result.set("ownerId",mapper.valueToTree(ownerId));
            result.set("cars", res);

            return ResponseEntity.ok(result);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getById(@PathVariable Long paymentId) {
        return repo.findById(paymentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // getByUserId
    @GetMapping("user/{userId}")
    public List<PaymentDto> getByUser(@PathVariable Long userId) {
        return repo.findByUserId(userId)
                .stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // getByPaymentStatus
    @GetMapping("/status/{status}")
    public List<PaymentDto> getByStatus(@PathVariable String status) {
        PaymentStatus ps;
        try {
            ps = PaymentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }
        return repo.findByStatus(ps).stream().map(this::convertToDto).collect(Collectors.toList());
    }

    // createPayment
    @PostMapping
    @Transactional
    public ResponseEntity<PaymentDto> createPayment(@RequestBody PaymentDto dto) {

        if (dto.getReserveId() == null || dto.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (repo.existsByReserveId(dto.getReserveId())) {
            throw new DuplicatePaymentForReserveException(dto.getReserveId());
        }

        JsonNode userJson = userClient.getUserById(dto.getUserId());
        String userName = (userJson != null && userJson.has("name"))
                ? userJson.get("name").asText()
                : "Unknown";
        if (userName.equals("Unknown") || userName.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "User not found").build();
        }

        BigDecimal amount = BigDecimal.valueOf(reserveClient.getReserveByReserveId(dto.getReserveId()).getPrice());

        Payment payment = new Payment();
        payment.setReserveId(dto.getReserveId());
        payment.setUserId(dto.getUserId());
        payment.setUsername(userName);
        payment.setGrandTotal(amount);
        payment.setStatus(PaymentStatus.PENDING);
        payment = repo.save(payment);
        PaymentDto response = convertToDto(payment);
        return ResponseEntity.ok(response);
    }

    // makePayment
    @PatchMapping("/{paymentId}/paid")
    @Transactional
    public ResponseEntity<PaymentDto> makePayment(@PathVariable("paymentId") Long paymentId,
            @RequestBody PaymentDto paymentmethod) throws JsonProcessingException {

        Payment payment = repo.findById(paymentId).orElse(null);
        if (payment == null)
            return ResponseEntity.notFound().build();

        if (payment.getStatus() == PaymentStatus.PAID) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        if (paymentmethod == null || paymentmethod.getPaymentMethod() == null
                || paymentmethod.getPaymentMethod().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        final PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(paymentmethod.getPaymentMethod().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDateTime.now());
        payment.setPaymentMethod(method);
        payment = repo.save(payment);

        PaymentEventDto event = new PaymentEventDto();
        event.setEvent("payment-status-updated");
        event.setStatus("PAID");
        event.setPaymentMethod(method.name());
        event.setPaidAt(payment.getPaidAt().format(PAID_AT_FMT));
        event.setReserveId(payment.getReserveId());
        event.setPaymentId(payment.getPaymentId());
        String json = mapper.writeValueAsString(event);
        kafka.send("payment", json);
        return ResponseEntity.ok(convertToDto(payment));
    }

    // deletePayment
    @DeleteMapping("/{paymentId}")
    @Transactional
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long paymentId) throws JsonProcessingException {
        if (!repo.existsById(paymentId))
            return ResponseEntity.notFound().build();
        repo.deleteById(paymentId);
        PaymentEventDto paymentDelete = new PaymentEventDto();
        paymentDelete.setPaymentId(paymentId);
        paymentDelete.setReserveId(paymentId);
        paymentDelete.setEvent("payment-deleted");
        String json = mapper.writeValueAsString(paymentDelete);
        kafka.send("payment", json);
        return ResponseEntity.noContent().build();
    }

    public PaymentDto convertToDto(Payment p) {
        PaymentDto dto = new PaymentDto();
        dto.setPaymentId(p.getPaymentId());
        dto.setReserveId(p.getReserveId());
        dto.setUserId(p.getUserId());
        dto.setStatus(p.getStatus() == null ? null : p.getStatus().name());
        dto.setPaymentMethod(p.getPaymentMethod() == null ? null : p.getPaymentMethod().name());
        dto.setPaidAt(p.getPaidAt());

        if (p.getReserveId() != null) {
            try {
                BigDecimal reserveDto = BigDecimal
                        .valueOf(reserveClient.getReserveByReserveId(p.getReserveId()).getPrice());
            } catch (Exception e) {
                dto.setGrandTotal(BigDecimal.ZERO);
            }
        } else {
            dto.setGrandTotal(BigDecimal.ZERO);
        }

        try {
            JsonNode userJson = userClient.getUserById(p.getUserId());
            if (userJson != null && userJson.has("name") && !userJson.get("name").isNull()) {
                dto.setUserName(userJson.get("name").asText());
            } else {
                dto.setUserName("User not found");
            }
        } catch (Exception e) {
            dto.setUserName("User not found");
        }
        return dto;
    }

    // paresePaymentStatus
    private PaymentStatus parseStatus(String s) {
        if (s == null || s.isBlank())
            return null;
        try {
            return PaymentStatus.valueOf(s.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadStatusException(s);
        }
    }

    @ResponseStatus(org.springframework.http.HttpStatus.CONFLICT)
    static class DuplicatePaymentForReserveException extends RuntimeException {
        public DuplicatePaymentForReserveException(Long reserveId) {
            super("Payment already exists for ReserveId=" + reserveId);
        }
    }

    @ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
    static class BadStatusException extends RuntimeException {
        public BadStatusException(String status) {
            super("Invalid status: " + status + " (allowed: PENDING, PAID, FAILED, REFUNDED, CANCELED)");
        }
    }

}