import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NavController } from "@ionic/angular";
import { AuthenticateService } from "../services/authenticate.service";
import { Storage } from "@ionic/storage";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  loginForm: FormGroup;
  responseAuthenticateUser: any = {};
  messageAuthenticated: string;
  validationMessages = {
    email: [
      { type: "required", message: "El email es requerido." },
      { type: "pattern", message: "El email no es válido." },
    ],
    password: [
      { type: "required", message: "La contraseña es requerida." },
      {
        type: "minlength",
        message: "La contraseña debe tener un minino de 5 caracteres.",
      },
    ],
  };
  constructor(
    private formBuilder: FormBuilder,
    private authenticateUser: AuthenticateService,
    private navController: NavController,
    private storage: Storage
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }
  async loginUser(credentials: any) {
    try {
      this.responseAuthenticateUser = await this.authenticateUser.signIn(
        credentials
      );
      if (this.responseAuthenticateUser.isAuthenticated) {
        this.storage.set("isAuthenticated", true);
        this.navController.navigateForward("/menu/home");

        this.storage.set("userData", this.responseAuthenticateUser.data);
      } else {
        this.messageAuthenticated = this.responseAuthenticateUser.message;
      }
    } catch (err) {
      console.log(err);
    }
  }
  goToRegister() {
    this.navController.navigateForward("/register");
  }
}
