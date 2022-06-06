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

  maintanenceForm!:FormGroup;
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.maintanenceForm=this.formbuilder.group({
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
    this.share.setDate();
  }
  
  //To show add and hide update button function
  showOrHide(){
    this.maintanenceForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }
  // To set vehicle number and type the drobdown list
  setField(val:any){
    this.share.entryCheck=0;
    this.api.getAllVehicleData(val.target.value).subscribe(res=>{
      this.share.storeFieldObj=res;
      this.maintanenceForm.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
      this.maintanenceForm.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
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
              this.maintanenceForm.reset();
              return this.toastar.showError("Error","oops! Can not post data, try again!");
            }
            this.toastar.showSuccess("Success","your data was posted successfully!");
            this.maintanenceForm.reset();
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
        this.maintanenceForm.reset();
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
    this.maintanenceForm.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.maintanenceForm.controls['vehicletype'].setValue(row.vehicletype);
    this.maintanenceForm.controls['date'].setValue(row.date);
    this.maintanenceForm.controls['cost'].setValue(row.cost);
    this.maintanenceForm.controls['description'].setValue(row.description);
    this.maintanenceForm.controls['_id'].setValue(row._id);
    this.maintanenceForm.controls['_rev'].setValue(row._rev);
    this.maintanenceForm.controls['vehicle'].setValue(row.vehicle);
  }

  //To update the existing values in database

  update(formvalue:NgForm){
    this.api.updateMaintanenceData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.maintanenceForm.reset();
        this.share.store=[];
        this.get();
        return  this.toastar.showError("Error","opps! Can not update data, try again!!");
      }
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.maintanenceForm.reset();
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
