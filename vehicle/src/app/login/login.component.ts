import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[SharedserviceService,ApiService]
})
export class LoginComponent implements OnInit {

  loginform !:FormGroup;
  logIncheck:any=0;
  loginBtnDisable:boolean=true;
  storeCredentials:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,private route:Router,private shared:SharedserviceService,public service:ServiceService) { }

  ngOnInit(): void {
    this.loginform=this.formbuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
    this.loginBtnDisable=true;
  }

  //Login check function

  login(formvalue:any){
    this.loginBtnDisable=false;
    this.api.getlogindata(formvalue.username,formvalue.password).subscribe(res=>{
      this.shared.allIdObj=res;
      this.shared.allIdObj=this.shared.allIdObj.docs[0];
      this.storeCredentials=this.shared.allIdObj;
      setTimeout(()=>{
        if(this.shared.allIdObj!=undefined && this.storeCredentials!=null){
          localStorage.setItem("currentUser",JSON.stringify(this.storeCredentials));
          this.loginform.reset();
          this.service.showTag=false;
          this.route.navigate(['/menu']);
        }else{
          this.loginBtnDisable=true;
          alert("Your account does not exist!");
          this.route.navigate(['/login']);
          this.loginform.reset();
        }
      },1000);
    },rej=>{
      console.log("error",rej);
    })
  }
}
