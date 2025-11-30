import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Input() events: DayPilot.EventData[] = [];

  @Input()
  set config(value: DayPilot.CalendarConfig) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): DayPilot.CalendarConfig {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<DayPilot.EventClickArgs>();
  @Output() timeRangeSelected = new EventEmitter<DayPilot.TimeRangeSelectedArgs>();

  private readonly defaultConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    onEventClick: (args) => this.onEventClick(args),
    onTimeRangeSelected: (args) => this.onTimeRangeSelected(args)
  };

  private _config: DayPilot.CalendarConfig = this.defaultConfig;

  onEventClick(args: DayPilot.EventClickArgs): void {
    this.eventClick.emit(args);
  }

  onTimeRangeSelected(args: DayPilot.TimeRangeSelectedArgs): void {
    this.timeRangeSelected.emit(args);
  }
}
