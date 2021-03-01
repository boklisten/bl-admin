import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnChanges,
} from "@angular/core";
import { CompanyService } from "@boklisten/bl-connect";

@Component({
	selector: "app-database-company-list",
	templateUrl: "./database-company-list.component.html",
	styleUrls: ["./database-company-list.component.scss"],
})
export class DatabaseCompanyListComponent implements OnInit, OnChanges {
	@Input() update: any;

	public companies = [];
	public wait: boolean;
	constructor(private companyService: CompanyService) {}

	ngOnInit() {
		this.getCompanies();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.update.currentValue) {
			this.getCompanies();
		}
	}

	private getCompanies() {
		this.wait = true;
		this.companyService
			.get({ fresh: true })
			.then((companies) => {
				this.companies = companies;
				this.wait = false;
			})
			.catch((err) => {
				console.log("could not get companies", err);
				this.companies = [];
				this.wait = false;
			});
	}

	public removeCompany(id: string) {
		this.companyService
			.remove(id)
			.then(() => {
				this.getCompanies();
			})
			.catch(() => {
				console.log("could not remove company");
			});
	}
}
