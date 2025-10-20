package lab.microservice.payment.Kafka;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lab.microservice.payment.Dtos.PaymentDto;
import lab.microservice.payment.Entity.Payment;
import lab.microservice.payment.Entity.PaymentMethod;
import lab.microservice.payment.Entity.PaymentStatus;
import lab.microservice.payment.Repository.PaymentRepository;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class PaymentListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentListener.class);

    private final PaymentRepository paymentRepository;

    @Value("${app.kafka.topic}")
    private String topic;

    public PaymentListener(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

	@KafkaListener(topics = "receipt", groupId = "payment-service-group") 
	public void receiptEvent(ConsumerRecord<String, String> record)throws JsonMappingException, JsonProcessingException {
		log.info("Received: {}", record.value());
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = mapper.readTree(record.value());
		if ("receipt-updated".equalsIgnoreCase(node.get("event").asText())) {
			Long receiptId = node.get("receiptId").asLong();
			Payment payment = paymentRepository.findByPaymentId(receiptId);
			paymentRepository.delete(payment);
			log.info("Delete all payments of receiptId " + receiptId + " complete.");
		}
	}
}
