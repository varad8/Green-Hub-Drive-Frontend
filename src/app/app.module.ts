import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HerosectionComponent } from './components/herosection/herosection.component';
import { SearchevformComponent } from './components/searchevform/searchevform.component';
import { EvcardComponent } from './components/evcard/evcard.component';
import { EvfeaturesComponent } from './components/evfeatures/evfeatures.component';
import { EvtestimonialComponent } from './components/evtestimonial/evtestimonial.component';
import { FooterComponent } from './components/footer/footer.component';
import { EvadminloginComponent } from './components/evadminlogin/evadminlogin.component';
import { EvadminregisterComponent } from './components/evadminregister/evadminregister.component';
import { AdminloginComponent } from './components/adminlogin/adminlogin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { EvdetailspageComponent } from './components/evdetailspage/evdetailspage.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ModalComponent } from './components/modal/modal.component';
import { HttpClientModule } from '@angular/common/http';
import { BookingmodalComponent } from './components/alertmodal/bookingmodal/bookingmodal.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ContactusComponent } from './components/contactus/contactus.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    HomeComponent,
    NavbarComponent,
    HerosectionComponent,
    SearchevformComponent,
    EvcardComponent,
    EvfeaturesComponent,
    EvtestimonialComponent,
    FooterComponent,
    EvadminloginComponent,
    EvadminregisterComponent,
    AdminloginComponent,
    EvdetailspageComponent,
    ModalComponent,
    BookingmodalComponent,
    AboutusComponent,
    ContactusComponent,
  ],
  imports: [
    NgxWebstorageModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GoogleMapsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CanvasJSAngularChartsModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
