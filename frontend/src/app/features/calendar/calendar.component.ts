import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

type CalendarConfig = DayPilot.CalendarConfig & {
  viewType?: DayPilot.CalendarPropsAndEvents['viewType'] | 'Month';
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  @Input() events: DayPilot.EventData[] = [];

  @Input()
  set config(value: Partial<CalendarConfig>) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): CalendarConfig {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<DayPilot.CalendarEventClickArgs>();
  @Output() timeRangeSelected = new EventEmitter<DayPilot.CalendarTimeRangeSelectedArgs>();

  private readonly defaultConfig: CalendarConfig = {
    viewType: 'Week',
    onEventClick: (args: DayPilot.CalendarEventClickArgs) => this.onEventClick(args),
    onTimeRangeSelected: (args: DayPilot.CalendarTimeRangeSelectedArgs) => this.onTimeRangeSelected(args)
  };

  private _config: CalendarConfig = this.defaultConfig;

  onEventClick(args: DayPilot.CalendarEventClickArgs): void {
    this.eventClick.emit(args);
  }

  onTimeRangeSelected(args: DayPilot.CalendarTimeRangeSelectedArgs): void {
    this.timeRangeSelected.emit(args);
  }
}
