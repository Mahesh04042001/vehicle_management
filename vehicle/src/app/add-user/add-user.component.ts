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
  userform!:FormGroup;
  maxdate:any;
  constructor(private formbuilder:FormBuilder,public share:SharedserviceService,private api:ApiService,private toastar:ToastarService ) { }

  ngOnInit(): void {
    this.userform=this.formbuilder.group({
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
    this.getuser();
    this.setdate();
  }

  //set date in date field in form
  setdate(){
    let date = new Date();
    let currentdate:any = date.getDate();
    let currentmonth:any = date.getMonth() + 1;
    let currentyear:any = date.getFullYear();
    if (currentdate < 10){
      currentdate = "0" + currentdate;
    }
    if(currentmonth < 10){
      currentmonth = "0" + currentmonth;
    }
    this.maxdate = currentyear-18 + "-" + currentmonth + "-" + currentdate;
  }
  
  //Show or hide the add and update button

  showOrHide(){
    this.userform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }

  //Add user details function

  adduser(formvalue:any){
    this.api.addUser(formvalue).subscribe(res=>{
      console.log(res);
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.userform.reset();
        return this.toastar.showError("Error","opps! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.userform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getuser();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","opps! Can not post data, try again!");
    });
  }

  //Get user details and show in table

  getuser(){
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
      this.getuser();
    },rej=>{
      console.log(rej);
      this.toastar.showError(rej,"oops! can not delete");
    })
  }
  

  //To set the values in the field

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.userform.controls['name'].setValue(row.name);
    this.userform.controls['username'].setValue(row.username);
    this.userform.controls['pwd'].setValue(row.pwd);
    this.userform.controls['mobile'].setValue(row.mobile);
    this.userform.controls['dob'].setValue(row.dob);
    this.userform.controls['city'].setValue(row.city);
    this.userform.controls['state'].setValue(row.state);
    this.userform.controls['_id'].setValue(row._id);
    this.userform.controls['_rev'].setValue(row._rev);
  }


  // To update the exisisting one
  update(formvalue:NgForm){
    this.api.updateUser(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.userform.reset();
        return this.toastar.showError("Error","opps! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.userform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.getuser();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","can not update.....!");
    })
  }

  //To check the user is already exist using username and mobile

  userCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getUserData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
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
          this.toastar.showError("Error","Username and Password already in use try another one!");
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
