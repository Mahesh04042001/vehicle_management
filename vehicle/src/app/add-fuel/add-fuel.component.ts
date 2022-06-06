import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.css'],
  providers:[SharedserviceService]
})
export class AddFuelComponent implements OnInit {

  fuelForm!:FormGroup;
  storeFuelObj:any;
  storeAllFuelObj:any;
  storeFuelData:any;
  minDate:any;
  maxDate:any;

  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.fuelForm=this.formbuilder.group({
      vinNumber:[''],
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      fuel:['',Validators.required],
      quantity:['',Validators.required],
      fillingdate:['',Validators.required],
      cost:['',Validators.required],
      _id:[''],
      _rev:[''],
      vehicle_Id:['']
    })
    this.setValueInDropdown();
    this.get();
    this.setdate();
  }

  //set date in date field in form
  setdate(){
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
    this.minDate = currentYear + "-" + currentMonth + "-" + currentDate;
    this.maxDate=currentYear + "-" + currentMonth + "-" + currentDate;
  }

  
  //To show add and hide update button
  showOrHide(){
    this.fuelForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }

  //set selected values in field and also check selected vehicle is added in trip 
  setField(val:any){
    this.share.Vehiclecheck=0;
    this.api.getTripData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const iterator of this.share.allIdObj) {
        if(iterator.vehicle_id==val.target.value){
          this.share.Vehiclecheck=1;
        }
      }
    });
    setTimeout(() => {
      if(this.share.Vehiclecheck==1){
        this.api.getAllVehicleData(val.target.value).subscribe(res=>{
          this.share.storeFieldObj=res;
          this.fuelForm.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
          this.fuelForm.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
        })
      }else{
        this.fuelForm.reset();
        this.toastar.showError("Error","Add the vehicle in trip then insert fuel info!!!");
      }
    }, 300);
  }

  //to delete the particular table field
  delete(data:any){
    this.api.deleteFuelData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","your data has deleted successfully!");
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops can not delete!");
    })
  }
  

  //setValue in form
  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.fuelForm.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.fuelForm.controls['vehicletype'].setValue(row.vehicletype);
    this.fuelForm.controls['fuel'].setValue(row.fuel);
    this.fuelForm.controls['quantity'].setValue(row.quantity);
    this.fuelForm.controls['fillingdate'].setValue(row.fillingdate);
    this.fuelForm.controls['cost'].setValue(row.cost);
    this.fuelForm.controls['_id'].setValue(row._id);
    this.fuelForm.controls['_rev'].setValue(row._rev);
    this.fuelForm.controls['vehicle_Id'].setValue(row.vehicle_Id);
  }

  //update existing form value
  update(formValue:any){
    this.api.updateFuelData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.fuelForm.reset();
        this.get();
        return  this.toastar.showError("Error","opps! Can not update data, try again!!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.fuelForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! can not update!");
    });
  }
  

  //Add new record
  add(formValue:any){
    this.share.showAdd=false;
    let obj={
    fuel:formValue.fuel,
    quantity:formValue.quantity,
    fillingdate:formValue.fillingdate,
    cost:formValue.cost,
    vehicle_Id:formValue.vehicle_Id,
    };
    this.api.addFuelData(obj).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.fuelForm.reset();
        this.get();
        return this.toastar.showError("Error","oops! Can not post data, try again!");
      }
      this.toastar.showSuccess("Success","your data was posted successfully!");
      this.fuelForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];  
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! Can not post data, try again!");
    });
  }

  //set velues in dropdown
  setValueInDropdown(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeDrobdownObj.push(key);
      }
    },rej=>{
      this.toastar.showError(rej,"oops! Something went wrong!");
    })
  }

  //get the fuel data from the databese
  get(){
    this.share.store=[]
    this.share.arr=[];
    this.api.getFuleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.arr.push(key);
      }
      setTimeout(()=>{
        for (const key of this.share.arr) {
          this.api.getAllTripData(key.vehicle_Id).subscribe(response => {
            this.share.storeVehicleData = response;
            this.share.storeVehicleData=this.share.storeVehicleData.data.docs[0];
            this.share.createObj = {
              vehiclenumber: this.share.storeVehicleData.vehiclenumber,
              vehicletype: this.share.storeVehicleData.vehicletype,
              fuel: key.fuel,
              quantity: key.quantity,
              fillingdate: key.fillingdate,
              cost: key.cost,
              vehicle_Id: key.vehicle_Id,
              _id: key._id,
              _rev: key._rev
            };
            this.share.store.push(this.share.createObj);
          });
        }
      },500);
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! Something went wrong!");
    })
  }
}
