import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface UserContext {
  userId?: string;
  plan?: string;
  tenant?: string;
  targetingKey?: string; // Flipt requires an entity/targeting key; use userId by default
}

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private contextSubject = new BehaviorSubject<UserContext>({
    userId: 'client-1',
    targetingKey: 'client-1',
    plan: 'premium',
    tenant: 'enterprise'
  });
  public context$ = this.contextSubject.asObservable();

  setContext(context: UserContext) {
    console.log('ContextService: Setting context', context);
    const targetingKey = context.targetingKey || context.userId;
    this.contextSubject.next({ ...context, targetingKey });
  }

  getContext(): UserContext {
    return this.contextSubject.value;
  }
}
