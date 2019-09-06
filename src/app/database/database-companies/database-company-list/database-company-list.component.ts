import { Component, OnInit } from "@angular/core";
import { CompanyService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-database-company-list",
	templateUrl: "./database-company-list.component.html",
	styleUrls: ["./database-company-list.component.scss"]
})
export class DatabaseCompanyListComponent implements OnInit {
	private companies;
	constructor(private companyService: CompanyService) {}

	ngOnInit() {
		this.companyService
			.get()
			.then(companies => {
				this.companies = companies;
			})
			.catch(err => {
				console.log("could not get companies", err);
			});
	}
}
