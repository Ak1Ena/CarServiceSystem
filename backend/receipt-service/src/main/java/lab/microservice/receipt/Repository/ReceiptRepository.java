package lab.microservice.receipt.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import lab.microservice.receipt.Entity.Receipt;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    List<Receipt> findByuserId(Long userId);
    Optional<Receipt> findByReserveId(Long reserveId);
    boolean existsByReserveId(Long reserveId);
    List<Receipt> findByStatus(Receipt.PaymentStatus status);
    Receipt findByReceiptId(Long receiptId);
}
