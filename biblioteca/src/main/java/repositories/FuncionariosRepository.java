// FuncionariosRepository.java
package repositories;

import model.Funcionarios;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FuncionariosRepository extends JpaRepository<Funcionarios, Long> {
    Optional<Funcionarios> findByEmail(String email);
    boolean existsByEmail(String email);
}