// LivrosService.java
package services;

import model.Livros;
import org.springframework.stereotype.Service;
import repositories.LivrosRepository;
import java.util.List;

@Service
public class LivrosService {

    private final LivrosRepository livrosRepository;

    public LivrosService(LivrosRepository livrosRepository) {
        this.livrosRepository = livrosRepository;
    }

    public List<Livros> listarTodos() {
        return livrosRepository.findAll();
    }

    public Livros buscarPorId(Long id) {
        return livrosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + id));
    }

    public Livros salvar(Livros livro) {
        if (livro.getIsbn() != null && livrosRepository.findByIsbn(livro.getIsbn()).isPresent()) {
            throw new IllegalStateException("Já existe um livro cadastrado com este ISBN.");
        }
        return livrosRepository.save(livro);
    }

    public Livros atualizar(Long id, Livros dadosAtualizados) {
        Livros livro = buscarPorId(id);
        livro.setTitulo(dadosAtualizados.getTitulo());
        livro.setIsbn(dadosAtualizados.getIsbn());
        livro.setAutor(dadosAtualizados.getAutor());
        livro.setEditora(dadosAtualizados.getEditora());
        livro.setAno_publicacao(dadosAtualizados.getAno_publicacao());
        livro.setCategoria(dadosAtualizados.getCategoria());
        livro.setQuantidade(dadosAtualizados.getQuantidade());
        return livrosRepository.save(livro);
    }

    public void deletar(Long id) {
        Livros livro = buscarPorId(id);
        livrosRepository.delete(livro);
    }
}