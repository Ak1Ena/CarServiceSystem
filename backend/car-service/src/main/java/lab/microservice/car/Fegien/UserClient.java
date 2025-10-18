package lab.microservice.car.Fegien;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.JsonNode;

@FeignClient(name = "user-service")
@LoadBalancerClient(name = "user-service", configuration = LoadBalancer.class)
@EnableDiscoveryClient
public interface UserClient {
    @GetMapping("/users/{id}")
    JsonNode getUserById(@PathVariable Long id);
}
