import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';

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
  
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private ser:ServiceService) { }

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
    for (const iterator of this.ser.storeCredentials) {
      this.userId=iterator._id;
    }
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
      this.get();
      alert("Your data was posted successfully!");
      this.vehicleform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
    },rej=>{
      alert("opps! Can not post data"+rej);
    });
  }

  //To get all data from database to show in table
  
  get(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.store.push(key);
      }
    },rej=>{
        alert("opps! Somthing went wrong"+rej);
    })
  }

  //To delete table row  

  delete(data:any){
    this.api.deleteVehicleData(data._id,data._rev).subscribe(res=>{
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
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
      alert("Your data was updated successfully!");
      this.vehicleform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
      },rej=>{
      alert("can not update....."+rej);
    })
  }

  //Vehicle database check using Chasis number

  vehicleCheck(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
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
          alert("your vehicle chasis number already exist try new one!");
          this.share.store=[];
          this.get();
          this.share.primaryCheck=0;
        }else{
          this.add(formvalue);
          this.share.store=[];
        }
      },1000);
    })
  }
}
