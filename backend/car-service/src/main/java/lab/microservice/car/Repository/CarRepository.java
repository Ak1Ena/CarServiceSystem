package lab.microservice.car.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lab.microservice.car.Dtos.CarDto;
import lab.microservice.car.entity.Car;

public interface CarRepository extends JpaRepository<Car, Long>{
  List<Car> findByUserId(Long userId);
  List<Car> findByModel(String model);
  List<Car> findByPlateNumber(String plateNumber);
}
