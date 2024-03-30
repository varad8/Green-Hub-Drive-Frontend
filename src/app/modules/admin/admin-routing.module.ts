import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { BookingComponent } from './components/booking/booking.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NotificationsComponent } from './components/notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AnalyticsComponent },
      { path: 'bookings', component: BookingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'ratings', component: FeedbackComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'payments', component: PaymentsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
