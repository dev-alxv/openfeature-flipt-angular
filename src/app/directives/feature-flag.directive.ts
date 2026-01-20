import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlagService } from '../services/flag.service';

@Directive({
  selector: '[appFeatureFlag]',
  standalone: true
})
export class FeatureFlagDirective implements OnInit, OnDestroy {
  @Input() appFeatureFlag!: string; // flag name
  @Input() appFeatureFlagElse?: TemplateRef<any>; // template to show if flag is false

  private destroy$ = new Subject<void>();

  constructor(
    private template: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private flagService: FlagService
  ) {}

  ngOnInit() {
    this.flagService.flags$
      .pipe(takeUntil(this.destroy$))
      .subscribe((flags) => {
        const flagValue = (flags as any)[this.appFeatureFlag];
        
        if (flagValue) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.template);
        } else if (this.appFeatureFlagElse) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.appFeatureFlagElse);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
