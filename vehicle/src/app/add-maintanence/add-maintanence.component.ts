import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-add-maintanence',
  templateUrl: './add-maintanence.component.html',
  styleUrls: ['./add-maintanence.component.css'],
  providers:[SharedserviceService]
})
export class AddMaintanenceComponent implements OnInit {

  maintanenceform!:FormGroup;
  mindate:any;
  maxdate:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.maintanenceform=this.formbuilder.group({
      vinNumber:[''],
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      date:['',Validators.required],
      cost:['',Validators.required],
      description:['',Validators.required],
      _id:[''],
      _rev:[''],
      vehicle:['']
    })
    this.get();
    this.setValueInDropdown();
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
    this.mindate = currentyear + "-" + currentmonth + "-" + currentdate;
    this.maxdate=currentyear + "-" + currentmonth + "-" + currentdate;
  }

  //To show add and hide update button function
  showOrHide(){
    this.maintanenceform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }
  // To set vehicle number and type the drobdown list
  setField(val:any){
    this.share.entryCheck=0;
    this.api.getAllVehicleData(val.target.value).subscribe(res=>{
      this.share.storeFieldObj=res;
      this.maintanenceform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
      this.maintanenceform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
    })
  }

  //set values in drobdown of select vehicle field
  
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

  //To add maintanence details

  add(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        if(key.vehiclenumber==formvalue.vehiclenumber && key.vehicletype==formvalue.vehicletype){
          this.share.Vehiclecheck=1;
          let obj={
            date:formvalue.date,
            cost:formvalue.cost,
            description:formvalue.description,
            vehicle:key._id,
          };
          this.api.addMaintanenceData(obj).subscribe(response=>{
            this.share.allIdObj=response;
            this.share.allIdObj=this.share.allIdObj.success;
            if(this.share.allIdObj==0){
              this.maintanenceform.reset();
              return this.toastar.showError("Error","oops! Can not post data, try again!");
            }
            this.toastar.showSuccess("Success","your data was posted successfully!");
            this.maintanenceform.reset();
            let cancel=document.getElementById("cancel");
            cancel?.click();
          },rej=>{
            console.log(rej);
            this.toastar.showError("Error","oops! Can not post data, try again!");
          });
        }
      }
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! Something went wrong!");
    })
    setTimeout(():any=>{
      if(this.share.Vehiclecheck==1){
        this.share.store=[];
        this.get();
      }else{
        this.toastar.showError("Error","Pleae register your vehicle in Add new vehicle from!");
        this.maintanenceform.reset();
        let cancel=document.getElementById("cancel");
        cancel?.click();
      }
    },500);
  }
  
  // //to get all the maintanence details form database

  get(){
    this.share.arr=[];
    this.api.getMaintanenceData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.arr.push(key);
      }
      setTimeout(()=>{
        for (const key of this.share.arr) {
          this.api.getAllVehicleData(key.vehicle).subscribe(response => {
            this.share.storeVehicleData = response;
            this.share.createObj = {
              vehiclenumber: this.share.storeVehicleData.vehiclenumber,
              vehicletype: this.share.storeVehicleData.vehicletype,
              date: key.date,
              cost: key.cost,
              description: key.description,
              vehicle: key.vehicle,
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


  //To delete the particular details
  delete(data:any){
    this.api.deleteMaintanenceData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","your data has deleted successfully!");
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops can not delete!");
    })
  }
  
  //To set the values in form fileds
  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.maintanenceform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.maintanenceform.controls['vehicletype'].setValue(row.vehicletype);
    this.maintanenceform.controls['date'].setValue(row.date);
    this.maintanenceform.controls['cost'].setValue(row.cost);
    this.maintanenceform.controls['description'].setValue(row.description);
    this.maintanenceform.controls['_id'].setValue(row._id);
    this.maintanenceform.controls['_rev'].setValue(row._rev);
    this.maintanenceform.controls['vehicle'].setValue(row.vehicle);
  }

  //To update the existing values in database

  update(formvalue:NgForm){
    this.api.updateMaintanenceData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.maintanenceform.reset();
        this.share.store=[];
        this.get();
        return  this.toastar.showError("Error","opps! Can not update data, try again!!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.maintanenceform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","oops! can not update!");
    })
  }
}
