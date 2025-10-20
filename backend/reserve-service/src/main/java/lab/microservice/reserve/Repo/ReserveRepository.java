package lab.microservice.reserve.Repo;

import lab.microservice.reserve.entity.Reserve;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReserveRepository extends JpaRepository<Reserve, Long> {
    boolean existsByCarId(Long carId);
    void deleteByCarId(Long carId);
    List<Reserve> findByCarId(Long carId);
    List<Reserve> findByUserId(Long userId);
}