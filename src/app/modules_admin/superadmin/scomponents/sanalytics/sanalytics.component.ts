import { Component } from '@angular/core';
import { AuthService } from '../../../../shared/auth.service';
import { Chart } from 'chart.js';
import { AdminservicesService } from '../../../../AdminDataService/adminservices.service';
import { UserservicesService } from '../../../../UserDataService/userservices.service';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-sanalytics',
  templateUrl: './sanalytics.component.html',
  styleUrl: './sanalytics.component.css',
})
export class SanalyticsComponent {
  private baseUrl = environment.BASE_URL;
  countdata: any;
  bookingsData: any;
  session: any;
  chart: any = [];
  payementData: any;
  pchart: any = [];
  inactiveProfiles: any;
  activeProfiles: any;

  constructor(
    private suadmin: AdminservicesService,
    private userservice: UserservicesService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const sessionUser = this.auth.getAdminSession();
    if (sessionUser) {
      this.auth.getSuperAdminProfileUsingID(sessionUser.adminId).subscribe(
        (data) => {
          this.session = data.profile;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }

    this.getBookings();
    this.getPaymentsData();
    this.getCountData();
    this.getAllEvStationData();
  }

  getAllEvStationData() {
    // Get All Evstations
    this.userservice.getAllEvStations().subscribe(
      (data: any[]) => {
        // Filter active stations based on accountStatus
        this.activeProfiles = data.filter(
          (station) => station.accountStatus?.status === 'ACTIVE'
        );

        // Filter inactive stations based on accountStatus
        this.inactiveProfiles = data.filter(
          (station) => station.accountStatus?.status === 'NOT ACTIVE'
        );

        // Retrieve ratings for active stations
        this.activeProfiles.forEach((station) => {
          this.getRatings(station);
        });

        // Retrieve ratings for inactive stations
        this.inactiveProfiles.forEach((station) => {
          this.getRatings(station);
        });
      },
      (error) => {
        console.error('Error fetching EV stations:', error);
      }
    );
  }

  getRatings(station: any) {
    this.userservice.getRatingsOfStation(station.userid).subscribe(
      (data: any) => {
        station.averageRating = data.averageRating;
      },
      (error) => {
        station.averageRating = 0;
      }
    );
  }

  getCountData(): void {
    this.suadmin.getBookingCount().subscribe(
      (data: any) => {
        // Handle data here
        this.countdata = data;
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  // Function to fetch bookings
  getBookings(): void {
    this.suadmin.getBookingChartData().subscribe(
      (data: any) => {
        // Handle data here
        this.bookingsData = data;
        this.generateBookingChart();
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  //Function to fetch payment data
  getPaymentsData(): void {
    this.suadmin.getPaymentChartData().subscribe(
      (data: any) => {
        // Handle data here
        this.payementData = data;
        this.genratePaymentChart();
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  generateBookingChart() {
    // Initialize arrays to store labels, datasets, and station IDs
    const labels = [];
    const datasets = [];
    const stationIds = [];

    // Loop through each item in this.bookingsData
    this.bookingsData.forEach((item) => {
      const stationId = item.stationId;
      const data = item.data;

      // Add station ID to stationIds array if not already present
      if (!stationIds.includes(stationId)) {
        stationIds.push(stationId);
      }

      // Loop through each data entry for the current station
      data.forEach((entry) => {
        const count = entry.count;
        const label = entry.label;
        const title = entry.title; // New title property

        // Add label to labels array if not already present
        if (!labels.includes(label)) {
          labels.push(label);
        }

        // Find or create dataset for the current station
        let dataset = datasets.find(
          (d) => d.label === `${stationId} - ${title}`
        );
        if (!dataset) {
          dataset = {
            label: `${stationId} - ${title}`, // Updated label to include both stationId and title
            data: [],
            backgroundColor: this.getRandomColor(),
            borderColor: this.getRandomColor(),
            borderWidth: 1,
          };
          datasets.push(dataset);
        }

        // Find index of the label in the labels array
        const index = labels.indexOf(label);

        // Fill in zeros for months where data is missing for the current station
        while (dataset.data.length < index) {
          dataset.data.push(0);
        }

        // Add count to the dataset for the current label
        dataset.data.push(count);
      });
    });

    // Create the chart
    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
          },
        },
      },
    });
  }
  genratePaymentChart() {
    // Initialize arrays to store labels, datasets, and station IDs
    const labels = [];
    const datasets = [];

    // Loop through each item in this.payementData
    this.payementData.forEach((item) => {
      const stationId = item.stationId;
      const title = item.title;
      const data = item.data;

      // Loop through each data entry for the current station
      data.forEach((entry) => {
        const value = parseFloat(entry.data);
        const label = entry.label;

        // Add label to labels array if not already present
        if (!labels.includes(label)) {
          labels.push(label);
        }

        // Find or create dataset for the current station
        let dataset = datasets.find(
          (d) => d.label === `${stationId} - ${title}`
        );
        if (!dataset) {
          dataset = {
            label: `${stationId} - ${title}`,
            data: [],
            borderWidth: 1,
            borderColor: this.getRandomColor(),
          };
          datasets.push(dataset);
        }

        // Find index of the label in the labels array
        const index = labels.indexOf(label);

        // Fill in zeros for months where data is missing for the current station
        while (dataset.data.length < index) {
          dataset.data.push(0);
        }

        // Add value to the dataset for the current label
        dataset.data.push(value);
      });
    });

    // Create the chart
    this.pchart = new Chart('canvas2', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Function to generate a random RGBA color
  getRandomColor() {
    const r = Math.floor(Math.random() * 128); // Red component between 0 and 127
    const g = Math.floor(Math.random() * 128); // Green component between 0 and 127
    const b = Math.floor(Math.random() * 128); // Blue component between 0 and 127
    const a = Math.random().toFixed(2); // Random alpha value between 0 and 1
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  disapproveProfile(profile: any) {
    this.suadmin
      .disapproveEvAdmin(this.session.adminId, profile.userid)
      .subscribe(
        (response) => {
          this.getAllEvStationData();
          alert(response.message);
        },
        (error) => {
          alert(error.error.error);
        }
      );
  }

  approveProfile(profile: any) {
    this.suadmin.approveEvAdmin(this.session.adminId, profile.userid).subscribe(
      (response) => {
        this.getAllEvStationData();
        alert(response.message);
      },
      (error) => {
        alert(error.error.error);
      }
    );
  }

  //Get Image
  getProfileImageUrl(filename: string): string {
    return `${this.baseUrl}/admin/image/${filename}`;
  }
}
