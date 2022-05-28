import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  showTag:any=true;
  userId:any;
  storeCredentials:any=[];

  constructor() { }
}
