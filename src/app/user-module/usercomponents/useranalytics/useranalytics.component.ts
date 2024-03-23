import { Component } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { UserservicesService } from '../../../UserDataService/userservices.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-useranalytics',
  templateUrl: './useranalytics.component.html',
  styleUrl: './useranalytics.component.css',
})
export class UseranalyticsComponent {
  countdata: any;
  bookingsData: any;
  session: any;
  chart: any = [];
  payementData: any;
  pchart: any = [];
  bchart: any = [];
  bchart1: any = [];

  constructor(
    private auth: AuthService,
    private userdata: UserservicesService
  ) {}

  ngOnInit(): void {
    this.session = this.auth.getWebUserSession();
    this.getBookings(this.session.userid);
    this.getPaymentsData(this.session.userid);
    this.getCountData(this.session.userid);
  }

  // Function to fetch bookings count
  getCountData(userId: string): void {
    this.userdata.getCountDatat(userId).subscribe(
      (data: any) => {
        // Handle data here
        this.countdata = data;
        this.generateCountingChart();
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  // Function to fetch bookings
  getBookings(userId: string): void {
    this.userdata.getChartBookingData(userId).subscribe(
      (data: any) => {
        // Handle data here
        this.bookingsData = data;
        console.log(this.bookingsData);
        this.generateBookingChart();
      },
      (error: any) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }

  //Function to fetch payment data
  getPaymentsData(userId: string): void {
    this.userdata.getChartPaymentData(userId).subscribe(
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
    // Extracting labels and data from bookingsData
    const labels = this.bookingsData.map((item) => item.label);
    const data = this.bookingsData.map((item) => item.count);

    // Initialize datasets array
    const datasets = [];

    // Loop through each data point and generate a random color
    data.forEach((value, index) => {
      const randomColor = this.getRandomColor();
      datasets.push({
        label: `# of Bookings (${labels[index]})`,
        data: [value],
        backgroundColor: randomColor,
        borderColor: randomColor,
        borderWidth: 1,
        barThickness: 100,
      });
    });

    this.chart = new Chart('canvas', {
      type: 'bar',
      data: {
        labels: [''], // Empty labels array, as labels are provided in datasets
        datasets: datasets, // Assign the dynamically created datasets
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
    // Extracting labels and data from payementData
    const labels = this.payementData.map((item) => item.label);
    const data = this.payementData.map((item) => parseFloat(item.data)); // Parsing data to float

    console.log(data, labels);

    // Initialize datasets array
    const datasets = [];

    // Loop through each data point and generate a random color
    data.forEach((value, index) => {
      const randomColor = this.getRandomColor();
      datasets.push({
        label: `# of Payments (${labels[index]})`,
        data: [value],
        borderWidth: 1,
        borderColor: 'rgb(75, 192, 192)',
      });
    });

    this.pchart = new Chart('canvas2', {
      type: 'line',
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

  generateCountingChart() {
    // Extracting labels and data from the countData object
    const labels = [
      "Today's Booking",
      'Not Visited',
      'Visited',
      'Total Booking',
    ];
    const data = [
      this.countdata.todaysBookingCount,
      this.countdata.notVisitedCount,
      this.countdata.visitedCount,
      this.countdata.totalBookingCount,
    ];

    // Initialize dataset
    const dataset = {
      label: 'Count',
      data: data,
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
      ],
      hoverOffset: 4,
    };

    // Create chart configuration
    const chartConfig = {
      type: 'doughnut' as const,
      data: {
        labels: labels,
        datasets: [dataset],
      },
    };

    const chartConfig2 = {
      type: 'line' as const,
      data: {
        labels: labels,
        datasets: [dataset],
      },
    };

    // Render chart
    this.bchart = new Chart('canvas3', chartConfig);
    this.bchart1 = new Chart('canvas4', chartConfig2);
  }

  // Function to generate a random RGBA color
  getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.random().toFixed(2); // Random alpha value between 0 and 1
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
}
