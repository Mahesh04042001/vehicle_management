import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  providers:[SharedserviceService]
})
export class AddVehicleComponent implements OnInit {

  vehicleForm!:FormGroup;
  userId:any;
  minDate:any;
  maxDate:any;
  
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.vehicleForm=this.formbuilder.group({
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      color:['',Validators.required],
      registerdate:['',Validators.required],
      chasisno:['',Validators.required],
      cost:['',Validators.required],
      _id:[''],
      _rev:[''],
      userId:['']
    })
    this.get();
    let parsed:any =localStorage.getItem("currentUser");
    this.userId= JSON.parse(parsed);
    this.userId=this.userId._id;
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
    this.minDate = currentYear + "-" + currentMonth + "-" + (currentDate);
    this.maxDate=currentYear + "-" + currentMonth + "-" + (currentDate);
  }

  
  //This functioin is used when add

  showOrHide(){
    this.vehicleForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }
  
  //Add function to add form value

  add(formValue: any){
    formValue={
      vehiclenumber: formValue.vehiclenumber,
      vehicletype: formValue.vehicletype,
      color: formValue.color,
      registerdate: formValue.registerdate,
      chasisno: formValue.chasisno,
      cost: formValue.cost,
      userId:this.userId
    }
    this.api.addVehicleData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.vehicleForm.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.vehicleForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! Can not post data, try again!");
    });
  }

  //To get all data from database to show in table
  
  get(){
    this.share.store=[];
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! something went wrong");
    })
  }

  //To delete table row  

  delete(data:any){
    this.api.deleteVehicleData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","Your data was deleted successfully!");
      this.share.store=[];
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! Can not delete data, try again!");
    })
  }

  //To eset values in table fields  

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.vehicleForm.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.vehicleForm.controls['vehicletype'].setValue(row.vehicletype);
    this.vehicleForm.controls['color'].setValue(row.color);
    this.vehicleForm.controls['registerdate'].setValue(row.registerdate);
    this.vehicleForm.controls['chasisno'].setValue(row.chasisno);
    this.vehicleForm.controls['cost'].setValue(row.cost);
    this.vehicleForm.controls['_id'].setValue(row._id);
    this.vehicleForm.controls['_rev'].setValue(row._rev);
    this.vehicleForm.controls['userId'].setValue(row.userId);
  }

  //To update existing form values OR modified existing  

  update(formValue:NgForm){
    this.api.updateVehicleData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.vehicleForm.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.vehicleForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
      },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! can not update.....");
    })
  }

  //Vehicle database check using Chasis number

  vehicleCheck(formValue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if(iterator.chasisno==formValue.chasisno || (iterator.vehiclenumber==formValue.vehiclenumber && iterator.vehicletype==formValue.vehicletype)){
            this.share.primaryCheck=1;
          }
        }
      }
      setTimeout(()=>{
        if(this.share.primaryCheck==1){
          this.toastar.showError("Error","your vehicle chasis number already exist try another one!");
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
