import { Injectable } from "@angular/core";
import { UserDetailService } from "@boklisten/bl-connect";
import { UserDetail } from "@boklisten/bl-model";
import { ExcelService } from "../../excel/excel.service";

@Injectable({
	providedIn: "root",
})
export class UserDetailDownloadService {
	constructor(
		private userDetailService: UserDetailService,
		private excelService: ExcelService
	) {}

	public async getUserDetails(
		currentBranch: boolean,
		currentBranchId: string
	): Promise<UserDetail[]> {
		if (currentBranch) {
			return this.userDetailService.get({
				query: "?branch=" + currentBranchId,
			});
		}
		return this.userDetailService.get();
	}

	public printUserDetailsToExcelFile(
		userDetails: UserDetail[],
		fileName: string
	): boolean {
		const excelObjs = this.userdetailsToExcelObjs(userDetails);
		this.excelService.objectsToExcelFile(excelObjs, fileName);
		return true;
	}

	private userdetailsToExcelObjs(userDetails: UserDetail[]): any[] {
		const excelObjs = [];
		for (const userDetail of userDetails) {
			excelObjs.push(this.userDetailToExcelObj(userDetail));
		}
		return excelObjs;
	}

	private userDetailToExcelObj(userDetail: UserDetail): any {
		return {
			id: userDetail.id,
			email: userDetail.email,
			name: userDetail.name,
			phone: userDetail.phone,
			address: userDetail.address,
			postCity: userDetail.postCity,
			postCode: userDetail.postCode,
			dob: userDetail.dob,
			branchId: userDetail.branch,
			creationTime: userDetail.creationTime,
			pivot: 1, // used for excel purposes
		};
	}
}
