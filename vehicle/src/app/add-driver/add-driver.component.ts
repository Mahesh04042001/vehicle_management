import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.css'],
  providers:[SharedserviceService]
})
export class AddDriverComponent implements OnInit {

  driverform!:FormGroup;
  userId:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private ser:ServiceService) { }

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
    for (const iterator of this.ser.storeCredentials) {
      this.userId=iterator._id;
    }
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
    console.log(formvalue);
    this.api.addDriverData(formvalue).subscribe(res=>{
      alert("Your data was posted successfully!");
      this.driverform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      alert("opps! Can not post data"+rej);
    });
  }

  //get the all details of form
  get(){
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
        alert("opps! Somthing went wrong"+rej);
    })
  }
  

  //delete the particular record
  delete(data:any){
    this.api.deleteDriverData(data._id,data._rev).subscribe(res=>{
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
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
      alert("Your data was updated successfully!");
      this.driverform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      console.log("can not update....."+rej);
    })
  }

  //check dublicate validation using licence number
  driverCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
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
          alert("Licence number already exist try another one!");
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
