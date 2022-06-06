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

  insuranceForm!:FormGroup;
  storeInsureData:any;
  storeInsuranceObj:any;
  storeAllInsuranceObj:any;
  minDate:any;
  maxDate:any;
  endingMinDate:any;


  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.insuranceForm=this.formbuilder.group({
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
      this.share.setValueInDropdown();
      this.setDate();
      this.share.checkDate();
    }, 500);
    
  }

  //set date in date field in form
  setDate(){
    let date = new Date();
    let currentDate:any = date.getDate();
    let currentMonth:any = date.getMonth() + 1;
    let currentYear:any = date.getFullYear();
    let checkcurrentDate:any;
    if (currentDate < 10){
      checkcurrentDate=currentDate;
      currentDate = "0" + currentDate;
    }
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth;
    }
    this.minDate = currentYear + "-" + currentMonth + "-" + currentDate;
    this.share.checkdate=currentYear + "-" + currentMonth + "-" + `0${(1+checkcurrentDate)}`;
    this.maxDate=currentYear + "-" + currentMonth + "-" + currentDate;
    this.endingMinDate=currentYear+1 + "-" + currentMonth + "-" + currentDate;
  }

  //To show add and hide update button
  showOrHide(){
    this.insuranceForm.reset();
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
        this.insuranceForm.controls['vinNumber'].reset();
        this.insuranceForm.controls['vehiclenumber'].reset();
        this.insuranceForm.controls['vehicletype'].reset();
        this.toastar.showError("Error","Already provide insurance for this vehicle,try another one or can edit!");
      }else{
        this.api.getAllDriverData(val.target.value).subscribe(res=>{
          console.log(res);
          this.api.getAllVehicleData(val.target.value).subscribe(response=>{
            this.share.storeFieldObj=response;
            this.insuranceForm.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
            this.insuranceForm.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
          })        
        })
      }
    }, 300);
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
              this.insuranceForm.reset();
              return this.toastar.showError("Error","oops! Can not post data, try again!");
            }
            this.toastar.showSuccess("Success","your data was posted successfully!");
            this.insuranceForm.reset();
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
        this.insuranceForm.reset();
        let cancel=document.getElementById("cancel");
        cancel?.click();
      }
    },500);
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
    this.insuranceForm.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.insuranceForm.controls['vehicletype'].setValue(row.vehicletype);
    this.insuranceForm.controls['company'].setValue(row.company);
    this.insuranceForm.controls['startdate'].setValue(row.startdate);
    this.insuranceForm.controls['enddate'].setValue(row.enddate);
    this.insuranceForm.controls['cost'].setValue(row.cost);
    this.insuranceForm.controls['_id'].setValue(row._id);
    this.insuranceForm.controls['_rev'].setValue(row._rev);
    this.insuranceForm.controls['vehicle'].setValue(row.vehicle);
  }


  // To update the existing values
  update(formvalue:NgForm){
    this.api.updateInsuranceData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.insuranceForm.reset();
        this.share.store=[];
        this.get();
        return  this.toastar.showError("Error","opps! Can not update data, try again!!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.insuranceForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      this.toastar.showError(rej,"oops! can not update!");
    })
  }
}
