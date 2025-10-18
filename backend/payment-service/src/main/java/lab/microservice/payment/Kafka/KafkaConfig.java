package lab.microservice.payment.Kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {
    @Value("${app.kafka.topic:payment}")
    private String paymentTopic;

    @Bean
    public NewTopic paymentTopic() {
        return new NewTopic(paymentTopic, 1, (short) 1);
    }
    
}
