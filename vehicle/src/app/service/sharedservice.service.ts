import { Injectable } from '@angular/core';
import { ToastarService } from '../toastar.service';
import { ApiService } from './api.service.service';

@Injectable({
  providedIn: 'root'
})
export class SharedserviceService {

  searchText:any;
  primaryCheck:number=0;
  storeValidation:any=[];
  setFieldShow:boolean=false;
  showAdd:boolean=false;
  showUpdate:boolean=false;
  allIdObj!:any;
  store:any=[];
  storeDrobdownObj:any=[];
  storeFieldObj:any;
  storeResObj:any;
  entryCheck:any=0;
  storeMaintainData:any;
  storeVehicleData:any;
  createObj:any;
  Vehiclecheck:any=0;
  arr:any=[];
  storeMaintanenceObj:any;
  storeAllMaintObj:any;
  storeVehicleArr:any=[];
  minDate:any;
  maxDate:any;
  currentDate:any;
  currentMonth:any;
  currentYear:any;
  checkdate:any;

  constructor(private api:ApiService,private toastar:ToastarService) { /* document why this constructor is empty */  }

  
  //restrict minus(-) and dot(.) in cost field in form 

  RestrictMinus(e:any){
    if((e.code=="Minus" && e.key=="-" && e.keyCode=="189")||(e.code=="Period" && e.key=="." && e.keyCode==190)){
      e.preventDefault();
    }
  }
  
  //Set date
  setDate(){
    let date = new Date();
    this.currentDate = date.getDate();
    this.currentMonth = date.getMonth() + 1;
    this.currentYear = date.getFullYear();
    if (this.currentDate < 10){
      this.currentDate = "0" + this.currentDate;
    }
    if(this.currentMonth < 10){
      this.currentMonth = "0" + this.currentMonth;
    }
    this.minDate = this.currentYear + "-" + this.currentMonth + "-" + this.currentDate;
    this.maxDate=this.currentYear + "-" + this.currentMonth + "-" + this.currentDate;
  }

  //set value in drobdown of select vehicle
  setValueInDropdown(){
    this.api.getVehicleData().subscribe(res=>{
      this.allIdObj=res;
      this.allIdObj=this.allIdObj.data.docs;
      for (const key of this.allIdObj) {
        this.storeDrobdownObj.push(key);
      }
    },rej=>{
      this.toastar.showError(rej,"oops! Something went wrong!");
    })
  }

  //check end date

  checkDate(){
    setTimeout(() => {
      this.api.getInsuranceData().subscribe(res=>{
        console.log(res);
        this.allIdObj=res;
        this.allIdObj=this.allIdObj.data.docs;
        for (const key of this.allIdObj) {
          if(key.enddate==this.checkdate){
            this.api.getAllVehicleData(key.vehicle).subscribe(response=>{
              this.allIdObj=response;
              this.toastar.showError("Expired",`oops! ${this.allIdObj.vehiclenumber}-${this.allIdObj.vehicletype} insurance expiring tomorrow!` );
            })
          }
        }
      })
    }, 2000);
  }

}
