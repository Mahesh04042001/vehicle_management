import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';


@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
  providers:[SharedserviceService]
})
export class AddDriverComponent implements OnInit {

  driverForm!:FormGroup;
  userId:any;

  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.driverForm=this.formbuilder.group({
      drivername:['',Validators.required],
      mobile:['',Validators.required],
      licencenumber:['',Validators.required],
      licenceenddate:['',Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      _id:[''],
      _rev:[''],
      userId:['']
    })
    this.get();
    let parsed:any =localStorage.getItem("currentUser");
    this.userId= JSON.parse(parsed);
    this.userId=this.userId._id;
    this.share.setDate();
  }
  
  //show add and hide update button
  showOrHide(){
    this.driverForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }
  
  //add record to the database
  add(formValue:any){
    formValue={
      drivername:formValue.drivername,
      mobile:formValue.mobile,
      licencenumber:formValue.licencenumber,
      licenceenddate:formValue.licenceenddate,
      city:formValue.city,
      state:formValue.state,
      userId:this.userId
    }
    this.api.addDriverData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.driverForm.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.driverForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! Can not post data, try again!");
    });
  }

  //get the all details of form
  get(){
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
        this.toastar.showError(rej,"oops! something went wrong");
    })
  }
  

  //delete the particular record
  delete(data:any){
    this.api.deleteDriverData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","Your data was deleted successfully!");
      this.share.store=[];
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("error","oops! Can not delete data, try again!");
    })
  }
  
  //set the value in form fields
  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.driverForm.controls['drivername'].setValue(row.drivername);
    this.driverForm.controls['mobile'].setValue(row.mobile);
    this.driverForm.controls['licencenumber'].setValue(row.licencenumber);
    this.driverForm.controls['licenceenddate'].setValue(row.licenceenddate);
    this.driverForm.controls['city'].setValue(row.city);
    this.driverForm.controls['state'].setValue(row.state);
    this.driverForm.controls['_id'].setValue(row._id);
    this.driverForm.controls['_rev'].setValue(row._rev);
    this.driverForm.controls['userId'].setValue(row.userId);
  }

  //update the existing form
  update(formValue:any){
    this.api.updateDriverData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.driverForm.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.driverForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! can not update.....");
    })
  }
 

  //check dublicate validation using licence number
  driverCheck(formValue:any){
    this.share.showAdd=false;
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if(iterator.licencenumber==formValue.licencenumber){
            this.share.primaryCheck=1;
          }
        }
      }
      setTimeout(()=>{
        if(this.share.primaryCheck==1){
          this.toastar.showError("Error","Licence number already exist try another one!");
          this.share.store=[];
          this.get();
          this.share.primaryCheck=0;
        }else{
          this.add(formValue);
        }
      },1000);
    })
  }
}
