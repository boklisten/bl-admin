import { Component, OnInit, Input } from "@angular/core";
import { UserDetailDownloadService } from "./user-detail-download.service";
import { UserDetail } from "@boklisten/bl-model";

@Component({
	selector: "app-user-detail-download",
	templateUrl: "./user-detail-download.component.html",
	styleUrls: ["./user-detail-download.component.scss"],
})
export class UserDetailDownloadComponent implements OnInit {
	public wait: boolean;
	public currentBranch: boolean;
	@Input() currentBranchId: string;

	constructor(private userDetailDownloadService: UserDetailDownloadService) {}

	ngOnInit() {
		this.wait = false;
		this.currentBranch = true;
	}

	public onPrintUserDetails() {
		this.wait = true;

		this.userDetailDownloadService
			.getUserDetails(this.currentBranch, this.currentBranchId)
			.then((userDetails: UserDetail[]) => {
				this.userDetailDownloadService.printUserDetailsToExcelFile(
					userDetails,
					"users"
				);
				this.wait = false;
			})
			.catch(() => {
				this.wait = false;
			});
	}
}
