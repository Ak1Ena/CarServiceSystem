package lab.microservice.receipt.Kafka;

import java.util.List;
import java.util.Optional;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lab.microservice.receipt.Dtos.ReceiptEventDto;
import lab.microservice.receipt.Entity.Receipt;
import lab.microservice.receipt.Entity.Receipt.PaymentStatus;
import lab.microservice.receipt.Repository.ReceiptRepository;

@Component
public class ReceiptListener {
	private static final Logger log = LoggerFactory.getLogger(ReceiptListener.class);

	private final ReceiptRepository receiptRepository;
	private final KafkaTemplate<String, String> kafka;
	@Value("${app.kafka.topic}")
	private String topic;
	
	public ReceiptListener(ReceiptRepository receiptRepository, KafkaTemplate<String, String> kafka) {
		this.receiptRepository = receiptRepository;
		this.kafka = kafka;
	}

	@KafkaListener(topics = "user", groupId = "receipt-service-group")
    public void userDeleted(ConsumerRecord<String, String> record)
        throws JsonProcessingException {
    log.info("Received: {}", record.value());

    ObjectMapper mapper = new ObjectMapper();
    JsonNode node = mapper.readTree(record.value());

    if ("user-deleted".equalsIgnoreCase(node.get("event").asText())) {
        Long userId = node.get("userId").asLong();

        List<Receipt> receipts = receiptRepository.findByuserId(userId);
        receiptRepository.deleteAll(receipts);
        log.info("Deleted all receipts of userId: {}", userId);

        for (Receipt receipt : receipts) {
            ReceiptEventDto receiptEventDto = new ReceiptEventDto();
            receiptEventDto.setPaymentId(receipt.getPaymentId());
            receiptEventDto.setEvent("receipt-updated");

            String json = mapper.writeValueAsString(receiptEventDto);
            kafka.send("receipt", json);

            log.info("Sent receipt-deleted event for receiptId={}", receipt.getReceiptId());
        }
    }
}


	@KafkaListener(topics = "payment", groupId = "receipt-service-group")
public void paymentStatusUpdated(ConsumerRecord<String, String> record) throws JsonProcessingException {
    log.info("Received: {}", record.value());
    ObjectMapper mapper = new ObjectMapper().findAndRegisterModules();

    JsonNode node = mapper.readTree(record.value());
    String eventType = node.path("event").asText("").trim();

    if ("payment-status-updated".equalsIgnoreCase(eventType)) {
        long reserveId = node.path("reserveId").asLong(0L);
        String status   = node.path("status").asText("").toUpperCase();
        String method   = node.path("paymentMethod").asText(null);
        String paidAt = node.path("paidAt").asText(null);

        try {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status);

            Optional<Receipt> receiptOp = receiptRepository.findByReserveId(reserveId); // หรือ findById(receiptId)
            if (receiptOp == null) {
                log.warn("reserveId with ID {} not found", reserveId);
                return;
            }
            Receipt receipt = receiptOp.get();

            receipt.setStatus(paymentStatus);
            if (paymentStatus == PaymentStatus.PAID) {
                if (method != null) receipt.setPaymentMethod(method);
                if (paidAt != null)  receipt.setIssueAt(paidAt); 
                log.info("Payment completed for receiptId {}", receipt.getReceiptId());
            } else {
                log.info("Payment status updated to {} for receiptId {}", status, receipt.getReceiptId());
            }

            receiptRepository.save(receipt);

        } catch (IllegalArgumentException e) {
            log.error("Invalid payment status: {}", status);
        }

    } else if ("payment-deleted".equalsIgnoreCase(eventType)) {
        long receiptId = node.path("receiptId").asLong(0L);
        if (receiptId <= 0) { log.warn("invalid receiptId in delete event: {}", node); return; }

        Receipt receipt = receiptRepository.findByReceiptId(receiptId);
        if (receipt != null) {
            receiptRepository.delete(receipt);
            log.info("Deleted receipt for receiptId {}", receiptId);
        } else {
            log.warn("Receipt not found for deletion: {}", receiptId);
        }
    } else {
        log.info("Invalid event: '{}'", eventType);
    }
}


}



