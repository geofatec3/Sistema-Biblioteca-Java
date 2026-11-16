// EmprestimoResponseDTO.java
package dto;

import model.Emprestimos;
import java.time.LocalDate;

public record EmprestimoRespDto(
        Long id,
        String livroTitulo,
        String clienteNome,
        String funcionarioNome,
        LocalDate dataEmprestimo,
        LocalDate dataPrevistaDevolucao,
        LocalDate dataDevolucao,
        String status
) {
    public EmprestimoRespDto(Emprestimos emp) {
        this(
                emp.getId(),
                emp.getLivro().getTitulo(),
                emp.getCliente().getNome(),
                emp.getFuncionario().getNome(),
                emp.getDataEmprestimo(),
                emp.getDataPrevistaDevolucao(),
                emp.getDataDevolucao(),
                emp.getStatus()
        );
    }
}