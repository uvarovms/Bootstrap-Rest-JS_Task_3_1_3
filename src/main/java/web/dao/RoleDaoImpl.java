package web.dao;

import org.springframework.stereotype.Repository;
import web.model.Role;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Set;

@Repository
public class RoleDaoImpl implements RoleDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void addRole(Set<Role> roles) {
        for (Role rol : roles) {
            em.persist(rol);
        }
    }

    public Role findRole(Role role) {
        return em.createQuery("SELECT r FROM Role r WHERE r.name=:name", Role.class)
                .setParameter("name", role.getName())
                .getSingleResult();
    }

    @Override
    public List<Role> getAllRoles() {
        return em.createQuery("SELECT r FROM Role r").getResultList();
    }
}

