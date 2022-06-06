import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  providers:[SharedserviceService]
})
export class AddUserComponent implements OnInit {
  hide=true;
  userForm!:FormGroup;
  maxDate:any;
  constructor(private formbuilder:FormBuilder,public share:SharedserviceService,private api:ApiService,private toastar:ToastarService ) { }

  ngOnInit(): void {
    this.userForm=this.formbuilder.group({
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
    this.getUser();
    this.setDate();
  }

  //set date in date field in form
  setDate(){
    let date = new Date();
    let currentDate:any = date.getDate();
    let currentMonth:any = date.getMonth() + 1;
    let currentYear:any = date.getFullYear();
    if (currentDate < 10){
      currentDate = "0" + currentDate;
    }
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth;
    }
    this.maxDate = currentYear-18 + "-" + currentMonth + "-" + currentDate;
  }
  
  //Show or hide the add and update button

  showOrHide(){
    this.userForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }

  //Add user details function

  adduser(formValue:any){
    this.api.addUser(formValue).subscribe(res=>{
      console.log(res);
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.userForm.reset();
        return this.toastar.showError("Error","opps! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.userForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getUser();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","opps! Can not post data, try again!");
    });
  }

  //Get user details and show in table

  getUser(){
    this.api.getUserData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
      console.log(rej);
      this.toastar.showError(rej,"oops! Something went wrong");
    })
  }

  //To delete particular user
  
  delete(data:any){
    this.api.deleteUser(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess('Success',"your data was deleted successfully!");
      this.share.store=[];
      this.getUser();
    },rej=>{
      console.log(rej);
      this.toastar.showError(rej,"oops! can not delete");
    })
  }
  

  //To set the values in the field

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.userForm.controls['name'].setValue(row.name);
    this.userForm.controls['username'].setValue(row.username);
    this.userForm.controls['pwd'].setValue(row.pwd);
    this.userForm.controls['mobile'].setValue(row.mobile);
    this.userForm.controls['dob'].setValue(row.dob);
    this.userForm.controls['city'].setValue(row.city);
    this.userForm.controls['state'].setValue(row.state);
    this.userForm.controls['_id'].setValue(row._id);
    this.userForm.controls['_rev'].setValue(row._rev);
  }


  // To update the exisisting one
  update(formValue:NgForm){
    this.api.updateUser(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.userForm.reset();
        return this.toastar.showError("Error","opps! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.userForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getUser();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","can not update.....!");
    })
  }

  //To check the user is already exist using username and mobile

  userCheck(formValue:any){
    this.share.showAdd=false;
    this.api.getUserData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if((iterator.username==formValue.username   && iterator.password==formValue.pwd)){
            this.share.primaryCheck=1;
          }
        }
      }
      setTimeout(()=>{
        if(this.share.primaryCheck==1){
          this.toastar.showError("Error","Username and Password already in use try another one!");
          this.share.store=[];
          this.getUser();
          this.share.primaryCheck=0;
        }else{
          this.adduser(formValue);
        }
      },1000);
    })
  }
}
