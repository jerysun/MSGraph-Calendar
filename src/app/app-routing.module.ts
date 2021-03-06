import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { NewEventComponent } from './new-event/new-event.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'calendar', component: CalendarComponent},
  { path: 'newevent', component: NewEventComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
