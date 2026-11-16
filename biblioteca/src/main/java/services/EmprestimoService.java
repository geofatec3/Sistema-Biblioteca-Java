// EmprestimosService.java
package services;

import dto.EmprestimoReqDto;
import dto.EmprestimoRespDto;
import jakarta.transaction.Transactional;
import model.Clientes;
import model.Emprestimos;
import model.Funcionarios;
import model.Livros;
import org.springframework.stereotype.Service;
import repositories.ClientesRepository;
import repositories.EmprestimosRepository;
import repositories.FuncionariosRepository;
import repositories.LivrosRepository;
import java.time.LocalDate;
import java.util.List;

@Service
public class EmprestimoService {

    private final EmprestimosRepository emprestimosRepository;
    private final LivrosRepository livrosRepository;
    private final ClientesRepository clientesRepository;
    private final FuncionariosRepository funcionariosRepository;

    public EmprestimoService(EmprestimosRepository emprestimosRepository,
                              LivrosRepository livrosRepository,
                              ClientesRepository clientesRepository,
                              FuncionariosRepository funcionariosRepository) {
        this.emprestimosRepository = emprestimosRepository;
        this.livrosRepository = livrosRepository;
        this.clientesRepository = clientesRepository;
        this.funcionariosRepository = funcionariosRepository;
    }

    public List<EmprestimoRespDto> listarTodos() {
        return emprestimosRepository.findAll()
                .stream()
                .map(EmprestimoRespDto::new)
                .toList();
    }

    @Transactional
    public EmprestimoRespDto realizarEmprestimo(EmprestimoReqDto dto) {
        Livros livro = livrosRepository.findById(dto.livroId())
                .orElseThrow(() -> new RuntimeException("Livro não encontrado."));

        if (livro.getQuantidade() <= 0) {
            throw new IllegalStateException("Não há exemplares disponíveis deste livro no estoque.");
        }

        Clientes cliente = clientesRepository.findById(dto.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        if (emprestimosRepository.countByClienteIdAndDataDevolucaoIsNull(cliente.getId()) >= 3) {
            throw new IllegalStateException("O cliente já atingiu o limite máximo de 3 empréstimos ativos.");
        }

        Funcionarios funcionario = funcionariosRepository.findById(dto.funcionarioId())
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado."));

        // Baixa no estoque
        livro.setQuantidade(livro.getQuantidade() - 1);
        livrosRepository.save(livro);

        Emprestimos emprestimo = new Emprestimos();
        emprestimo.setLivro(livro);
        emprestimo.setCliente(cliente);
        emprestimo.setFuncionario(funcionario);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDataPrevistaDevolucao(
                dto.dataPrevistaDevolucao() != null ? dto.dataPrevistaDevolucao() : LocalDate.now().plusDays(14)
        );
        emprestimo.setStatus("ATIVO");

        Emprestimos salvo = emprestimosRepository.save(emprestimo);
        return new EmprestimoRespDto(salvo);
    }

    @Transactional
    public EmprestimoRespDto registrarDevolucao(Long emprestimoId) {
        Emprestimos emprestimo = emprestimosRepository.findById(emprestimoId)
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado."));

        if (emprestimo.getDataDevolucao() != null) {
            throw new IllegalStateException("Este empréstimo já foi finalizado anteriormente.");
        }

        LocalDate hoje = LocalDate.now();
        emprestimo.setDataDevolucao(hoje);
        emprestimo.setStatus(hoje.isAfter(emprestimo.getDataPrevistaDevolucao()) ? "ATRASADO" : "DEVOLVIDO");

        // Devolve exemplar ao estoque
        Livros livro = emprestimo.getLivro();
        livro.setQuantidade(livro.getQuantidade() + 1);
        livrosRepository.save(livro);

        Emprestimos atualizado = emprestimosRepository.save(emprestimo);
        return new EmprestimoRespDto(atualizado);
    }
}