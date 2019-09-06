import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Company } from "@wizardcoder/bl-model";
import { CompanyService } from "@wizardcoder/bl-connect";

@Component({
	selector: "app-company-select-list",
	templateUrl: "./company-select-list.component.html",
	styleUrls: ["./company-select-list.component.scss"]
})
export class CompanySelectListComponent implements OnInit {
	@Output() selected: EventEmitter<Company>;

	public companies: Company[];
	public selectedCompany: Company;

	constructor(private companyService: CompanyService) {
		this.selected = new EventEmitter();
	}

	ngOnInit() {
		this.companyService
			.get()
			.then(companies => {
				this.companies = companies;
			})
			.catch(err => {
				console.log("error getting companies", err);
			});
	}

	public selectCompany(company: Company) {
		this.selectedCompany = company;
		this.selected.emit(company);
	}
}
