package lab.microservice.user.feign;

import lab.microservice.user.dtos.CarDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "car-service")
public interface CarClient {
    @GetMapping("/cars/user/{userId}")  
    List<CarDto> getCarsByUserId(@PathVariable("userId") Long userId);
}
