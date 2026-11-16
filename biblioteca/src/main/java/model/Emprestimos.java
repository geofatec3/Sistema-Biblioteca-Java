package model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "emprestimos", schema = "public")
public class Emprestimos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "O livro é obrigatório.")
    @ManyToOne
    @JoinColumn(name = "livro_id")
    private Livros livro;

    @NotNull(message = "O cliente é obrigatório.")
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Clientes cliente;

    @NotNull(message = "O funcionário é obrigatório.")
    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionarios funcionario;

    @NotNull(message = "A data do empréstimo é obrigatória.")
    @Column(name = "data_emprestimo", nullable = false)
    private LocalDate dataEmprestimo;

    @NotNull(message = "A data prevista de devolução é obrigatória.")
    @Column(name = "data_prevista_devolucao", nullable = false)
    private LocalDate dataPrevistaDevolucao;

    @Column(name = "data_devolucao")
    private LocalDate dataDevolucao;

    @NotBlank(message = "O status é obrigatório.")
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String status;

    public Emprestimos() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Livros getLivro() {
        return livro;
    }

    public void setLivro(Livros livro) {
        this.livro = livro;
    }

    public Clientes getCliente() {
        return cliente;
    }

    public void setCliente(Clientes cliente) {
        this.cliente = cliente;
    }

    public Funcionarios getFuncionario() {
        return funcionario;
    }

    public void setFuncionario(Funcionarios funcionario) {
        this.funcionario = funcionario;
    }

    public LocalDate getDataEmprestimo() {
        return dataEmprestimo;
    }

    public void setDataEmprestimo(LocalDate dataEmprestimo) {
        this.dataEmprestimo = dataEmprestimo;
    }

    public LocalDate getDataPrevistaDevolucao() {
        return dataPrevistaDevolucao;
    }

    public void setDataPrevistaDevolucao(LocalDate dataPrevistaDevolucao) {
        this.dataPrevistaDevolucao = dataPrevistaDevolucao;
    }

    public LocalDate getDataDevolucao() {
        return dataDevolucao;
    }

    public void setDataDevolucao(LocalDate dataDevolucao) {
        this.dataDevolucao = dataDevolucao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}