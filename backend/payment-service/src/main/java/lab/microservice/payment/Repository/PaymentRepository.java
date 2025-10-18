package lab.microservice.payment.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import lab.microservice.payment.Entity.Payment;
import lab.microservice.payment.Entity.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(PaymentStatus status);
    boolean existsByReceiptId(Long receiptId);
    List<Payment> findByuserId(Long userId);
    List<Payment> findByreceiptId(Long receiptId);

}
