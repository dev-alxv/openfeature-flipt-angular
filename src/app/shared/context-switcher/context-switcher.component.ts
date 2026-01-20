import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { OpenFeature } from '@openfeature/web-sdk';
import { ContextService } from '../context.service';
@Component({selector:'app-context-switcher',templateUrl:'./context-switcher.component.html',standalone:true,imports: [FormsModule, NgFor]})
export class ContextSwitcherComponent {
 users=[
  {id:'client-1',label:'Invenda - Premium',ctx:{userId:'client-1',targetingKey:'client-1',plan:'premium',tenant:'enterprise'}},
  {id:'client-2',label:'Mars - Standard',ctx:{userId:'client-2',targetingKey:'client-2',plan:'standard',tenant:'public'}},
 ];
 selected='client-1';
 
 constructor(private contextService: ContextService) {}
 
 async onChange(){
  const u=this.users.find(x=>x.id===this.selected);
  if(u) {
    console.log('Setting context:', u.ctx);
    // Ensure targetingKey is present for Flipt entity targeting
    const ctxWithTarget = { ...u.ctx, targetingKey: u.ctx.targetingKey || u.ctx.userId };
    await OpenFeature.setContext(ctxWithTarget as Record<string, any>);
    this.contextService.setContext(ctxWithTarget);
    console.log('Context updated to user:', u.id);
    
    // Force provider to refresh flags
    const provider = OpenFeature.getProvider();
    if ((provider as any).refresh) {
      console.log('Refreshing provider...');
      await (provider as any).refresh();
    }
  }
 }
}