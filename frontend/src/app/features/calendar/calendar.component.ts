import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  @Input() events: DayPilot.EventData[] = [];

  @Input()
  set config(value: any) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): any {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<any>();
  @Output() timeRangeSelected = new EventEmitter<any>();

  private readonly defaultConfig: any = {
    viewType: 'Week',
    onEventClick: (args: any) => this.onEventClick(args),
    onTimeRangeSelected: (args: any) => this.onTimeRangeSelected(args)
  };

  private _config: any = this.defaultConfig;

  onEventClick(args: any): void {
    this.eventClick.emit(args);
  }

  onTimeRangeSelected(args: any): void {
    this.timeRangeSelected.emit(args);
  }
}
