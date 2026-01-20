import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector:'app-admin',
  template:`
    <div class="flipt-admin-container">
      <div class="flipt-header">
        <h1>⚙️ Flipt Admin Panel</h1>
        <p>Manage your feature flags and configurations</p>
        <a [href]="fliptUrl" target="_blank" class="external-link">
          Open in new tab
          <svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
      <div class="flipt-iframe-wrapper">
        <iframe 
          [src]="safeFliptUrl" 
          class="flipt-iframe"
          title="Flipt Admin UI">
        </iframe>
      </div>
    </div>
  `,
  styles:[`
    .flipt-admin-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .flipt-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem 2rem;
      border-radius: 8px 8px 0 0;
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .flipt-header h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 600;
    }

    .flipt-header p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
      font-size: 0.95rem;
      flex-basis: 100%;
    }

    .external-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      font-size: 0.9rem;
      transition: background 0.2s;
    }

    .external-link:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .external-icon {
      width: 16px;
      height: 16px;
    }

    .flipt-iframe-wrapper {
      flex: 1;
      background: white;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-height: 600px;
    }

    .flipt-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }
  `],
  standalone:true
})
export class AdminComponent {
  fliptUrl = 'http://localhost:8080';
  safeFliptUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeFliptUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fliptUrl);
  }
}