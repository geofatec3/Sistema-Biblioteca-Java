// EmprestimosController.java
package controller;

import dto.EmprestimoReqDto;
import dto.EmprestimoRespDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import services.EmprestimoService;
import java.util.List;

@RestController
@RequestMapping("/api/emprestimos")
public class EmprestimosController {

    private final EmprestimoService emprestimosService;

    public EmprestimosController(EmprestimoService emprestimosService) {
        this.emprestimosService = emprestimosService;
    }

    @GetMapping
    public ResponseEntity<List<EmprestimoRespDto>> listar() {
        return ResponseEntity.ok(emprestimosService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<EmprestimoRespDto> realizarEmprestimo(@RequestBody @Valid EmprestimoReqDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(emprestimosService.realizarEmprestimo(dto));
    }

    @PatchMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoRespDto> registrarDevolucao(@PathVariable Long id) {
        return ResponseEntity.ok(emprestimosService.registrarDevolucao(id));
    }
}