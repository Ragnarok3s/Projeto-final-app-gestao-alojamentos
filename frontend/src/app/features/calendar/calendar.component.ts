import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

type CalendarView = 'Day' | 'Days' | 'Week' | 'WorkWeek' | 'Resources';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: false
})
export class CalendarComponent {
  @Input() events: DayPilot.EventData[] = [];

  @Input()
  set config(value: Partial<DayPilot.CalendarConfig> & { viewType?: CalendarView }) {
    this._config = { ...this.defaultConfig, ...value };
  }
  get config(): DayPilot.CalendarConfig {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<any>();
  @Output() timeRangeSelected = new EventEmitter<any>();

  private readonly defaultConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    onEventClick: (args: any) => this.onEventClick(args),
    onTimeRangeSelected: (args: any) => this.onTimeRangeSelected(args)
  };

  private _config: DayPilot.CalendarConfig = { ...this.defaultConfig };

  onEventClick(args: any): void {
    this.eventClick.emit(args);
  }

  onTimeRangeSelected(args: any): void {
    this.timeRangeSelected.emit(args);
  }
}
