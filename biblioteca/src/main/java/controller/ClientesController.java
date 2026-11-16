// ClientesController.java
package controller;

import jakarta.validation.Valid;
import model.Clientes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.ClienteService;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClientesController {

    private final ClienteService clientesService;

    public ClientesController(ClienteService clientesService) {
        this.clientesService = clientesService;
    }

    @GetMapping
    public ResponseEntity<List<Clientes>> listar() {
        return ResponseEntity.ok(clientesService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Clientes> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(clientesService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Clientes> criar(@RequestBody @Valid Clientes cliente) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientesService.salvar(cliente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Clientes> atualizar(@PathVariable Long id, @RequestBody @Valid Clientes cliente) {
        return ResponseEntity.ok(clientesService.atualizar(id, cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        clientesService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}