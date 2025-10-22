/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package lab.microservice.payment.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    @Autowired
    ObjectMapper mapper = new ObjectMapper();
    private static final DateTimeFormatter PAID_AT_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

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
    public ResponseEntity<JsonNode> getPaymentDetailsForOwner(@PathVariable Long ownerId) {
        ArrayNode res = mapper.createArrayNode();

        try {
            List<CarDto> cars = null;
            try {
                cars = carClient.getCarsByUserId(ownerId);
            } catch (Exception ex) {
                logger.error("Failed to fetch cars for owner {}: {}", ownerId, ex.getMessage(), ex);
                // return 502 since upstream failed
                ObjectNode error = mapper.createObjectNode();
                error.put("error", "Failed to fetch cars for owner");
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
            }

            if (cars == null || cars.isEmpty()) {
                ObjectNode result = mapper.createObjectNode();
                result.put("ownerId", ownerId);
                result.set("cars", res);
                return ResponseEntity.ok(result);
            }

            for (CarDto car : cars) {
                ObjectNode carNode = mapper.createObjectNode();
                carNode.set("car", mapper.valueToTree(car));
                ArrayNode reservesArr = mapper.createArrayNode();

                List<ReserveDto> reserves = null;
                try {
                    reserves = reserveClient.getReserveByCarId(car.getId());
                } catch (Exception ex) {
                    logger.warn("Failed to fetch reserves for car {}: {}", car.getId(), ex.getMessage());
                }

                if (reserves == null || reserves.isEmpty()) {
                    carNode.set("reserves", reservesArr);
                    res.add(carNode);
                    continue;
                }

                for (ReserveDto reserve : reserves) {
                    if (reserve == null)
                        continue;
                    ObjectNode reservNode = mapper.createObjectNode();
                    reservNode.set("reserve", mapper.valueToTree(reserve));

                    // renter
                    JsonNode renter = null;
                    try {
                        renter = userClient.getUserById(reserve.getUserId());
                    } catch (Exception ex) {
                        logger.warn("Failed to fetch renter (userId={}) for reserve {}: {}", reserve.getUserId(),
                                reserve.getId(), ex.getMessage());
                    }
                    reservNode.set("renter", renter == null ? mapper.nullNode() : renter);

                    // payment (only if reserve id present)
                    if (reserve.getId() != null) {
                        try {
                            Payment payment = repo.findByReserveId(reserve.getId());
                            System.out.println("Looking for reserveId=" + reserve.getId() + ", found: " + payment);
                            if (payment != null) {
                                reservNode.set("payment", mapper.valueToTree(payment));
                            } else {
                                reservNode.putNull("payment");
                            }
                        } catch (Exception ex) {
                            logger.warn("Failed to query payment for reserve {}: {}", reserve.getId(), ex.getMessage());
                            reservNode.putNull("payment");
                        }
                    } else {
                        reservNode.putNull("payment");
                    }

                    reservesArr.add(reservNode);
                }

                carNode.set("reserves", reservesArr);
                res.add(carNode);
            }

            ObjectNode result = mapper.createObjectNode();
            result.put("ownerId", ownerId);
            result.set("cars", res);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            // catch any unexpected errors and log stacktrace
            logger.error("Unexpected error in getPaymentDetailsForOwner for owner {}: {}", ownerId, e.getMessage(), e);
            ObjectNode error = mapper.createObjectNode();
            error.put("error", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/reserve/{reserveId}")
    public ResponseEntity<PaymentDto> getByReserveId(@PathVariable Long reserveId) {
        Payment p = repo.findByReserveId(reserveId);
        PaymentDto po = new PaymentDto();
        po.setUserId(p.getUserId());
        po.setUserName(p.getUsername());
        po.setGrandTotal(p.getGrandTotal());
        po.setPaidAt(p.getPaidAt());
        po.setPaymentId(p.getPaymentId());
        po.setPaymentMethod(p.getPaymentMethod().toString());
        po.setReserveId(p.getReserveId());
        po.setStatus(p.getStatus().toString());

        return ResponseEntity.ok(po);
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
        Payment payment = new Payment();
        if (dto.getReserveId() == null || dto.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        if (repo.existsByReserveId(dto.getReserveId())) {
            throw new DuplicatePaymentForReserveException(dto.getReserveId());
        }

        if (dto.getUserName() == null) {
            JsonNode userJson = userClient.getUserById(dto.getUserId());
            String userName = (userJson != null && userJson.has("name"))
                    ? userJson.get("name").asText()
                    : "Unknown";
            if (userName.equals("Unknown") || userName.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .header("Error-Message", "User not found").build();
            }
            payment.setUsername(userName);
        } else {
            payment.setUsername(dto.getUserName());
        }
        if (dto.getGrandTotal() instanceof BigDecimal) {
            payment.setGrandTotal(dto.getGrandTotal());
        } else {
            BigDecimal amount = BigDecimal.valueOf(reserveClient.getReserveByReserveId(dto.getReserveId()).getPrice());
            payment.setGrandTotal(amount);
        }
        final PaymentMethod method;
        try {
            method = PaymentMethod.valueOf(dto.getPaymentMethod().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        payment.setReserveId(dto.getReserveId());
        payment.setUserId(dto.getUserId());
        payment.setStatus(PaymentStatus.PENDING);
        payment.setPaymentMethod(method);
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