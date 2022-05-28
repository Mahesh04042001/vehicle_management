import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedserviceService {

  searchText:any;
  showTag:any;
  primaryCheck:number=0;
  storeValidation:any=[];
  setFieldShow:boolean=false;
  showAdd!:boolean;
  showUpdate!:boolean;
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

  constructor() { }
}
