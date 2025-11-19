package com.testia.domain.port;

import com.testia.domain.model.User;
import java.util.*;

public interface UserRepositoryPort {

    // CRUD básico
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(UUID id);
    void update(User user);

    // ---------------------------------------------------
    //     NUEVOS MÉTODOS ENTERPRISE (Dashboard)
    // ---------------------------------------------------

    /**
     * Carga todos los usuarios cuyos emails estén en la lista.
     * Es 1 query -> evita N+1
     */
    List<User> findAllByEmails(Set<String> emails);

    /**
     * Devuelve un MAP para lookup ultra rápido en DashboardAggregationService
     * email → User
     */
    default Map<String, User> findAllByEmailMap(Set<String> emails) {
        Map<String, User> map = new HashMap<>();
        for (User u : findAllByEmails(emails)) {
            map.put(u.getEmail(), u);
        }
        return map;
    }
}
