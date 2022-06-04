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

  driverform!:FormGroup;
  userId:any;
  mindate:any;

  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.driverform=this.formbuilder.group({
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
    this.setdate();
  }

  //set date in calender field in form
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
    this.mindate = currentyear + "-" + currentmonth + "-" + currentdate;
  }

  //show add and hide update button
  showOrHide(){
    this.driverform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }
  
  //add record to the database
  add(formvalue:any){
    formvalue={
      drivername:formvalue.drivername,
      mobile:formvalue.mobile,
      licencenumber:formvalue.licencenumber,
      licenceenddate:formvalue.licenceenddate,
      city:formvalue.city,
      state:formvalue.state,
      userId:this.userId
    }
    this.api.addDriverData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.driverform.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.driverform.reset();
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
    this.driverform.controls['drivername'].setValue(row.drivername);
    this.driverform.controls['mobile'].setValue(row.mobile);
    this.driverform.controls['licencenumber'].setValue(row.licencenumber);
    this.driverform.controls['licenceenddate'].setValue(row.licenceenddate);
    this.driverform.controls['city'].setValue(row.city);
    this.driverform.controls['state'].setValue(row.state);
    this.driverform.controls['_id'].setValue(row._id);
    this.driverform.controls['_rev'].setValue(row._rev);
    this.driverform.controls['userId'].setValue(row.userId);
  }

  //update the existing form
  update(formvalue:any){
    this.api.updateDriverData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.driverform.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.driverform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! can not update.....");
    })
  }
 

  //check dublicate validation using licence number
  driverCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if(iterator.licencenumber==formvalue.licencenumber){
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
          this.add(formvalue);
        }
      },1000);
    })
  }
}
