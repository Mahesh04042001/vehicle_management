import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddUserComponent } from './add-user/add-user.component';

import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { HomemenulayoutComponent } from './homemenulayout/homemenulayout.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AddMaintanenceComponent } from './add-maintanence/add-maintanence.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { AboutProductComponent } from './about-product/about-product.component';
import { AddFuelComponent } from './add-fuel/add-fuel.component';
import { AddDriverComponent } from './add-driver/add-driver.component';

import { AccountComponent } from './account/account.component';
import { TripComponent } from './trip/trip.component';


@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    AboutProductComponent,
    HomemenulayoutComponent,
    LoginComponent,
    HomeComponent,
    ContactUsComponent,
    DashboardComponent,
    AddVehicleComponent,
    AddMaintanenceComponent,
    AddInsuranceComponent,
    AddFuelComponent,
    AddDriverComponent,
    AccountComponent,
    TripComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    BrowserAnimationsModule,
    CommonModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
