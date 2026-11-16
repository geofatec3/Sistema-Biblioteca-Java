// LivrosController.java
package controller;

import jakarta.validation.Valid;
import model.Livros;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.LivrosService;
import java.util.List;

@RestController
@RequestMapping("/api/livros")
public class LivrosController {

    private final LivrosService livrosService;

    public LivrosController(LivrosService livrosService) {
        this.livrosService = livrosService;
    }

    @GetMapping
    public ResponseEntity<List<Livros>> listar() {
        return ResponseEntity.ok(livrosService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livros> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(livrosService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Livros> criar(@RequestBody @Valid Livros livro) {
        return ResponseEntity.status(HttpStatus.CREATED).body(livrosService.salvar(livro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livros> atualizar(@PathVariable Long id, @RequestBody @Valid Livros livro) {
        return ResponseEntity.ok(livrosService.atualizar(id, livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        livrosService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}