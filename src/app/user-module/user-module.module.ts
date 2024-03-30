import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModuleRoutingModule } from './user-module-routing.module';
import { UserdashboardComponent } from './usercomponents/userdashboard/userdashboard.component';
import { UserbookingComponent } from './usercomponents/userbooking/userbooking.component';
import { UserfeedbackComponent } from './usercomponents/userfeedback/userfeedback.component';
import { UserprofileComponent } from './usercomponents/userprofile/userprofile.component';
import { UsersettingComponent } from './usercomponents/usersetting/usersetting.component';
import { UseranalyticsComponent } from './usercomponents/useranalytics/useranalytics.component';
import { FormsModule } from '@angular/forms';
import { EvdetailspageComponent } from './usercomponents/evdetailspage/evdetailspage.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { NotificationsComponent } from './usercomponents/notifications/notifications.component';
import { UserpaymentsComponent } from './usercomponents/userpayments/userpayments.component';

@NgModule({
  declarations: [
    UserdashboardComponent,
    UserbookingComponent,
    UserfeedbackComponent,
    UserprofileComponent,
    UsersettingComponent,
    UseranalyticsComponent,
    EvdetailspageComponent,
    NotificationsComponent,
    UserpaymentsComponent,
  ],
  imports: [
    CommonModule,
    UserModuleRoutingModule,
    FormsModule,
    CanvasJSAngularChartsModule,
  ],
})
export class UserModuleModule {}
