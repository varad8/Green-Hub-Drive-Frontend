import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperadminRoutingModule } from './superadmin-routing.module';
import { SdashboardComponent } from './scomponents/sdashboard/sdashboard.component';
import { SprofileComponent } from './scomponents/sprofile/sprofile.component';
import { SsettingsComponent } from './scomponents/ssettings/ssettings.component';
import { SevstationsComponent } from './scomponents/sevstations/sevstations.component';
import { SanalyticsComponent } from './scomponents/sanalytics/sanalytics.component';
import { FormsModule } from '@angular/forms';
import { DetailsComponent } from './scomponents/details/details.component';
import { BookingevComponent } from './scomponents/bookingev/bookingev.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    SdashboardComponent,
    SprofileComponent,
    SsettingsComponent,
    SevstationsComponent,
    SanalyticsComponent,
    DetailsComponent,
    BookingevComponent,
  ],
  imports: [CommonModule, SuperadminRoutingModule, FormsModule, NgChartsModule],
  providers: [
    { provide: NgChartsConfiguration, useValue: { generateColors: false } },
  ],
})
export class SuperadminModule {}
