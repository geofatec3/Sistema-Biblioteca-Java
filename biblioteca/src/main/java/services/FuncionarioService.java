// FuncionariosService.java
package services;

import model.Funcionarios;
import org.springframework.stereotype.Service;
import repositories.FuncionariosRepository;
import java.util.List;

@Service
public class FuncionarioService {

    private final FuncionariosRepository funcionariosRepository;

    public FuncionarioService(FuncionariosRepository funcionariosRepository) {
        this.funcionariosRepository = funcionariosRepository;
    }

    public List<Funcionarios> listarTodos() {
        return funcionariosRepository.findAll();
    }

    public Funcionarios buscarPorId(Long id) {
        return funcionariosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado com ID: " + id));
    }

    public Funcionarios salvar(Funcionarios funcionario) {
        if (funcionario.getEmail() != null && funcionariosRepository.existsByEmail(funcionario.getEmail())) {
            throw new IllegalStateException("E-mail já cadastrado para outro funcionário.");
        }
        return funcionariosRepository.save(funcionario);
    }

    public Funcionarios atualizar(Long id, Funcionarios dadosAtualizados) {
        Funcionarios funcionario = buscarPorId(id);
        funcionario.setNome(dadosAtualizados.getNome());
        funcionario.setEmail(dadosAtualizados.getEmail());
        funcionario.setTelefone(dadosAtualizados.getTelefone());
        funcionario.setCargo(dadosAtualizados.getCargo());
        funcionario.setDataContratacao(dadosAtualizados.getDataContratacao());
        return funcionariosRepository.save(funcionario);
    }

    public void deletar(Long id) {
        Funcionarios funcionario = buscarPorId(id);
        funcionariosRepository.delete(funcionario);
    }
}