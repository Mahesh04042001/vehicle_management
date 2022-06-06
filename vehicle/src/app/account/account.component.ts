import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  adminForm!:FormGroup;
  maxDate:any;
  storeCredential:any;
  constructor(private formbuilder:FormBuilder,public share:SharedserviceService,private api:ApiService,private toastar:ToastarService) { }

  ngOnInit(): void {
    this.adminForm=this.formbuilder.group({
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
    this.setDate();
    let parsed:any =localStorage.getItem("currentUser");
    this.storeCredential= JSON.parse(parsed);
  }

  //show or hide add and update
  showOrHide(){
    this.adminForm.reset();
    this.share.showAdd=true;
    this.share.showUpdate=false;
  }
  
  //set date in date field in form
  setDate(){
    let date = new Date();
    let currentDate:any = date.getDate();
    let currentMonth:any = date.getMonth() + 1;
    let currentYear:any = date.getFullYear();
    if (currentDate < 10){
      currentDate = "0" + currentDate;
    }
    if(currentMonth < 10){
      currentMonth = "0" + currentMonth;
    }
    this.maxDate = currentYear-18 + "-" + currentMonth + "-" + currentDate;
  }


 
  //To set the values in the field

  onEdit(row:any){
    this.share.showAdd=false;
    this.share.showUpdate=true;
    this.adminForm.controls['name'].setValue(row.name);
    this.adminForm.controls['username'].setValue(row.username);
    this.adminForm.controls['pwd'].setValue(row.pwd);
    this.adminForm.controls['mobile'].setValue(row.mobile);
    this.adminForm.controls['dob'].setValue(row.dob);
    this.adminForm.controls['city'].setValue(row.city);
    this.adminForm.controls['state'].setValue(row.state);
    this.adminForm.controls['_id'].setValue(row._id);
    this.adminForm.controls['_rev'].setValue(row._rev);
  }


  // To update the exisisting one
  update(formValue:any){
    this.api.updateUser(formValue).subscribe(res=>{
      console.log(res);
      this.toastar.showSuccess("Success","Your data was updated successfully!");
      this.adminForm.reset();
      let cancel=document.getElementById("cancel");
      cancel?.click();
      this.share.store=[];
    },rej=>{
      this.toastar.showError(rej,"can not update.....!");
    })
  }

  
}
