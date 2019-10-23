import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-database-companies",
	templateUrl: "./database-companies.component.html",
	styleUrls: ["./database-companies.component.scss"]
})
export class DatabaseCompaniesComponent implements OnInit {
	public companyUpdate: any;
	constructor() {}

	ngOnInit() {}

	public onCompanyAdd(company) {
		this.companyUpdate = company;
	}
}
