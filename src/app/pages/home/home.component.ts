import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlagIndicatorComponent } from '../../shared/flag-indicator/flag-indicator.component';
import { FeatureFlagDirective } from '../../directives/feature-flag.directive';
import { OpenFeature } from '@openfeature/web-sdk';
import { ContextService } from '../../shared/context.service';
import { Subscription } from 'rxjs';
import { FlagService } from 'src/app/services/flag.service';

interface UserData {
  userId: string;
  name: string;
  plan: string;
  tenant: string;
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  status: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: string;
}

interface TeamMember {
  name: string;
  role: string;
  department: string;
  performance: number;
}

interface SalesData {
  product: string;
  sales: number;
  revenue: number;
  growth: number;
}

@Component({
  selector:'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone:true,
  imports:[FlagIndicatorComponent, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: UserData | null = null;
  showNewHomeUI = false;
  activities: Activity[] = [];
  transactions: Transaction[] = [];
  teamMembers: TeamMember[] = [];
  salesData: SalesData[] = [];
  stats = { earning: 0, share: 0, likes: 0, rating: 0 };
  progressPercent = 45;
  chartData: any[] = [];
  revenueChartData: any[] = [];
  private intervalId: any;
  private contextSubscription?: Subscription;
  private flagSubscription?: Subscription;
  oldFeatureA: boolean | undefined;
  oldFeatureB: boolean | undefined;
  newRevenueChartData: boolean | undefined;
  
  constructor(
    private contextService: ContextService,
    private flagService: FlagService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}
  
  ngOnInit() {
    // Subscribe to context changes
    this.contextSubscription = this.contextService.context$.subscribe(context => {
      console.log('Home: Context changed', context);
      this.loadUserData();
    });
    
    // Subscribe to flag changes for real-time updates
    this.flagSubscription = this.flagService.flags$.subscribe(flags => {
      console.log('Home: Flags updated', flags);
      this.ngZone.run(() => {
        this.showNewHomeUI = flags.newHomeUI;
        this.oldFeatureA = flags.oldFeatureA;
        this.oldFeatureB = flags.oldFeatureB;
        this.newRevenueChartData = flags.newRevenueChart;
        // Immediately detect changes
        this.cdr.detectChanges();
      });
    });
  }
  
  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.contextSubscription) this.contextSubscription.unsubscribe();
    if (this.flagSubscription) this.flagSubscription.unsubscribe();
  }
  
  private async loadUserData() {
    const context = this.contextService.getContext();
    
    if (context?.userId) {
      this.currentUser = {
        userId: context.userId,
        name: this.getUserName(context.userId),
        plan: context.plan || 'free',
        tenant: context.tenant || 'public'
      };
      
      // Flags are now managed by FlagService subscription
      // No need to call updateFlags() separately
      this.loadActivities();
      this.loadStats();
      this.loadChartData();
      this.loadTransactions();
      this.loadTeamMembers();
      this.loadSalesData();
      this.loadRevenueChart();
    } else {
      this.currentUser = null;
      this.showNewHomeUI = false;
      this.activities = [];
      this.transactions = [];
      this.teamMembers = [];
      this.salesData = [];
      this.stats = { earning: 0, share: 0, likes: 0, rating: 0 };
      this.chartData = [];
      this.revenueChartData = [];
    }
  }
  
  private async updateFlags() {
    if (this.currentUser) {
      const client = OpenFeature.getClient();

      // Set the evaluation context with targetingKey before evaluating flags
    // await OpenFeature.setContext({
    //   targetingKey: this.currentUser.userId,
    //   userId: this.currentUser.userId,
    //   plan: this.currentUser.plan,
    //   tenant: this.currentUser.tenant
    // });
    
      this.showNewHomeUI = await client.getBooleanValue('newHomeUI', false);
      this.oldFeatureA = await client.getBooleanValue('oldFeatureA', false);
      this.oldFeatureB = await client.getBooleanValue('oldFeatureB', false);
      this.newRevenueChartData = await client.getBooleanValue('newRevenueChart', false);
    }
  }
  
  private getUserName(userId: string): string {
    const names: any = {
      'client-1': 'Invenda',
      'client-2': 'Mars',
      'anon': 'Anonymous User'
    };
    return names[userId] || 'Unknown User';
  }
  
  private loadActivities() {
    if (!this.currentUser) return;
    
    if (this.currentUser.userId === 'client-1') {
      this.activities = [
        { id: 1, action: 'Deployed production release v2.4.1', timestamp: '2 hours ago', status: 'success' },
        { id: 2, action: 'Created new feature flag: darkMode', timestamp: '5 hours ago', status: 'success' },
        { id: 3, action: 'Updated user permissions', timestamp: '1 day ago', status: 'success' },
        { id: 4, action: 'Generated monthly report', timestamp: '2 days ago', status: 'success' }
      ];
    } else if (this.currentUser.userId === 'client-2') {
      this.activities = [
        { id: 1, action: 'Viewed analytics dashboard', timestamp: '1 hour ago', status: 'info' },
        { id: 2, action: 'Updated profile settings', timestamp: '3 hours ago', status: 'success' },
        { id: 3, action: 'Failed deployment attempt', timestamp: '1 day ago', status: 'error' },
        { id: 4, action: 'Password changed successfully', timestamp: '3 days ago', status: 'success' }
      ];
    } else {
      this.activities = [];
    }
  }
  
  private loadStats() {
    if (!this.currentUser) return;
    
    if (this.currentUser.userId === 'client-1') {
      this.stats = { earning: 628, share: 2434, likes: 1259, rating: 8.5 };
      this.progressPercent = 45;
    } else if (this.currentUser.userId === 'client-2') {
      this.stats = { earning: 412, share: 1523, likes: 847, rating: 7.2 };
      this.progressPercent = 32;
    } else {
      this.stats = { earning: 0, share: 0, likes: 0, rating: 0 };
      this.progressPercent = 0;
    }
  }
  
  private loadChartData() {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'];
    
    if (this.currentUser?.userId === 'client-1') {
      this.chartData = [
        { month: 'JAN', value2019: 60, value2020: 45 },
        { month: 'FEB', value2019: 50, value2020: 55 },
        { month: 'MAR', value2019: 70, value2020: 65 },
        { month: 'APR', value2019: 65, value2020: 50 },
        { month: 'MAY', value2019: 55, value2020: 70 },
        { month: 'JUN', value2019: 60, value2020: 55 },
        { month: 'JUL', value2019: 85, value2020: 65 },
        { month: 'AUG', value2019: 70, value2020: 75 }
      ];
    } else {
      this.chartData = [
        { month: 'JAN', value2019: 40, value2020: 35 },
        { month: 'FEB', value2019: 45, value2020: 50 },
        { month: 'MAR', value2019: 55, value2020: 45 },
        { month: 'APR', value2019: 50, value2020: 40 },
        { month: 'MAY', value2019: 60, value2020: 55 },
        { month: 'JUN', value2019: 50, value2020: 45 },
        { month: 'JUL', value2019: 65, value2020: 50 },
        { month: 'AUG', value2019: 55, value2020: 60 }
      ];
    }
  }
  
  private loadTransactions() {
    if (!this.currentUser) return;
    
    if (this.currentUser.userId === 'client-1') {
      this.transactions = [
        { id: 'TXN-1024', date: '2026-01-13', description: 'Premium Subscription', amount: 299.00, status: 'completed' },
        { id: 'TXN-1023', date: '2026-01-12', description: 'API Credits Purchase', amount: 150.00, status: 'completed' },
        { id: 'TXN-1022', date: '2026-01-10', description: 'Enterprise Add-on', amount: 499.00, status: 'completed' },
        { id: 'TXN-1021', date: '2026-01-08', description: 'Storage Upgrade', amount: 99.00, status: 'pending' },
        { id: 'TXN-1020', date: '2026-01-05', description: 'Consulting Services', amount: 1250.00, status: 'completed' }
      ];
    } else {
      this.transactions = [
        { id: 'TXN-2034', date: '2026-01-13', description: 'Standard Subscription', amount: 99.00, status: 'completed' },
        { id: 'TXN-2033', date: '2026-01-10', description: 'Additional Users', amount: 50.00, status: 'completed' },
        { id: 'TXN-2032', date: '2026-01-05', description: 'Feature Pack', amount: 29.00, status: 'failed' }
      ];
    }
  }
  
  private loadTeamMembers() {
    if (!this.currentUser) return;
    
    if (this.currentUser.userId === 'client-1') {
      this.teamMembers = [
        { name: 'Sarah Wilson', role: 'Lead Developer', department: 'Engineering', performance: 95 },
        { name: 'Mike Chen', role: 'Senior Designer', department: 'Design', performance: 88 },
        { name: 'Emily Davis', role: 'Project Manager', department: 'Operations', performance: 92 },
        { name: 'David Brown', role: 'DevOps Engineer', department: 'Engineering', performance: 90 },
        { name: 'Lisa Anderson', role: 'QA Lead', department: 'Quality', performance: 87 }
      ];
    } else {
      this.teamMembers = [
        { name: 'John Smith', role: 'Developer', department: 'Engineering', performance: 82 },
        { name: 'Anna Lee', role: 'Designer', department: 'Design', performance: 79 },
        { name: 'Tom White', role: 'Support', department: 'Customer Success', performance: 85 }
      ];
    }
  }
  
  private loadSalesData() {
    if (!this.currentUser) return;
    
    if (this.currentUser.userId === 'client-1') {
      this.salesData = [
        { product: 'Enterprise Plan', sales: 145, revenue: 72500, growth: 23.5 },
        { product: 'Premium Add-ons', sales: 289, revenue: 43350, growth: 18.2 },
        { product: 'API Services', sales: 567, revenue: 85050, growth: 31.7 },
        { product: 'Consulting', sales: 42, revenue: 52500, growth: 12.4 }
      ];
    } else {
      this.salesData = [
        { product: 'Standard Plan', sales: 89, revenue: 8900, growth: 15.3 },
        { product: 'Basic Add-ons', sales: 124, revenue: 3600, growth: 8.7 },
        { product: 'Support Tickets', sales: 67, revenue: 2010, growth: -3.2 }
      ];
    }
  }
  
  private loadRevenueChart() {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    
    if (this.currentUser?.userId === 'client-1') {
      this.revenueChartData = [
        { quarter: 'Q1', revenue: 85, target: 75 },
        { quarter: 'Q2', revenue: 92, target: 85 },
        { quarter: 'Q3', revenue: 78, target: 80 },
        { quarter: 'Q4', revenue: 95, target: 90 }
      ];
    } else {
      this.revenueChartData = [
        { quarter: 'Q1', revenue: 45, target: 50 },
        { quarter: 'Q2', revenue: 52, target: 55 },
        { quarter: 'Q3', revenue: 48, target: 50 },
        { quarter: 'Q4', revenue: 58, target: 60 }
      ];
    }
  }
  
  isPremiumUser(): boolean {
    return this.currentUser?.plan === 'premium';
  }
  
  isEnterpriseUser(): boolean {
    return this.currentUser?.tenant === 'enterprise';
  }
  
  getTotalSales(): number {
    return this.salesData.reduce((sum, item) => sum + item.sales, 0);
  }
  
  getTotalRevenue(): number {
    return this.salesData.reduce((sum, item) => sum + item.revenue, 0);
  }
  
  getAverageGrowth(): string {
    if (this.salesData.length === 0) return '0.0';
    const avg = this.salesData.reduce((sum, item) => sum + item.growth, 0) / this.salesData.length;
    return avg.toFixed(1);
  }
  
  Math = Math;
}