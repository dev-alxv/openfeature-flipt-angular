import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlagService } from '../services/flag.service';

@Directive({
  selector: '[appFeatureFlagStr]',
  standalone: true
})
export class FeatureFlagStringDirective implements OnInit, OnDestroy {
  @Input() appFeatureFlagStr!: string; // flag name
  @Input() appFeatureFlagStrValue!: string; // expected value
  @Input() appFeatureFlagStrElse?: TemplateRef<any>; // template to show if flag doesn't match

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
        const flagValue = (flags as any)[this.appFeatureFlagStr];
        
        if (flagValue === this.appFeatureFlagStrValue) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.template);
        } else if (this.appFeatureFlagStrElse) {
          this.viewContainer.clear();
          this.viewContainer.createEmbeddedView(this.appFeatureFlagStrElse);
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
