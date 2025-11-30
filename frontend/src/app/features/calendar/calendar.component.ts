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
  set config(value: Partial<DayPilot.CalendarConfig> | undefined) {
    this._config = this.mergeConfigWithDefaults(value);
  }
  get config(): DayPilot.CalendarConfig {
    return this._config;
  }

  @Output() eventClick = new EventEmitter<DayPilot.EventClickArgs>();
  @Output() timeRangeSelected = new EventEmitter<DayPilot.TimeRangeSelectedArgs>();

  private readonly defaultConfig: DayPilot.CalendarConfig = {
    viewType: 'Week',
    onEventClick: (args: DayPilot.EventClickArgs) => this.emitEventClick(args),
    onTimeRangeSelected: (args: DayPilot.TimeRangeSelectedArgs) => this.emitTimeRangeSelected(args)
  };

  private _config: DayPilot.CalendarConfig = this.defaultConfig;

  private mergeConfigWithDefaults(config: Partial<DayPilot.CalendarConfig> | undefined): DayPilot.CalendarConfig {
    const safeConfig = config ?? {};
    const { onEventClick, onTimeRangeSelected, ...restConfig } = safeConfig;

    return {
      ...this.defaultConfig,
      ...restConfig,
      onEventClick: (args: DayPilot.EventClickArgs) => {
        this.emitEventClick(args);
        onEventClick?.(args);
      },
      onTimeRangeSelected: (args: DayPilot.TimeRangeSelectedArgs) => {
        this.emitTimeRangeSelected(args);
        onTimeRangeSelected?.(args);
      }
    };
  }

  private emitEventClick(args: DayPilot.EventClickArgs): void {
    this.eventClick.emit(args);
  }

  private emitTimeRangeSelected(args: DayPilot.TimeRangeSelectedArgs): void {
    this.timeRangeSelected.emit(args);
  }
}
