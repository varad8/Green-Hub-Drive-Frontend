import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { BookingComponent } from './components/booking/booking.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    SidebarComponent,
    SettingsComponent,
    ProfileComponent,
    AnalyticsComponent,
    BookingComponent,
    PaymentsComponent,
    FeedbackComponent,
    NotificationsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, FormsModule, HttpClientModule],
})
export class AdminModule {}
