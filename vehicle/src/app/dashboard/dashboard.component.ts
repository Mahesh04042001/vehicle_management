import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  noOfVehicle: any=0;
  noOfAdmin: any=0;
  noOfDriver: any=0;
  insuranceExp: any=0;
  maintanenceExp: any=0;
  fuelExp: any=0;
  totalExp: any=0;
  storeDriver:any;
  driverAssigned:any;
  driverAvailable:any;
  vehicleAssigned:any;
  vehicleAvailable:any;
  minDate:any;
  maxDate:any;
  endingMinDate:any;

  constructor(private api:ApiService,public share:SharedserviceService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.getfuelExp();
    this.getinsuranceExp();
    this.getMaintanenceExp();
    setTimeout(() => {
      this.getVehicle();
      this.getAdmin();
      this.getDriver();
      this.setDate();
      this.share.checkDate();
      console.log(this.share.checkdate);
    }, 1000);
    this.getTotal();
  }

  //get the Total number of admin

  getAdmin(){
    this.api.getUserData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      this.noOfAdmin=this.share.store.length;
    })
  }

  //get the Total number,assigned and available of Driver

  getDriver(){
    this.api.getDriverData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      this.noOfDriver=this.share.store.length;
      this.api.getTripData().subscribe(response=>{
        this.share.store=response;
        this.share.store=this.share.store.data.docs;
        this.driverAssigned=this.share.store.length;
        this.driverAvailable=this.noOfDriver-this.driverAssigned;
      })
    })
  }

  //get the Total number,assigned and available of vehicle

  getVehicle(){
    this.api.getVehicleData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      this.noOfVehicle=this.share.store.length;
      this.api.getTripData().subscribe(response=>{
        this.share.store=response;
        this.share.store=this.share.store.data.docs;
        this.vehicleAssigned=this.share.store.length;
        this.vehicleAvailable=this.noOfVehicle-this.vehicleAssigned;
      })
    })
  }

  //get the Total expenditure of insurance

  getinsuranceExp(){
    this.api.getInsuranceData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      for (const key of this.share.store) {
        this.insuranceExp+=key.cost;
      }
    })
  }

  //get the Total expenditure of maintanence

  getMaintanenceExp(){
    this.api.getMaintanenceData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      for (const key of this.share.store) {
        this.maintanenceExp+=key.cost;
      }
    })
  }

  //get the Total expenditure of fuel

  getfuelExp(){
    this.api.getFuleData().subscribe(res=>{
      this.share.store=res;
      this.share.store=this.share.store.data.docs;
      for (const key of this.share.store) {
        this.fuelExp+=key.cost;
      }
    })
  }

  //get the Total expenditure of system

  getTotal(){
    setTimeout(() => {
      this.totalExp=this.insuranceExp+this.maintanenceExp+this.fuelExp;
    },1000);
  }

  //set date in date field in form
  setDate(){
    let date = new Date();
    let currentDate:any = date.getDate();
    let currentMonth:any = date.getMonth() + 1;
    let currentYear:any = date.getFullYear();
    let checkCurrentDate:any;
    if (currentDate < 10){
      checkCurrentDate=currentDate;
      currentDate = "0" + currentDate;
    }
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth;
    }
    this.minDate = currentYear + "-" + currentMonth + "-" + currentDate;
    this.share.checkdate=currentYear + "-" + currentMonth + "-" + `0${(1+checkCurrentDate)}`;
    this.maxDate=currentYear + "-" + currentMonth + "-" + currentDate;
    this.endingMinDate=currentYear+1 + "-" + currentMonth + "-" + currentDate;
  }

  
}
