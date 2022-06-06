import { Injectable } from '@angular/core';

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

  constructor() { /* document why this constructor is empty */  }

  
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
}
