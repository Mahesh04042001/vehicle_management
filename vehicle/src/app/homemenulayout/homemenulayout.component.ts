import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service.service';
import { ServiceService } from '../service/service.service';
import { SharedserviceService } from '../service/sharedservice.service';
import { ToastarService } from '../toastar.service';

@Component({
  selector: 'app-homemenulayout',
  templateUrl: './homemenulayout.component.html',
  styleUrls: ['./homemenulayout.component.css']
})
export class HomemenulayoutComponent implements OnInit {

  constructor(public api:ApiService,private share:SharedserviceService,private route:Router,public service:ServiceService,private toastar:ToastarService) { }

  ngOnInit(): void { /* document why this method 'ngOnInit' is empty */ }

  //user logout function
  logout(){
    this.toastar.showSuccess("Success","Logged out successfully!")
    this.service.showTag=true;
    localStorage.removeItem('currentUser');
    this.route.navigate(['..']);
  }
}
