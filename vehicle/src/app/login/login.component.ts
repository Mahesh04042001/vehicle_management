import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[SharedserviceService,ApiService]
})
export class LoginComponent implements OnInit {

  loginForm !:FormGroup;
  logIncheck:any=0;
  loginBtnDisable:boolean=true;
  storeCredentials:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,private route:Router,private shared:SharedserviceService,public service:ServiceService,private toster:ToastarService) { }

  ngOnInit(): void {
    this.loginForm=this.formbuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
    this.loginBtnDisable=true;
  }

  //Login check function

  login(formValue:any){
    this.loginBtnDisable=false;
    this.api.getlogindata(formValue.username,formValue.password).subscribe(res=>{
      this.shared.allIdObj=res;
      console.log(this.shared.allIdObj);
      this.shared.allIdObj=this.shared.allIdObj.data.docs[0];
      this.storeCredentials=this.shared.allIdObj;
      setTimeout(()=>{
        if(this.shared.allIdObj!=undefined && this.storeCredentials!=null){
          this.toster.showSuccess("Success","Logged in successfully!");
          localStorage.setItem("currentUser",JSON.stringify(this.storeCredentials));
          this.loginForm.reset();
          this.service.showTag=false;
          this.route.navigate(['/menu']);
        }else{
          this.loginBtnDisable=true;
          this.toster.showError("Invalid","Invalid Credentials!");
          this.route.navigate(['/login']);
          this.loginForm.reset();
        }
      },1000);
    },rej=>{
      console.log(rej);
      this.toster.showError("Error","oops! something went wrong");
    })
  }
}
