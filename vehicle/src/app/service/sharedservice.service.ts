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

  constructor() { }

  
  //restrict minus(-) and dot(.) in cost field in form 

  RestrictMinus(e:any){
    if((e.code=="Minus" && e.key=="-" && e.keyCode=="189")||(e.code=="Period" && e.key=="." && e.keyCode==190)){
      e.preventDefault();
    }
  }
}
