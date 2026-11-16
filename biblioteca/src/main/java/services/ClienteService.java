// ClientesService.java
package services;

import model.Clientes;
import org.springframework.stereotype.Service;
import repositories.ClientesRepository;
import java.util.List;

@Service
public class ClienteService {

    private final ClientesRepository clientesRepository;

    public ClienteService(ClientesRepository clientesRepository) {
        this.clientesRepository = clientesRepository;
    }

    public List<Clientes> listarTodos() {
        return clientesRepository.findAll();
    }

    public Clientes buscarPorId(Long id) {
        return clientesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado com ID: " + id));
    }

    public Clientes salvar(Clientes cliente) {
        if (cliente.getEmail() != null && clientesRepository.existsByEmail(cliente.getEmail())) {
            throw new IllegalStateException("E-mail já cadastrado para outro cliente.");
        }
        return clientesRepository.save(cliente);
    }

    public Clientes atualizar(Long id, Clientes dadosAtualizados) {
        Clientes cliente = buscarPorId(id);
        cliente.setNome(dadosAtualizados.getNome());
        cliente.setEmail(dadosAtualizados.getEmail());
        cliente.setTelefone(dadosAtualizados.getTelefone());
        return clientesRepository.save(cliente);
    }

    public void deletar(Long id) {
        Clientes cliente = buscarPorId(id);
        clientesRepository.delete(cliente);
    }
}