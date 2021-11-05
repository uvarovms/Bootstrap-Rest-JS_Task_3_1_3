package web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping(value = "/login")
    public String LoginPage() { return "login"; }

    @GetMapping(value = "/admin/page")
    public String getAdminPage() {
        return "admin_panel";
    }

    @GetMapping(value = "/user/page")
    public String getUserPage() {
        return "user_page";
    }
}