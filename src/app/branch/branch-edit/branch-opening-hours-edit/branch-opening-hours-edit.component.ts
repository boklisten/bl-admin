import {Component, Input, OnInit} from '@angular/core';
import {Branch, OpeningHour} from '@wizardcoder/bl-model';
import {OpeningHourService} from '@wizardcoder/bl-connect';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OpeningHoursHandlerService} from './opening-hours-handler.service';

@Component({
	selector: 'app-branch-opening-hours-edit',
	templateUrl: './branch-opening-hours-edit.component.html',
	styleUrls: ['./branch-opening-hours-edit.component.scss']
})
export class BranchOpeningHoursEditComponent implements OnInit {
	@Input() branch: Branch;
	public openingHours: OpeningHour[];
	public fromDay: {year: number, month: number, day: number};
	public fromTime: {hour: number, minute: number};
	public toTime: {hour: number, minute: number};
	private _modalRef: NgbModalRef;
	public minuteStep: number;

	constructor(private _openingHourService: OpeningHourService, private _modalService: NgbModal, private _openingHoursHandlerService: OpeningHoursHandlerService) {
		this.openingHours = [];
		this.minuteStep = 15;
		const theDate = new Date();
		this.fromDay = {year: theDate.getFullYear(), month: theDate.getMonth(), day: theDate.getDay()};
		this.fromTime = {hour: theDate.getHours(), minute: 0};
		this.toTime = {hour: theDate.getHours() + 1, minute: 0};
	}

	ngOnInit() {
		this._openingHourService.getManyByIds(this.branch.openingHours).then((openingHours: OpeningHour[]) => {
			this.openingHours = openingHours;
		}).catch((getOpeningHoursError) => {
			console.log('branchOpeningHoursEditComponent: could not get opening hours');
		});
	}

	onRemoveOpeningHour(index: number) {
		this._openingHoursHandlerService.remove(this.branch, this.openingHours[index]).then(() => {
			this.openingHours.splice(index, 1);
		}).catch((removeOpeningHourError) => {
			console.log('branchOpeningHoursEditComponent: could not remove opening hour', removeOpeningHourError);
		});
	}

	onAddOpeningHour() {
		const fromDate = new Date(this.fromDay.year, this.fromDay.month, this.fromDay.day, this.fromTime.hour, this.fromTime.minute);
		const toDate = new Date(this.fromDay.year, this.fromDay.month, this.fromDay.day, this.toTime.hour, this.toTime.minute);

		const newOpeningHour: OpeningHour = {
			from: fromDate,
			to: toDate,
			branch: this.branch.id
		} as OpeningHour;

		this._openingHoursHandlerService.add(this.branch, newOpeningHour).then((addedOpeningHour: OpeningHour) => {
			this.openingHours.push(addedOpeningHour);
			this._modalRef.close();
		}).catch((addOpeningHourError) => {
			console.log('branchOpeningHoursEditComponent: could not add openingHour', addOpeningHourError);
		});


	}

	openAddOpeningHour(content) {
		this._modalRef = this._modalService.open(content, {size: 'lg', centered: true});
	}

	isOpeningHourValid(): boolean {
		return true;
	}






}
