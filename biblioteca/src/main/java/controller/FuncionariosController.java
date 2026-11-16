// FuncionariosController.java
package controller;

import jakarta.validation.Valid;
import model.Funcionarios;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.FuncionarioService;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionariosController {

    private final FuncionarioService funcionariosService;

    public FuncionariosController(FuncionarioService funcionariosService) {
        this.funcionariosService = funcionariosService;
    }

    @GetMapping
    public ResponseEntity<List<Funcionarios>> listar() {
        return ResponseEntity.ok(funcionariosService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionarios> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(funcionariosService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Funcionarios> criar(@RequestBody @Valid Funcionarios funcionario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionariosService.salvar(funcionario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionarios> atualizar(@PathVariable Long id, @RequestBody @Valid Funcionarios funcionario) {
        return ResponseEntity.ok(funcionariosService.atualizar(id, funcionario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        funcionariosService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}