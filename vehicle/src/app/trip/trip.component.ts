import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css'],
  providers:[SharedserviceService]
})
export class TripComponent implements OnInit {

  tripform!:FormGroup;
  userId:any;
  storeDrobdownDriver:any=[];
  mindate:any;
  constructor(private formbuilder:FormBuilder,private api:ApiService,public share:SharedserviceService) { }

  ngOnInit(): void {
    this.tripform=this.formbuilder.group({
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
    this.setValueInDropdown();
    this.get();
    let parsed:any =localStorage.getItem("currentUser");
    this.userId= JSON.parse(parsed);
    this.userId=this.userId._id;
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
  }

  //This functioin is used when add
  showOrHide(){
    this.tripform.reset();
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
          alert("your vehicle is already in trip, try another");
        }
      }
    });
    setTimeout(() => {
      if(this.share.Vehiclecheck==1){
        this.tripform.controls['vinNumber'].reset();
        this.tripform.controls['vehiclenumber'].reset();
        this.tripform.controls['vehicletype'].reset();
      }else{
        this.api.getAllVehicleData(val.target.value).subscribe(res=>{
          this.share.storeFieldObj=res;
          this.tripform.controls['vehiclenumber'].setValue(this.share.storeFieldObj.data.docs[0].vehiclenumber);
          this.tripform.controls['vehicletype'].setValue(this.share.storeFieldObj.data.docs[0].vehicletype);
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
        this.tripform.controls['driname'].reset();
        this.tripform.controls['drivername'].reset();
        alert("driver is already in trip, try new driver");
      }else{
        this.api.getAllDriverData(val.target.value).subscribe(res=>{
          console.log(res);
          this.share.storeFieldObj=res;
          this.tripform.controls['drivername'].setValue(this.share.storeFieldObj.data.docs[0].drivername);
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
      alert("opps! Somthing went wrong"+rej);
    });
    this.api.getDriverData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        this.storeDrobdownDriver.push(key);
      }
    },rej=>{
      alert("opps! Somthing went wrong"+rej);
    })
  }
  
//Add function to add form value

  add(formvalue: any){
    this.share.showAdd=false;
    this.api.getVehicleData().subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.data.docs;
      for (const key of this.share.allIdObj) {
        if(key.vehiclenumber==formvalue.vehiclenumber && key.vehicletype==formvalue.vehicletype){
          this.api.getDriverData().subscribe(response=>{
            this.share.allIdObj=response;
            this.share.allIdObj=this.share.allIdObj.data.docs;
            for (const iterator of this.share.allIdObj) {
              if(iterator.drivername==formvalue.drivername){
                var obj={
                  from:formvalue.from,
                  to:formvalue.to,
                  date:formvalue.date,
                  driver_id:iterator._id,
                  vehicle_id:key._id,
                  userId:this.userId
                };
                this.api.addTripData(obj).subscribe(Res=>{
                  this.share.allIdObj=Res;
                  this.share.allIdObj=this.share.allIdObj.success;
                  if(this.share.allIdObj==0){
                    this.tripform.reset();
                    this.get();
                    return alert("opps! Can not post data, try again!");
                  }
                  alert("Your data was posted successfully!");
                  this.tripform.reset();
                  this.get();
                  let cancel=document.getElementById("cancel");
                  cancel?.click();
                },rej=>{
                  alert("opps! Can not post data"+rej);
                });
              }
            }
          },rej=>{
            console.log("error",rej);
          })
        }
      }
    },rej=>{
      console.log("error",rej);
    })
  }

//To get all data from database to show in table
  
get(){
  this.share.store=[];
  this.api.getTripData().subscribe(res=>{
    this.share.arr=[];
    this.share.allIdObj=res;
    this.share.allIdObj=this.share.allIdObj.data.docs;
    for (const key of this.share.allIdObj) {
      this.share.arr.push(key);
    }
    setTimeout(()=>{
      for(const key of this.share.arr) {
        this.api.getAllVehicleData(key.vehicle_id).subscribe(response => {
          this.share.storeVehicleData=response;
          this.share.storeVehicleData=this.share.storeVehicleData.data.docs[0];
          this.share.storeVehicleArr.push(this.share.storeVehicleData);
          this.share.allIdObj=res;
        });
      }
    },500);
    setTimeout(() => {
      this.share.store=[];
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
                console.log("error",rej)
              })
            }
          }
        } 
        this.share.storeVehicleArr=[];
    }, 1000);
  },rej=>{
    console.log("error",rej);
  })
}

//To delete particular values

  delete(data:any){
    this.api.deleteVehicleData(data._id,data._rev).subscribe(res=>{
      console.log(res);
      alert("your data has deleted, please refresh the page");
      this.get();
    },rej=>{
      alert("oops can not delete"+rej);
    })
  }

//To eset values in table fields  

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.share.setFieldShow=false;
    this.tripform.controls['_id'].setValue(row._id);
    this.tripform.controls['_rev'].setValue(row._rev);
    this.tripform.controls['vehiclenumber'].setValue(row.vehiclenumber);
    this.tripform.controls['vehicletype'].setValue(row.vehicletype);
    this.tripform.controls['drivername'].setValue(row.drivername);
    this.tripform.controls['from'].setValue(row.from);
    this.tripform.controls['to'].setValue(row.to);
    this.tripform.controls['date'].setValue(row.date);
    this.tripform.controls['driver_id'].setValue(row.driver_id);
    this.tripform.controls['vehicle_id'].setValue(row.vehicle_id);
    this.tripform.controls['userId'].setValue(row.userId);
  }

//To update existing form values OR modified existing  
  update(formvalue:any){
    this.api.updateTripData(formvalue).subscribe(res=>{
      this.share.allIdObj=res;
      this.share.allIdObj=this.share.allIdObj.success;
      if(this.share.allIdObj==0){
        this.tripform.reset();
        this.get();
        return alert("opps! Can not post data, try again!");
      }
      alert("Your data was updated successfully!");
      this.tripform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
      this.get();
      },rej=>{
      alert("can not update....."+rej);
    })
  }
}
