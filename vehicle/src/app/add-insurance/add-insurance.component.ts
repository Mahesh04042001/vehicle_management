import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-add-insurance',
  templateUrl: './add-insurance.component.html',
  styleUrls: ['./add-insurance.component.css'],
  providers:[SharedserviceService]
})
export class AddInsuranceComponent implements OnInit {

  insuranceform!:FormGroup;
  storeInsureData:any;
  storeInsuranceObj:any;
  storeAllInsuranceObj:any;
  mindate:any;
  maxdate:any;
  endingMinDate:any;
  checkdate:any;


  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.insuranceform=this.formbuilder.group({
      vinNumber:[''],
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      company:['',Validators.required],
      startdate:['',Validators.required],
      enddate:['',Validators.required],
      cost:['',Validators.required],
      _id:[''],
      _rev:[''],
      vehicle:['']
    })
    this.get();
    setTimeout(() => {
      this.setValueInDropdown();
      this.setdate();
      this.checkDate();
    }, 500);
    
  }

  //set date in date field in form
  setdate(){
    let date = new Date();
    let currentdate:any = date.getDate();
    let currentmonth:any = date.getMonth() + 1;
    let currentyear:any = date.getFullYear();
    let checkcurrentDate:any;
    if (currentdate < 10){
      checkcurrentDate=currentdate;
      currentdate = "0" + currentdate;
    }
    if(currentmonth < 10){
      currentmonth = "0" + currentmonth;
    }
    this.mindate = currentyear + "-" + currentmonth + "-" + currentdate;
    this.checkdate=currentyear + "-" + currentmonth + "-" + `0${(1+checkcurrentDate)}`;
    this.maxdate=currentyear + "-" + currentmonth + "-" + currentdate;
    this.endingMinDate=currentyear+1 + "-" + currentmonth + "-" + currentdate;
  }

  //To show add and hide update button
  showOrHide(){
    this.insuranceform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }
  
  //set vehicle number and type values in drobdown

  setField(val:any){
    this.share.entryCheck=0;
    this.api.getInsuranceData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const iterator of this.share.allIdObj) {
        if(iterator.vehicle==val.target.value){
          this.share.entryCheck=1;
        }
      }
    });
    setTimeout(() => {
      if(this.share.entryCheck==1){
        this.insuranceform.controls['vinNumber'].reset();
        this.insuranceform.controls['vehiclenumber'].reset();
        this.insuranceform.controls['vehicletype'].reset();
        this.toastar.showError("Error","Already provide insurance for this vehicle,try another one or can edit!");
      }else{
        this.api.getAllDriverData(val.target.value).subscribe(res=>{
          console.log(res);
          this.api.getAllVehicleData(val.target.value).subscribe(response=>{
            this.share.storeFieldObj=response;
            this.insuranceform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
            this.insuranceform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
          })        
        })
      }
    }, 300);
  }

  //set value in drobdown of select vehicle
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

  //To add insurance setails

  add(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        if(key.vehiclenumber==formvalue.vehiclenumber && key.vehicletype==formvalue.vehicletype){
          this.share.Vehiclecheck=1;
          let obj={
            company:formvalue.company,
            startdate:formvalue.startdate,
            enddate:formvalue.enddate,
            cost:formvalue.cost,
            vehicle:key._id,
          };
          this.api.addInsuranceData(obj).subscribe(response=>{
            this.share.allIdObj=response;
            this.share.allIdObj=this.share.allIdObj.success;
            if(this.share.allIdObj==0){
              this.insuranceform.reset();
              return this.toastar.showError("Error","oops! Can not post data, try again!");
            }
            this.toastar.showSuccess("Success","your data was posted successfully!");
            this.insuranceform.reset();
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
        this.insuranceform.reset();
        let cancel=document.getElementById("cancel");
        cancel?.click();
      }
    },500);
  }

  //check end date

  checkDate(){
    this.api.getInsuranceData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        if(key.enddate==this.checkdate){
          this.api.getAllVehicleData(key.vehicle).subscribe(response=>{
            this.share.allIdObj=response;
            this.toastar.showError("Expired",`oops! ${this.share.allIdObj.vehiclenumber}-${this.share.allIdObj.vehicletype} insurance was expired tomorrow!` );
          })
        }
      }
    })
  }

  //to get the all forms details

  get(){
    this.share.arr=[];
    this.api.getInsuranceData().subscribe(res=>{
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
              company:key.company,
              startdate: key.startdate,
              enddate:key.enddate,
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
      this.toastar.showError(rej,"oops! Something went wrong!");
    })
  }

  //to delete the particular table field
  delete(data:any,data1:any){
    this.api.deleteInsuranceData(data._id,data1._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","your data has deleted successfully!");
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops can not delete!");
    })
  }
  

  //To set the values in form
  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.insuranceform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.insuranceform.controls['vehicletype'].setValue(row.vehicletype);
    this.insuranceform.controls['company'].setValue(row.company);
    this.insuranceform.controls['startdate'].setValue(row.startdate);
    this.insuranceform.controls['enddate'].setValue(row.enddate);
    this.insuranceform.controls['cost'].setValue(row.cost);
    this.insuranceform.controls['_id'].setValue(row._id);
    this.insuranceform.controls['_rev'].setValue(row._rev);
    this.insuranceform.controls['vehicle'].setValue(row.vehicle);
  }


  // To update the existing values
  update(formvalue:NgForm){
    this.api.updateInsuranceData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.insuranceform.reset();
        this.share.store=[];
        this.get();
        return  this.toastar.showError("Error","opps! Can not update data, try again!!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.insuranceform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! can not update!");
    })
  }
}
