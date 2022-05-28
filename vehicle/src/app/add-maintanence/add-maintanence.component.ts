import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-add-maintanence',
  templateUrl: './add-maintanence.component.html',
  styleUrls: ['./add-maintanence.component.css'],
  providers:[SharedserviceService]
})
export class AddMaintanenceComponent implements OnInit {

  maintanenceform!:FormGroup;
  
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService) { }

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
  }


  //To show add and hide update button function
  showOrHide(){
    this.maintanenceform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }
  // To set the drobdown list
  setField(val:any){
    this.share.entryCheck=0;
    this.api.getAllVehicleData(val.target.value).subscribe(res=>{
      this.share.storeFieldObj=res;
      this.maintanenceform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
      this.maintanenceform.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
    })
  }

  setValueInDropdown(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeDrobdownObj.push(key);
      }
    },rej=>{
      alert("opps! Somthing went wrong"+rej);
    })
  }

  //To add maintanence details

  add(formvalue:any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.docs;
      for (const key of this.share.allIdObj) {
        if(key.vehiclenumber==formvalue.vehiclenumber && key.vehicletype==formvalue.vehicletype){
          this.share.Vehiclecheck=1;
          var obj={
            date:formvalue.date,
            cost:formvalue.cost,
            description:formvalue.description,
            vehicle:key._id,
          };
          this.api.addMaintanenceData(obj).subscribe(res=>{
            console.log(res);
            alert("Your data was posted successfully!");
            this.maintanenceform.reset();
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
      console.log("error",rej);
    })
  }


  //To delete the particular details
  delete(data:any){
    this.api.deleteMaintanenceData(data._id,data._rev).subscribe(res=>{
      alert("your data has deleted, please refresh the page");
      this.share.store=[];
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
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
      alert("Your data was updated successfully!");
      this.maintanenceform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
    },rej=>{
      console.log("can not update.....",rej);
    })
  }
}
