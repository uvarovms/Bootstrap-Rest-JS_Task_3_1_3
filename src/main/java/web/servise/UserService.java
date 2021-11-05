package web.servise;

import web.model.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    void addUser(User user);
    User getUserByLogin(String email);
    void deleteUserById(Long id);
    void updateUser(User user);
    User getUser(Long id);
}
