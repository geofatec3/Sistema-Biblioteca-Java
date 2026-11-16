package model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "livros", schema = "public")
public class Livros {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório.")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String titulo;

    @Size(max = 13)
    @Column(unique = true, length = 13)
    private String isbn;

    @NotBlank(message = "O autor é obrigatório.")
    @Size(max = 150)
    @Column(nullable = false, length = 150)
    private String autor;

    @Size(max = 100)
    @Column(length = 100)
    private String editora;

    private Integer ano_publicacao;

    @Size(max = 80)
    @Column(length = 80)
    private String categoria;

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 0, message = "A quantidade não pode ser negativa.")
    @Column(nullable = false)
    private Integer quantidade;

    public Livros() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getEditora() {
        return editora;
    }

    public void setEditora(String editora) {
        this.editora = editora;
    }

    public Integer getAno_publicacao() {
        return ano_publicacao;
    }

    public void setAno_publicacao(Integer ano_publicacao) {
        this.ano_publicacao = ano_publicacao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}