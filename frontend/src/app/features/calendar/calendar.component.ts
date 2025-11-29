import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Input() events: DayPilot.EventData[] = [];
  @Input() config: DayPilot.CalendarConfig = {};

  @Output() eventClick = new EventEmitter<DayPilot.EventClickArgs>();
  @Output() timeRangeSelected = new EventEmitter<DayPilot.TimeRangeSelectedArgs>();

  get calendarConfig(): DayPilot.CalendarConfig {
    return {
      viewType: 'Week',
      ...this.config,
      onEventClick: (args) => this.handleEventClick(args),
      onTimeRangeSelected: (args) => this.handleTimeRangeSelected(args)
    };
  }

  private handleEventClick(args: DayPilot.EventClickArgs): void {
    this.eventClick.emit(args);
  }

  private handleTimeRangeSelected(args: DayPilot.TimeRangeSelectedArgs): void {
    this.timeRangeSelected.emit(args);
  }
}
