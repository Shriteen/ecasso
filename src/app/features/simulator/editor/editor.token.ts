import { InjectionToken } from '@angular/core';

export const ALL_STATES = new InjectionToken<()=>{_id: string,name: string}[]>('Array of all the possible states');
