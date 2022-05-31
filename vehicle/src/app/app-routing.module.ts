import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutProductComponent } from './about-product/about-product.component';
import { AccountComponent } from './account/account.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { AddFuelComponent } from './add-fuel/add-fuel.component';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';
import { AddMaintanenceComponent } from './add-maintanence/add-maintanence.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { HomemenulayoutComponent } from './homemenulayout/homemenulayout.component';
import { LoginComponent } from './login/login.component';
import { TripComponent } from './trip/trip.component';

const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'menu',canActivate:[AuthenticationGuard],component:HomemenulayoutComponent,
    children:[
      {path:'',redirectTo:'home',pathMatch:'full'},
      {path:'home',component:HomeComponent},
      {path:'aboutus',component:AboutProductComponent},
      {path:'adminpage',component:AdminpageComponent},
      {path:'contactus',component:ContactUsComponent},
      {path:'aboutus',component:AboutProductComponent},
      {path:'account',component:AccountComponent},
      {path:'adduser',component:AddUserComponent},
      {path:'adddriver',component:AddDriverComponent},
      {path:'addvehicle',component:AddVehicleComponent},
      {path:'addtrip',component:TripComponent},
      {path:'addfuel',component:AddFuelComponent},
      {path:'addmaintain',component:AddMaintanenceComponent},
      {path:'addinsurance',component:AddInsuranceComponent},
      {path:'dash_board',component:DashboardComponent}
    ]
  },
  {path:'login',component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
