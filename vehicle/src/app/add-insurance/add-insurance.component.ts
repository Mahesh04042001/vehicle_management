import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';

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


  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService) { }

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
    this.api.getAllVehicleData(val.target.value).subscribe(res=>{
      this.share.storeFieldObj=res;
      this.share.storeFieldObj=this.share.storeFieldObj.data.docs[0];
      this.insuranceform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
      this.insuranceform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
    })
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
      alert("opps! Somthing went wrong"+rej);
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
              return alert("opps! Can not post data, try again!");
            }
            alert("Your data was posted successfully!");
            this.insuranceform.reset();
            let cancel=document.getElementById("cancel");
            cancel?.click();
          },rej=>{
            alert("opps! Can not post data"+rej);
          });
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
        this.insuranceform.reset();
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
            this.share.storeVehicleData = this.share.storeVehicleData.data.docs[0];
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
      console.log("error",rej);
    })
  }

  //to delete the particular table field
  delete(data:any,data1:any){
    this.api.deleteInsuranceData(data._id,data1._rev).subscribe(res=>{
      console.log(res);
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
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
        return alert("opps! Can not post data, try again!");
      }
      alert("Your data was updated successfully!");
      this.insuranceform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      alert("can not update....."+rej);
    })
  }


}
