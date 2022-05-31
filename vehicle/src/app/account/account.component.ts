import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  hide=true;
  adminform!:FormGroup;
  constructor(private formbuilder:FormBuilder,public share:SharedserviceService,private api:ApiService,public ser:ServiceService ) { }

  ngOnInit(): void {
    this.adminform=this.formbuilder.group({
      name:['',Validators.required],
      username:['',Validators.required],
      pwd:['',Validators.required],
      mobile:['',Validators.required],
      dob:['',Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      _id:[''],
      _rev:[''],
    });
  }

  //show or hide add and update
  showOrHide(){
    this.adminform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }

  //Add user details fun

  adduser(formvalue:any){
    this.api.addUser(formvalue).subscribe(res=>{
      alert("Your data was posted successfully!");
      this.adminform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getuser();
    },rej=>{
      alert("opps! Can not post data"+rej);
    });
  }

  //Get user details and show in table


  getuser(){
    this.api.getUserData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
        alert("opps! Somthing went wrong"+rej);
    })
  }

  //To delete particular user
  
  delete(data:any){
    this.api.deleteUser(data._id,data._rev).subscribe(res=>{
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.getuser();
    },rej=>{
      alert("oops can not delete"+rej);
    })
  }
  

  //To set the values in the field

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.adminform.controls['name'].setValue(row.name);
    this.adminform.controls['username'].setValue(row.username);
    this.adminform.controls['pwd'].setValue(row.pwd);
    this.adminform.controls['mobile'].setValue(row.mobile);
    this.adminform.controls['dob'].setValue(row.dob);
    this.adminform.controls['city'].setValue(row.city);
    this.adminform.controls['state'].setValue(row.state);
    this.adminform.controls['_id'].setValue(row._id);
    this.adminform.controls['_rev'].setValue(row._rev);
  }


  // To update the exisisting one
  update(formvalue:any){
    this.api.updateUser(formvalue).subscribe(res=>{
      alert("Your data was updated successfully!");
      this.adminform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getuser();
    },rej=>{
      console.log("can not update.....",rej);
    })
  }

  //To check the user is already exist using username and mobile

  userCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getUserData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if((iterator.username==formvalue.username   && iterator.password==formvalue.pwd)){
            this.share.primaryCheck=1;
          }
        }
      }
      setTimeout(()=>{
        if(this.share.primaryCheck==1){
          alert("Username and Password already in use try another one!");
          this.share.store=[];
          this.getuser();
          this.share.primaryCheck=0;
        }else{
          this.adduser(formvalue);
        }
      },1000);
    })
  }

}
