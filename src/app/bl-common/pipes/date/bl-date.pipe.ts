import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'blDate'
})
export class BlDatePipe implements PipeTransform {

	transform(dateString: string, format?: 'time' | 'timestamp' | 'day'): any {
		const date = new Date(dateString);

		switch (format) {
			case 'timestamp':
				return this.getTimestampDisplay(date);
			case 'time':
				return this.getTimeDisplay(date);
			case 'day':
				return this.getDayDisplay(date);
			default:
				return this.defaultDateDisplay(date);
		}
	}

	private getDayDisplay(date: Date): string {
		return moment(date).locale('nb').format('dddd');
	}

	private defaultDateDisplay(date: Date): string {
		return this.getDay(date) + '.' + this.getMonth(date) + '.' + (date.getFullYear());
	}

	private getTimestampDisplay(date: Date): string {
		return this.defaultDateDisplay(date) + ' kl. ' + this.getHour(date) + "." + this.getMinute(date) + '.' + date.getSeconds();
	}

	private getTimeDisplay(date: Date): string {
		return 'kl. ' + this.getHour(date) + "." + this.getMinute(date);
	}

	private getDay(date: Date): string {
		if (date.getDate() < 10) {
			return '0' + date.getDate();
		}
		return date.getDate().toString();
	}

	private getMonth(date: Date): string {

		if ((date.getMonth() + 1) < 10) {
			return '0' + (date.getMonth() + 1);
		}

		return (date.getMonth() + 1).toString();
	}

	private getMinute(date: Date): string {
		if (date.getMinutes() < 10) {
			return '0' + date.getMinutes();
		}
		return date.getMinutes().toString();
	}

	private getHour(date: Date): string {
		if (date.getHours() < 10) {
			return '0' + date.getHours();
		}
		return date.getHours().toString();
	}

}
