// LivrosRepository.java
package repositories;

import model.Livros;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LivrosRepository extends JpaRepository<Livros, Long> {
    Optional<Livros> findByIsbn(String isbn);
    List<Livros> findByTituloContainingIgnoreCase(String titulo);
    List<Livros> findByCategoriaIgnoreCase(String categoria);
    List<Livros> findByQuantidadeGreaterThan(Integer quantidade);
}