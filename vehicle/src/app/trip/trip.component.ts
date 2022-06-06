import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  providers:[SharedserviceService]
})
export class TripComponent implements OnInit {

  tripForm!:FormGroup;
  userId:any;
  storeDrobdownDriver:any=[];
  resObj!:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.tripForm=this.formbuilder.group({
      vinNumber:[''],
      driname:[''],
      vehiclenumber:['',Validators.required],
      vehicletype:['',Validators.required],
      drivername:['',Validators.required],
      from:['',Validators.required],
      to:['',Validators.required],
      date:['',Validators.required],
      driver_id:[''],
      vehicle_id:[''],
      _id:[''],
      _rev:[''],
      userId:['']
    })
    let parsed:any =localStorage.getItem("currentUser");
    this.userId= JSON.parse(parsed);
    this.userId=this.userId._id;
    this.get();
    setTimeout(() => {
      this.setValueInDropdown();
      this.share.setDate();
    }, 1000);
  }
  
  //This functioin is used when add
  showOrHide(){
    this.tripForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
    this.share.setFieldShow=true;
  }


  //To check alraedy selected vehicle is assigned to trip or not  and set the vehicle's details in field
  setField(val:any){
    this.share.Vehiclecheck=0;
    this.api.getTripData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const iterator of this.share.allIdObj) {
        if(iterator.vehicle_id==val.target.value){
          this.share.Vehiclecheck=1;
          this.toastar.showError("Error","your vehicle is already in trip, try another!");
        }
      }
    });
    setTimeout(() => {
      if(this.share.Vehiclecheck==1){
        this.tripForm.controls['vinNumber'].reset();
        this.tripForm.controls['vehiclenumber'].reset();
        this.tripForm.controls['vehicletype'].reset();
      }else{
        this.api.getAllVehicleData(val.target.value).subscribe(res=>{
          this.share.storeFieldObj=res;
          this.tripForm.controls['vehiclenumber'].setValue(this.share.storeFieldObj.vehiclenumber);
          this.tripForm.controls['vehicletype'].setValue(this.share.storeFieldObj.vehicletype);
        })
      }
    }, 300);
  }

  //To check alraedy selected driver is assigned to trip or not and set the driver's details in  field

  setFieldDriver(val:any){
    this.share.entryCheck=0;
    this.api.getTripData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const iterator of this.share.allIdObj) {
        if(iterator.driver_id==val.target.value){
          this.share.entryCheck=1;
        }
      }
    });
    setTimeout(() => {
      if(this.share.entryCheck==1){
        this.tripForm.controls['driname'].reset();
        this.tripForm.controls['drivername'].reset();
        this.toastar.showError("Error","driver is already in trip, try another driver!");
      }else{
        this.api.getAllDriverData(val.target.value).subscribe(res=>{
          console.log(res);
          this.share.storeFieldObj=res;
          this.tripForm.controls['drivername'].setValue(this.share.storeFieldObj.data.docs[0].drivername);
        })
      }
    }, 200);
  }


  // set the vehicle details in drobdown
  setValueInDropdown(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.share.storeDrobdownObj.push(key);
      }
    },rej=>{
      this.toastar.showError(rej,"opps! Something went wrong!");
    });
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.storeDrobdownDriver.push(key);
      }
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","opps! Something went wrong!");
    })
  }
  
