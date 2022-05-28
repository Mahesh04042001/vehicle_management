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
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService) { }

  ngOnInit(): void {
    this.fuelform=this.formbuilder.group({
      vinNumber:[''],
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      quantity:['',Validators.required],
      fillingdate:['',Validators.required],
      cost:['',Validators.required],
      _id:[''],
      _rev:[''],
      vehicle:['']
    })
    this.setValueInDropdown();
    this.get();
  }


  //To show add and hide update button
  showOrHide(){
    this.fuelform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }
  
  
 


  setField(val:any){
    this.share.entryCheck=0;
    this.api.getAllVehicleData(val.target.value).subscribe(res=>{
      this.share.storeFieldObj=res;
      this.fuelform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
      this.fuelform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
    })
  }

  //to delete the particular table field
  delete(data:any){
    this.api.deleteFuelData(data._id,data._rev).subscribe(res=>{
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
    })
  }
  

  //setValue in form
  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.fuelform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.fuelform.controls['vehicletype'].setValue(row.vehicletype);
    this.fuelform.controls['quantity'].setValue(row.quantity);
    this.fuelform.controls['fillingdate'].setValue(row.fillingdate);
    this.fuelform.controls['cost'].setValue(row.cost);
    this.fuelform.controls['_id'].setValue(row._id);
    this.fuelform.controls['_rev'].setValue(row._rev);
    this.fuelform.controls['vehicle'].setValue(row.vehicle);
  }

  //update existing form value
  update(formvalue:any){
    this.api.updateFuelData(formvalue).subscribe(res=>{
      alert("Your data was updated successfully!");
      this.fuelform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[]
      this.get();
    },rej=>{
      console.log("can not update.....",rej);
    });
  }
  

  //Add new record
  add(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
          if(key.vehiclenumber==formvalue.vehiclenumber && key.vehicletype==formvalue.vehicletype){
            this.share.Vehiclecheck=1;
            var obj={
              quantity:formvalue.quantity,
              fillingdate:formvalue.fillingdate,
              cost:formvalue.cost,
              vehicle:key._id,
            };
            this.api.addFuelData(obj).subscribe(res=>{
              alert("Your data was posted successfully!");
              this.fuelform.reset();
              let cancel=document.getElementById("cancel");
              cancel?.click();
            },rej=>{
              alert("opps! Can not post data"+rej);
            });
          }else{
        }
      }
    },rej=>{
        alert("opps! Somthing went wrong"+rej);
    })
    setTimeout(():any=>{
      if(this.share.Vehiclecheck==1){
        this.share.store=[];
        this.get();
      }else{
        alert("Pleae register your vehicle in Add new vehicle from!");
        this.fuelform.reset();
        let cancel=document.getElementById("cancel");
        cancel?.click();
      }
    },500);
  }
  setValueInDropdown(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeDrobdownObj.push(key);
        console.log(key);
      }
    },rej=>{
      alert("opps! Somthing went wrong"+rej);
    })
  }
  get(){
    this.share.arr=[];
    this.api.getFuleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.arr.push(key);
      }
      setTimeout(()=>{
        for (const key of this.share.arr) {
          this.api.getAllVehicleData(key.vehicle).subscribe(res => {
            this.share.storeVehicleData = res;
            this.share.createObj = {
              vehiclenumber: this.share.storeVehicleData.vehiclenumber,
              vehicletype: this.share.storeVehicleData.vehicletype,
              quantity: key.quantity,
              fillingdate: key.fillingdate,
              cost: key.cost,
              vehicle: key.vehicle,
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
