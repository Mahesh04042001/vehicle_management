import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  adminform!:FormGroup;
  maxdate:any;
  storeCredential:any;
  constructor(private formbuilder:FormBuilder,public share:SharedserviceService,private api:ApiService) { }

  ngOnInit(): void {
    this.adminform=this.formbuilder.group({
      name:['',Validators.required],
      username:['',Validators.required],
      pwd:['',Validators.required],
      mobile:['',Validators.required],
      dob:['',Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      _id:[''],
      _rev:[''],
    });
    this.setdate();
    let parsed:any =localStorage.getItem("currentUser");
    this.storeCredential= JSON.parse(parsed);
  }

  //show or hide add and update
  showOrHide(){
    this.adminform.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
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
    this.maxdate = currentyear-18 + "-" + currentmonth + "-" + currentdate;
  }


 
  //To set the values in the field

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.adminform.controls['name'].setValue(row.name);
    this.adminform.controls['username'].setValue(row.username);
    this.adminform.controls['pwd'].setValue(row.pwd);
    this.adminform.controls['mobile'].setValue(row.mobile);
    this.adminform.controls['dob'].setValue(row.dob);
    this.adminform.controls['city'].setValue(row.city);
    this.adminform.controls['state'].setValue(row.state);
    this.adminform.controls['_id'].setValue(row._id);
    this.adminform.controls['_rev'].setValue(row._rev);
  }


  // To update the exisisting one
  update(formvalue:any){
    this.api.updateUser(formvalue).subscribe(res=>{
      console.log(res);
      alert("Your data was updated successfully!");
      this.adminform.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
    },rej=>{
      alert("can not update....."+rej);
    })
  }

  
}
