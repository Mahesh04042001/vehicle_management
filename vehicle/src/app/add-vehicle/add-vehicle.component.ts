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

  vehicleform!:FormGroup;
  userId:any;
  mindate:any;
  maxdate:any;
  
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.vehicleform=this.formbuilder.group({
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
    this.mindate = currentyear + "-" + currentmonth + "-" + (currentdate);
    this.maxdate=currentyear + "-" + currentmonth + "-" + (currentdate);
  }

  
  //This functioin is used when add

  showOrHide(){
    this.vehicleform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }
  
  //Add function to add form value

  add(formvalue: any){
    formvalue={
      vehiclenumber: formvalue.vehiclenumber,
      vehicletype: formvalue.vehicletype,
      color: formvalue.color,
      registerdate: formvalue.registerdate,
      chasisno: formvalue.chasisno,
      cost: formvalue.cost,
      userId:this.userId
    }
    this.api.addVehicleData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.vehicleform.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was posted successfully!");
      this.vehicleform.reset();
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
    this.vehicleform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.vehicleform.controls['vehicletype'].setValue(row.vehicletype);
    this.vehicleform.controls['color'].setValue(row.color);
    this.vehicleform.controls['registerdate'].setValue(row.registerdate);
    this.vehicleform.controls['chasisno'].setValue(row.chasisno);
    this.vehicleform.controls['cost'].setValue(row.cost);
    this.vehicleform.controls['_id'].setValue(row._id);
    this.vehicleform.controls['_rev'].setValue(row._rev);
    this.vehicleform.controls['userId'].setValue(row.userId);
  }

  //To update existing form values OR modified existing  

  update(formvalue:NgForm){
    this.api.updateVehicleData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.vehicleform.reset();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.vehicleform.reset();
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

  vehicleCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeValidation.push(key);
        for (const iterator of this.share.storeValidation) {
          if(iterator.chasisno==formvalue.chasisno || (iterator.vehiclenumber==formvalue.vehiclenumber && iterator.vehicletype==formvalue.vehicletype)){
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
          this.add(formvalue);
        }
      },1000);
    })
  }
}
