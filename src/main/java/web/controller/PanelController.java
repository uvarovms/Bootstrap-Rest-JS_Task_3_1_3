package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.servise.RoleService;
import web.servise.UserService;
import java.security.Principal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@RestController
public class PanelController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public PanelController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping(value = "/admin/roles")
    public ResponseEntity<Iterable<Role>> getAllRoles() {
        return new ResponseEntity<>(roleService.getAllRoles(), HttpStatus.OK);
    }

    @GetMapping("admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping(value = "/user/user")
    public ResponseEntity<User> getAuthenticationUser(Principal principal) {
        return new ResponseEntity<>(userService.getUserByLogin(principal.getName()), HttpStatus.OK);
    }

    @GetMapping(value = "/admin/user")
    public ResponseEntity<User> getAuthenticationAdmin(Principal principal) {
        return new ResponseEntity<>(userService.getUserByLogin(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/admin/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        return new ResponseEntity<>(userService.getUser(id), HttpStatus.OK);
    }

    @PostMapping("/admin/add")
    public ResponseEntity<User> postMapAddNewUser(@RequestBody User user) {
        Set<Role> roleSet = new LinkedHashSet<>();
        user.getRoles().forEach(role -> roleSet.add(roleService.findRole(role)));
        user.setRoles(roleSet);
        userService.addUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<User> putMapUpdateUser(@RequestBody User user) {
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            Set<Role> roleSetForUpdateUser = new LinkedHashSet<>();
            user.getRoles().forEach(role -> roleSetForUpdateUser.add(roleService.findRole(role)));
            user.setRoles(roleSetForUpdateUser);
        } else {
            user.setRoles(userService.getUser(user.getId()).getRoles());
        }
        userService.updateUser(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
