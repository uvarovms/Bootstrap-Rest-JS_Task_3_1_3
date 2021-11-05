package web.dao;

import org.springframework.stereotype.Repository;
import web.model.User;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void addUser(User user) {
        em.persist(user);
    }

    @Override
    public User getUser(Long id) {
        return em.find(User.class, id);
    }

    @Override
    public User getUserByLogin(String email) {
        return em.createQuery("select u from User u where u.email=:mail", User.class)
                .setParameter("mail", email)
                .getSingleResult();
    }

    @Override
    public List<User> getAllUsers() {
        return em.createQuery("select u from User u").getResultList();
    }

    @Override
    public void deleteUserById(Long id) {
        em.remove(getUser(id));
    }

    @Override
    public void updateUser(User user) {
        em.merge(user);
    }
}
