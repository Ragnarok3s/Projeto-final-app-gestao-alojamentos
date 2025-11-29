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
    this._config = this.mergeConfig(value);
  }
  get config(): DayPilot.CalendarConfig {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<DayPilot.EventClickArgs>();
  @Output() timeRangeSelected = new EventEmitter<DayPilot.TimeRangeSelectedArgs>();

  private readonly baseConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    onEventClick: (args) => this.handleEventClick(args),
    onTimeRangeSelected: (args) => this.handleTimeRangeSelected(args)
  };

  private _config: DayPilot.CalendarConfig = this.baseConfig;

  private handleEventClick(args: DayPilot.EventClickArgs): void {
    this.eventClick.emit(args);
  }

  private handleTimeRangeSelected(args: DayPilot.TimeRangeSelectedArgs): void {
    this.timeRangeSelected.emit(args);
  }

  private mergeConfig(customConfig: DayPilot.CalendarConfig): DayPilot.CalendarConfig {
    const merged = { ...this.baseConfig, ...customConfig };

    if (!merged.onEventClick) {
      merged.onEventClick = (args) => this.handleEventClick(args);
    }

    if (!merged.onTimeRangeSelected) {
      merged.onTimeRangeSelected = (args) => this.handleTimeRangeSelected(args);
    }

    return merged;
  }
}
