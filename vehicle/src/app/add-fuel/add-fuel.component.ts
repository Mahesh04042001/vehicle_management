import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.css'],
  providers:[SharedserviceService]
})
export class AddFuelComponent implements OnInit {

  fuelform!:FormGroup;
  storeFuelObj:any;
  storeAllFuelObj:any;
  storeFuelData:any;
  mindate:any;
  maxdate:any;

  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService) { }

  ngOnInit(): void {
    this.fuelform=this.formbuilder.group({
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
    var date = new Date();
    var currentdate:any = date.getDate();
    var currentmonth:any = date.getMonth() + 1;
    var currentyear:any = date.getFullYear();
    if (currentdate < 10){
      currentdate = "0" + currentdate;
    }
    if(currentmonth < 10){
      currentmonth = "0" + currentmonth;
    }
    this.mindate = currentyear + "-" + currentmonth + "-" + currentdate;
    this.maxdate=currentyear + "-" + currentmonth + "-" + currentdate;
  }

  
  //To show add and hide update button
  showOrHide(){
    this.fuelform.reset();
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
          this.share.storeFieldObj=this.share.storeFieldObj.data;
          this.fuelform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
          this.fuelform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
        })
      }else{
        this.fuelform.reset();
        alert("Add the vehicle in trip then insert fuel info!!!");
      }
    }, 300);
  }

  //to delete the particular table field
  delete(data:any){
    this.api.deleteFuelData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
    })
  }
  

  //setValue in form
  onEdit(row:any){
    console.log(row);
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.fuelform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.fuelform.controls['vehicletype'].setValue(row.vehicletype);
    this.fuelform.controls['fuel'].setValue(row.fuel);
    this.fuelform.controls['quantity'].setValue(row.quantity);
    this.fuelform.controls['fillingdate'].setValue(row.fillingdate);
    this.fuelform.controls['cost'].setValue(row.cost);
    this.fuelform.controls['_id'].setValue(row._id);
    this.fuelform.controls['_rev'].setValue(row._rev);
    this.fuelform.controls['vehicle_Id'].setValue(row.vehicle_Id);
  }

  //update existing form value
  update(formvalue:any){
    this.api.updateFuelData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.fuelform.reset();
        this.get();
        return alert("opps! Can not post data, try again!");
      }
      alert("Your data was updated successfully!");
      this.fuelform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.get();
    },rej=>{
      alert("can not update....."+rej);
    });
  }
  

  //Add new record
  add(formvalue:any){
    this.share.showAdd=false;
    var obj={
    fuel:formvalue.fuel,
    quantity:formvalue.quantity,
    fillingdate:formvalue.fillingdate,
    cost:formvalue.cost,
    vehicle_Id:formvalue.vehicle_Id,
    };
    this.api.addFuelData(obj).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.fuelform.reset();
        this.get();
        return alert("opps! Can not post data, try again!");
      }
      alert("Your data was posted successfully!");
      this.fuelform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];  
      this.get();
    },rej=>{
      alert("opps! Can not post data"+rej);
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
      alert("opps! Somthing went wrong"+rej);
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
            this.share.storeVehicleData=this.share.storeVehicleData.data;
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
      console.log("error",rej);
    })
  }
}
