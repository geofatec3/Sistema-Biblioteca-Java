// EmprestimoRequestDTO.java
package dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record EmprestimoReqDto(
        @NotNull(message = "O ID do livro é obrigatório.") Long livroId,
        @NotNull(message = "O ID do cliente é obrigatório.") Long clienteId,
        @NotNull(message = "O ID do funcionário é obrigatório.") Long funcionarioId,
        LocalDate dataPrevistaDevolucao // Opcional: se nulo, assume +14 dias
) {}