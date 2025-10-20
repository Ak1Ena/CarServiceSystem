/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package lab.microservice.receipt.Controller;

import java.math.BigDecimal;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
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

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lab.microservice.receipt.Dtos.CarDto;
import lab.microservice.receipt.Dtos.PaymentDto;
import lab.microservice.receipt.Dtos.ReceiptDto;
import lab.microservice.receipt.Dtos.ReceiptEventDto;
import lab.microservice.receipt.Dtos.ReceiptItemDto;
import lab.microservice.receipt.Dtos.ReserveDto;
import lab.microservice.receipt.Dtos.UserDto;
import lab.microservice.receipt.Entity.Receipt;
import lab.microservice.receipt.Entity.Receipt.PaymentStatus;
import lab.microservice.receipt.Entity.ReceiptItem;
import lab.microservice.receipt.FeignClient.CarFeignClient;
import lab.microservice.receipt.FeignClient.PaymentClient;
import lab.microservice.receipt.FeignClient.ReserveClient;
import lab.microservice.receipt.FeignClient.UserFeignClient;
import lab.microservice.receipt.Repository.ReceiptRepository;

@RestController
@RequestMapping("/receipts")
public class ReceiptController {

    private static final BigDecimal VAT_RATE = new BigDecimal("0.07");

    private ReceiptRepository repo;
    private final KafkaTemplate<String, String> kafka;
    private final UserFeignClient userClient;
    private final PaymentClient paymentClient;
    private final CarFeignClient carClient;
    private final ReserveClient reserveClient;
    @Value("${app.kafka.topic}")
    private String topic;
    ObjectMapper mapper = new ObjectMapper();

    public ReceiptController(ReceiptRepository repo, KafkaTemplate<String, String> kafka,UserFeignClient userClient, PaymentClient paymentClient, CarFeignClient carClient, ReserveClient reserveClient) {
        this.repo = repo;
        this.kafka = kafka;
        this.userClient = userClient;
        this.paymentClient = paymentClient;
        this.carClient = carClient;
        this.reserveClient = reserveClient;
    }
    @GetMapping("/payment/{receiptId}")
    public ResponseEntity<JsonNode> getPaymentByReceipt(@PathVariable Long id){
        Receipt receipt = repo.getById(id);
        JsonNode payment = paymentClient.getPaymentByPaymentId(id);
        return ResponseEntity.ok(payment);
    }

    // @GetMapping("/details/{receiptId}")
    // public ResponseEntity<List<Map<String,Object>>> getReceiptWithDetails(@PathVariable Long receiptid){
    //     Map<String,Object> res = new HashMap<>();
    //     List result = new ArrayList<>();
    //     Optional<Receipt>opt = repo.findById(receiptid);
    //     if (!opt.isPresent()) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     Receipt receipt = opt.get();
    //     res.put(receipt, receipt)
        

    //     return ResponseEntity.ok(result);
    // }

