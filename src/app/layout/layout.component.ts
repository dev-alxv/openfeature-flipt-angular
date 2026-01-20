import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ContextSwitcherComponent } from '../shared/context-switcher/context-switcher.component';
import { ContextService } from '../shared/context.service';

@Component({
  selector:'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone:true,
  imports:[CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ContextSwitcherComponent]
})
export class LayoutComponent {
  currentUser$ = this.contextService.context$;
  
  constructor(private contextService: ContextService) {}
  
  getUserInitial(userId?: string): string {
    if (!userId) return '?';
    const names: any = {
      'client-1': 'I',
      'client-2': 'M'
    };
    return names[userId] || '?';
  }
  
  getUserName(userId?: string): string {
    if (!userId) return 'Guest User';
    const names: any = {
      'client-1': 'Invenda',
      'client-2': 'Mars'
    };
    return names[userId] || 'Unknown User';
  }
  
  getUserEmail(userId?: string): string {
    if (!userId) return 'guest@company.com';
    const emails: any = {
      'client-1': 'alice@company.com',
      'client-2': 'bob@company.com'
    };
    return emails[userId] || 'user@company.com';
  }
}