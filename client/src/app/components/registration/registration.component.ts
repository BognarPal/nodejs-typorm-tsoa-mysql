import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services';
import { RegistrationModel } from '@serverModels/registration.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegistrationComponent implements OnInit {

  formdata = new RegistrationModel();
  loading = false;
  error = '';

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.error = '';
    if (this.formdata.name && this.formdata.email && this.formdata.password && this.formdata.passwordAgain) {
      const passwordCheck = this.formdata.isPassowrdOk();
      if (!passwordCheck.ok) {
        this.error = passwordCheck.error;
        return;
      }
      this.loading = true;
      this.authenticationService.registration(this.formdata)
        .subscribe(
          data => {
            this.router.navigateByUrl('/');
          },
          err => {
            this.error = err.error.message;
            this.loading = false;
          }
        );
    }
  }

}
