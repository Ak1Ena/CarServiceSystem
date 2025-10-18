// package lab.microservice.car.Kafka;

// import java.util.HashMap;
// import java.util.Map;

// import org.apache.kafka.clients.producer.ProducerConfig;
// import org.apache.kafka.common.serialization.StringSerializer;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.kafka.annotation.EnableKafka;
// import org.springframework.kafka.core.DefaultKafkaProducerFactory;
// import org.springframework.kafka.core.KafkaTemplate;
// import org.springframework.kafka.core.ProducerFactory;

// @Configuration
// @EnableKafka
// public class KafkaConfig {
//     @Value("${KAFKA_BOOTSTRAP_SERVERS:kafka:9092}")
//     private String bootstrapServers;

//     @Bean
//     public ProducerFactory<String, String> carProducerFactory() {
//         Map<String, Object> configProps = new HashMap<>();
//         configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
//         configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//         configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
//         return new DefaultKafkaProducerFactory<>(configProps);
//     }

//     @Bean
//     public KafkaTemplate<String, String> carKafkaTemplate() {
//         return new KafkaTemplate<>(carProducerFactory());
//     }
// }
