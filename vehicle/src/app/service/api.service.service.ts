import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  //Add User Component api services-----------------------------------------------
  addUser(doc:any){
    return this.http.post('http://localhost:8000/postUser/',doc);
  }

  getUserData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getUser/');
  }
  getAllUserData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getUser/${id}`);
  }
  
  deleteUser(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteUser/${id}/${rev}`);
  }
  updateUser(doc:any){
    return this.http.put('http://localhost:8000/updateUser/',doc);
  }
  //------------------------------------------------------------------------------

  //Add Driver Component Api Services--------------------------------------------

  addDriverData(doc:any){
    return this.http.post('http://localhost:8000/postDriver/',doc);
  }

  getDriverData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getDriver/');
  }
  getAllDriverData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getDriver/${id}`);
  }
  
  deleteDriverData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteDriver/${id}/${rev}`);
  }
  updateDriverData(doc:any){
    return this.http.put('http://localhost:8000/updateDriver/',doc);
  }

  //------------------------------------------------------------------------------
 
  //Add Vehicle Component Api Services--------------------------------------------

  addVehicleData(doc:any){
    return this.http.post('http://localhost:8000/postVehicle/',doc);
  }

  getVehicleData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getVehicle/');
  }
  getAllVehicleData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getVehicle/${id}`);
  }
  
  deleteVehicleData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteVehicle/${id}/${rev}`);
  }
  updateVehicleData(doc:any){
    return this.http.put('http://localhost:8000/updateVehicle/',doc);
  }

  //------------------------------------------------------------------------------


  //Add Fuel Component Api Services--------------------------------------------

  addFuelData(doc:any){
    return this.http.post('http://localhost:8000/postFuel/',doc);
  }

  getFuleData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getFuel/');
  }
  getAllFuelData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getFuel/${id}`);
  }
  
  deleteFuelData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteFuel/${id}/${rev}`);
  }
  updateFuelData(doc:any){
    return this.http.put('http://localhost:8000/updateFuel/',doc);
  }

  //------------------------------------------------------------------------------


  //Add Insurance Component Api Services--------------------------------------------

  addInsuranceData(doc:any){
    return this.http.post('http://localhost:8000/postInsurance/',doc);
  }

  getInsuranceData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getInsurance/');
  }
  getAllInsuranceData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getInsurance/${id}`);
  }
  
  deleteInsuranceData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteInsurance/${id}/${rev}`);
  }
  updateInsuranceData(doc:any){
    return this.http.put('http://localhost:8000/updateInsurance/',doc);
  }

  //------------------------------------------------------------------------------


  //Add Maintanence Component Api Services--------------------------------------------

  addMaintanenceData(doc:any){
    return this.http.post('http://localhost:8000/postMaintanence/',doc);
  }

  getMaintanenceData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getMaintanence/');
  }
  getAllMaintanenceData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getMaintanence/${id}`);
  }
  
  deleteMaintanenceData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteMaintanence/${id}/${rev}`);
  }
  updateMaintanenceData(doc:any){
    return this.http.put('http://localhost:8000/updateMaintanence/',doc);
  }

  //Add Maintanence Component Api Services--------------------------------------------

  addTripData(doc:any){
    return this.http.post('http://localhost:8000/postTrip/',doc);
  }

  getTripData(): Observable<{}> {
    return this.http.get('http://localhost:8000/getTrip/');
  }
  getAllTripData(id:any): Observable<{}> {
    return this.http.get(`http://localhost:8000/getTrip/${id}`);
  }
  
  deleteTripData(id:any,rev:any){
    return this.http.delete(`http://localhost:8000/deleteTrip/${id}/${rev}`);
  }
  updateTripData(doc:any){
    return this.http.put('http://localhost:8000/updateTrip/',doc);
  }

  //------------------------------------------------------------------------------
  //get the user login data-----------------------------------------------------

  getlogindata(username:any,password:any){
    return this.http.get(`http://localhost:8000/get_login_user/${username}/${password}`);
  }

}
