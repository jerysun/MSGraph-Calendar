import { Component, OnInit } from '@angular/core';
import { Alert } from '../alert';
import { AlertsService } from '../alerts.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(public alertsService: AlertsService) { }

  ngOnInit(): void { }

  close(alert: Alert) {
    this.alertsService.remove(alert);
  }

}
