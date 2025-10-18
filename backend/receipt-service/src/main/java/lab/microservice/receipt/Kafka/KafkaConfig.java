package lab.microservice.receipt.Kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;

@EnableKafka
@Configuration
public class KafkaConfig {

    @Value("${app.kafka.topic:receipt}")
    private String topic;

    @Bean
    public NewTopic receiptTopic() {
        return new NewTopic(topic, 1, (short) 1);
    }

    
}
