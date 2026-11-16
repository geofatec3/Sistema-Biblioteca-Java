// EmprestimosRepository.java
package repositories;

import model.Emprestimos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EmprestimosRepository extends JpaRepository<Emprestimos, Long> {
    List<Emprestimos> findByClienteId(Long clienteId);
    List<Emprestimos> findByStatusIgnoreCase(String status);
    long countByClienteIdAndDataDevolucaoIsNull(Long clienteId);
}