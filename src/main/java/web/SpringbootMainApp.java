package web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import web.model.Role;
import web.model.User;
import web.servise.RoleService;
import web.servise.UserService;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

@SpringBootApplication
public class SpringbootMainApp {

    static UserService userService;
    static RoleService roleService;

    @Autowired
    public SpringbootMainApp(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringbootMainApp.class, args);

        User user1 = new User();
        user1.setName("Anton");
        user1.setLastName("Tikhonov");
        user1.setAge((byte) 25);
        user1.setEmail("1@mail.ru");
        user1.setPassword("111");

        User user2 = new User();
        user2.setName("Sergey");
        user2.setLastName("Lyubov");
        user2.setAge((byte) 35);
        user2.setEmail("2@mail.ru");
        user2.setPassword("222");

        Role role1 = new Role();
        role1.setName("ROLE_USER");
        Role role2 = new Role();
        role2.setName("ROLE_ADMIN");
        Set<Role> setRoles = new LinkedHashSet<>();
        setRoles.add(role1);
        setRoles.add(role2);
        roleService.addRole(setRoles);

        user1.setRoles(setRoles);
        user2.setRoles(setRoles.stream().limit(1).collect(Collectors.toSet()));

        userService.addUser(user1);
        userService.addUser(user2);
    }
}
