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
  constructor(private formbuilder:FormBuilder,private api:ApiService,private route:Router,private show:SharedserviceService,public ser:ServiceService) { }

  ngOnInit(): void {
    this.loginform=this.formbuilder.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
    this.loginBtnDisable=true;
  }

  //Login check function

  login(formvalue:any){
    this.ser.storeCredentials=[];
    this.loginBtnDisable=false;
    this.api.getUserData().subscribe(res=>{
      this.show.allIdObj=res;
      this.show.allIdObj=this.show.allIdObj.docs;
      for (const key of this.show.allIdObj) {
        if(key.username==formvalue.username && key.password==formvalue.password){
          this.logIncheck=1;
          this.ser.userId=key._id;
          this.ser.storeCredentials.push(key);
        }
      }
      setTimeout(()=>{
        if(this.logIncheck==1 && this.ser.storeCredentials.length!=0){
          localStorage.setItem("currentUser",JSON.stringify(this.ser.storeCredentials));
          this.loginform.reset();
          this.ser.showTag=false;
          this.route.navigate(['/menu']);
        }else{
          this.loginBtnDisable=true;
          alert("Your account does not exist!");
          this.route.navigate(['/login']);
          this.loginform.reset();
        }
      },1000);
    })
  }
}