//Add function to add form value

  add(formValue: any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        if(key.vehiclenumber==formValue.vehiclenumber && key.vehicletype==formValue.vehicletype){
          this.api.getDriverData().subscribe(response=>{
            this.share.allIdObj=response;
            this.share.allIdObj=this.share.allIdObj.data.docs;
            for (const iterator of this.share.allIdObj) {
              if(iterator.drivername==formValue.drivername){
                let obj={
                  from:formValue.from,
                  to:formValue.to,
                  date:formValue.date,
                  driver_id:iterator._id,
                  vehicle_id:key._id,
                  userId:this.userId
                };
                this.api.addTripData(obj).subscribe(Res=>{
                  this.share.allIdObj=Res;
                  this.share.allIdObj=this.share.allIdObj.success;
                  if(this.share.allIdObj==0){
                    this.tripForm.reset();
                    this.get();
                    return this.toastar.showError("Error","opps! Can not post data, try again!");
                  }
                  this.toastar.showSuccess("Success","Your data was updated successfully!");
                  this.tripForm.reset();
                  this.get();
                  let cancel=document.getElementById("cancel");
                  cancel?.click();
                },rej=>{
                  console.log(rej);
                  this.toastar.showError("Error","opps! Can not post data, try again!");
                });
              }
            }
          },rej=>{
            console.log(rej);
            this.toastar.showError("Error","opps! Something went wrong!");
          })
        }
      }
    },rej=>{
      console.log(rej);
      this.toastar.showError("Error","opps! Something went wrong!");
    })
  }

//To get all data from database to show in table
  
get(){
  this.share.store=[];
  this.share.arr=[];
  this.share.storeVehicleArr=[];
  this.api.getTripData().subscribe(res=>{
    this.share.allIdObj=res;
    this.share.allIdObj=this.share.allIdObj.data.docs;
    for (const key of this.share.allIdObj) {
      this.share.arr.push(key);
    }
    
  },rej=>{
    console.log(rej);
    this.toastar.showError("Error","opps! Something went wrong!");
  });
  setTimeout(()=>{
    for(const key of this.share.arr) {
      this.api.getAllVehicleData(key.vehicle_id).subscribe(response => {
        this.share.storeVehicleData=response;
        this.share.storeVehicleArr.push(this.share.storeVehicleData);
      });
    }
  },500);
  setTimeout(() => {
      for (const key of this.share.arr) {
        for (const iterator of this.share.storeVehicleArr) {
          if(key.vehicle_id==iterator._id){
            this.api.getAllDriverData(key.driver_id).subscribe(result=>{
              this.share.storeVehicleData=result;
              this.share.storeVehicleData=this.share.storeVehicleData.data.docs[0];
              this.share.createObj = {
                vehiclenumber: iterator.vehiclenumber,
                vehicletype: iterator.vehicletype,
                drivername:this.share.storeVehicleData.drivername,
                from: key.from,
                to: key.to,
                date: key.date,
                _id: key._id,
                _rev: key._rev,
                userId:key.userId,
                driver_id:key.driver_id,
                vehicle_id:key.vehicle_id
              };
              this.share.store.push(this.share.createObj);
            },rej=>{
              console.log(rej)
              this.toastar.showError("Error","opps! Something went wrong!");
            })
          }
        }
      } 
  }, 1000);
}

//To delete particular values

  delete(data:any){
    this.api.deleteVehicleData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","your data has deleted successfully!");
      this.get();
    },rej=>{
      console.log(rej);
      this.toastar.showError("error","oops can not delete!");
    })
  }

//To reset values in table fields  

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.tripForm.controls['_id'].setValue(row._id);
    this.tripForm.controls['_rev'].setValue(row._rev);
    this.tripForm.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.tripForm.controls['vehicletype'].setValue(row.vehicletype);
    this.tripForm.controls['drivername'].setValue(row.drivername);
    this.tripForm.controls['from'].setValue(row.from);
    this.tripForm.controls['to'].setValue(row.to);
    this.tripForm.controls['date'].setValue(row.date);
    this.tripForm.controls['driver_id'].setValue(row.driver_id);
    this.tripForm.controls['vehicle_id'].setValue(row.vehicle_id);
    this.tripForm.controls['userId'].setValue(row.userId);
  }

//To update existing form values OR modified existing  
  update(formValue:any){
    this.api.updateTripData(formValue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.tripForm.reset();
        this.get();
        return this.toastar.showError("error","oops can not post data, try again!");
      }
      this.toastar.showSuccess("Success","your data has updated successfully!");
      this.tripForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.get();
      },rej=>{
        console.log(rej);
        this.toastar.showError("Error","oops can not update!");
    })
  }
}