     @GetMapping
    public ResponseEntity<List<Receipt>> getAllReceipts() {
        List<Receipt> receipts = repo.findAll();
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReceiptDto> getReceiptByReceiptId(@PathVariable Long id) {
        return repo.findById(id)
                   .map(this::toDto)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reserve/{reserveId}")
    public ResponseEntity<ReceiptDto> getByReserve(@PathVariable Long reserveId) {
        return repo.findByReserveId(reserveId)
                   .map(this::toDto)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

   @GetMapping("user/{userId}")
    public ResponseEntity<List<Map<String,Object>>> getByUserId(@PathVariable Long userId) {
        try {
            List<Map<String,Object>> result = new ArrayList<>();

            List<Receipt> receipts = repo.findByuserId(userId);
            UserDto customer = userClient.getUserById(userId);

            for (Receipt receipt : receipts) {
                ReserveDto reserve = reserveClient.getReserveByReserveId(receipt.getReserveId());
                UserDto owner = userClient.getUserById(reserve.getUserId());
                CarDto car = carClient.getCarByCarId(reserve.getCarId());
                PaymentDto payment = paymentClient.getPaymentByReserveId(reserve.getId());

                Map<String,Object> res = new HashMap<>();
                res.put("owner", owner.getName());
                res.put("user", customer.getName());
                res.put("car", car);
                res.put("payment", payment);
                res.put("receipt", receipt);
                res.put("reserve", reserve);

                result.add(res);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
}


    @GetMapping("/status/{status}")
    public List<ReceiptDto> getByStatus(@PathVariable String status) {
        PaymentStatus ps = parseStatus(status);
        return repo.findByStatus(ps)
                   .stream().map(this::toDto).collect(Collectors.toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ReceiptDto> create(@RequestBody ReceiptDto req) {
        if (req.getUserId() == null || req.getReserveId() == null || req.getItems() == null) {
            return ResponseEntity.badRequest().build();
        }
        if (repo.existsByReserveId(req.getReserveId())) {
            throw new DuplicateReceiptForReserveException(req.getReserveId());
        }

        UserDto userJson = userClient.getUserById(req.getUserId());
        String userName = (userJson != null) 
        ? userJson.getName() 
        : "Unknown";
        if (userName == "Unknown" || userName.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Receipt r = new Receipt();
        r.setUserId(req.getUserId());
        r.setUserName(userName);
        r.setReserveId(req.getReserveId());
        r.setStatus(PaymentStatus.PENDING);

        r.setItems(new ArrayList<>());
        addItemsFromDto(r, req.getItems());
        recalcTotals(r);
        r = repo.save(r);

        return ResponseEntity.created(URI.create("/receipts/" + r.getReceiptId())).body(toDto(r));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ReceiptDto> replace(@PathVariable Long id, @RequestBody ReceiptDto body) throws JsonProcessingException {
        Receipt r = repo.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        if (body.getUserId() != null) r.setUserId(body.getUserId());

        if (body.getReserveId() != null && !body.getReserveId().equals(r.getReserveId())) {
            if (repo.existsByReserveId(body.getReserveId())) {
                throw new DuplicateReceiptForReserveException(body.getReserveId());
            }
            r.setReserveId(body.getReserveId());
        }

        if (body.getStatus() != null) {
            r.setStatus(parseStatus(body.getStatus()));  
        }

        if (body.getItems() != null) {
            r.getItems().clear();
            addItemsFromDto(r, body.getItems());
        }

        recalcTotals(r);
        r = repo.save(r);
        // ReceiptEventDto event = new ReceiptEventDto();
        // event.setEvent("receipt-updated");
        // event.setReceiptId(id);
        // String json = mapper.writeValueAsString(event);
        // kafka.send("payment", json);
        return ResponseEntity.ok(toDto(r));
    }

    @PatchMapping("/{id}")
    @Transactional
    public ResponseEntity<ReceiptDto> patch(@PathVariable Long id, @RequestBody ReceiptDto patch) throws JsonProcessingException {
        Receipt r = repo.findById(id).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();

        boolean needRecalc = false;

        if (patch.getUserId() != null) r.setUserId(patch.getUserId());

        if (patch.getReserveId() != null && !patch.getReserveId().equals(r.getReserveId())) {
            if (repo.existsByReserveId(patch.getReserveId())) {
                throw new DuplicateReceiptForReserveException(patch.getReserveId());
            }
            r.setReserveId(patch.getReserveId());
        }

        if (patch.getItems() != null) {
            r.getItems().clear();
            addItemsFromDto(r, patch.getItems());
            needRecalc = true;
        }

        if (needRecalc) recalcTotals(r);
        r = repo.save(r);
        // ReceiptEventDto event = new ReceiptEventDto();
        // event.setEvent("receipt-updated");
        // event.setReceiptId(id);
        // String json = mapper.writeValueAsString(event);
        // kafka.send("payment", json);
        return ResponseEntity.ok(toDto(r));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteByReceiptId(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> deleteAllByUserId(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void addItemsFromDto(Receipt r, List<ReceiptItemDto> items) {
        if (items == null) return;
        for (ReceiptItemDto it : items) {
            ReceiptItem e = new ReceiptItem();
            e.setDescription(it.getDescription());
            e.setQuantity(it.getQuantity());
            e.setUnitPrice(it.getUnitPrice());
            e.setReceipt(r);
            r.getItems().add(e);
        }
    }

    //คำนวณยอด
    private void recalcTotals(Receipt r) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (ReceiptItem it : r.getItems()) {
            BigDecimal line = BigDecimal.valueOf(it.getUnitPrice())   
        .multiply(BigDecimal.valueOf(it.getQuantity()));
            subtotal = subtotal.add(line);
        }
        BigDecimal vat   = subtotal.multiply(VAT_RATE);
        BigDecimal grand = subtotal.add(vat);

        r.setSubtotal(subtotal);
        r.setVatAmount(vat);
        r.setGrandTotal(grand);
    }

    private ReceiptDto toDto(Receipt r) {
        ReceiptDto dto = new ReceiptDto();
        dto.setReceiptId(r.getReceiptId());
        dto.setUserId(r.getUserId());
        dto.setReserveId(r.getReserveId());
        dto.setIssueAt(r.getIssueAt());
        dto.setSubtotal(r.getSubtotal());
        dto.setVatAmount(r.getVatAmount());
        dto.setGrandTotal(r.getGrandTotal());
        dto.setStatus(r.getStatus() == null ? null : r.getStatus().name());
        try {
        UserDto userJson = userClient.getUserById(r.getUserId());
        dto.setUserName(userJson.getUsername());
    } catch (Exception e) {
        dto.setUserName("User not found");
    }

        List<ReceiptItemDto> items = new LinkedList<>();
        for (ReceiptItem e : r.getItems()) {
            ReceiptItemDto i = new ReceiptItemDto();
            i.setId(e.getId());
            i.setDescription(e.getDescription());
            i.setQuantity(e.getQuantity());
            i.setUnitPrice(e.getUnitPrice());
            items.add(i);
        }
        dto.setItems(items);
        return dto;
    }

    private PaymentStatus parseStatus(String s) {
        if (s == null || s.isBlank()) return null;
        try { return PaymentStatus.valueOf(s.trim().toUpperCase()); }
        catch (IllegalArgumentException ex) {
            throw new BadStatusException(s);
        }
    }

    // ตรวจสร้างใบเสร็จซ้ำ
    @ResponseStatus(org.springframework.http.HttpStatus.CONFLICT)
    static class DuplicateReceiptForReserveException extends RuntimeException {
        public DuplicateReceiptForReserveException(Long reserveId) {
            super("Receipt already exists for reserveId=" + reserveId);
        }
    }

    @ResponseStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
    static class BadStatusException extends RuntimeException {
        public BadStatusException(String status) {
            super("Invalid status: " + status + " (allowed: PENDING, PAID)");
        }
    }
}



