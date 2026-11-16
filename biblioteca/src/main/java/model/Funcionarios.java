package model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "funcionarios", schema = "public")
public class Funcionarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String nome;

    @Size(max = 150)
    @Column(unique = true, length = 150)
    private String email;

    @Size(max = 20)
    @Column(length = 20)
    private String telefone;

    @NotBlank(message = "O cargo é obrigatório.")
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String cargo;

    @Column(name = "data_contratacao")
    private LocalDate dataContratacao;

    public Funcionarios() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public LocalDate getDataContratacao() {
        return dataContratacao;
    }

    public void setDataContratacao(LocalDate dataContratacao) {
        this.dataContratacao = dataContratacao;
    }
}