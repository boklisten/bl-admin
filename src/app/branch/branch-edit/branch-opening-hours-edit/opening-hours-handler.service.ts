import {Injectable} from '@angular/core';
import {Branch, OpeningHour} from '@wizardcoder/bl-model';
import {BranchService, OpeningHourService} from '@wizardcoder/bl-connect';

@Injectable()
export class OpeningHoursHandlerService {

	constructor(private _openingHourService: OpeningHourService, private _branchService: BranchService) {
	}


	public add(branch: Branch, openingHour: OpeningHour): Promise<OpeningHour> {
		return new Promise((resolve, reject) => {
			let openingHourIds = (branch.openingHours) ? branch.openingHours : [];

			this._openingHourService.add(openingHour).then((addedOpeningHour: OpeningHour) => {
				openingHourIds.push(addedOpeningHour.id);

				this._branchService.update(branch.id, {openingHours: openingHourIds}).then((updatedBranch: Branch) => {
					resolve(addedOpeningHour);
				}).catch((updateBranchError) => {
					console.log('OpeningHoursHandlerService: could not update branch', updateBranchError);
				});
			}).catch((addOpeningHourError) => {
				console.log('openingHoursHandlerService: could not add opening hour');
			});
		});
	}

	public remove(branch: Branch, openingHour: OpeningHour): Promise<boolean> {
		for (let i = 0; i < branch.openingHours.length; i++) {
			if (branch.openingHours[i] === openingHour.id) {
				branch.openingHours.splice(i, 1);
				break;
			}
		}

		return this._branchService.update(branch.id, {openingHours: branch.openingHours}).then((updatedBranch: Branch) => {
			return true;
		}).catch((updateBranchError) => {
			throw new Error('openingHoursHandlerService: could not update opening hours on branch');
		});
	}

}
