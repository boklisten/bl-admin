import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'blDate'
})
export class BlDatePipe implements PipeTransform {
	
	transform(dateString: string, format?: 'time'): any {
		const date = new Date(dateString);
		
		switch (format) {
			case 'time':
				return this.getTimeDisplay(date);
			default:
				return this.defaultDateDisplay(date);
		}
	}
	
	private defaultDateDisplay(date: Date): string {
		return this.getDay(date) + '.' + this.getMonth(date) + '.' + (date.getFullYear());
	}
	
	private getTimeDisplay(date: Date) {
		return this.defaultDateDisplay(date) + ' kl. ' + this.getHour(date) + "." + this.getMinute(date) + '.' + date.getSeconds();
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
