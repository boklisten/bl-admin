import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Company } from "@boklisten/bl-model";
import { CompanyService } from "@boklisten/bl-connect";

@Component({
	selector: "app-company-select-list",
	templateUrl: "./company-select-list.component.html",
	styleUrls: ["./company-select-list.component.scss"]
})
export class CompanySelectListComponent implements OnInit {
	@Output() selected: EventEmitter<Company>;

	public companies: Company[];
	public selectedCompany: Company;
	public wait: boolean;

	constructor(private companyService: CompanyService) {
		this.selected = new EventEmitter();
		this.companies = [];
	}

	ngOnInit() {
		this.wait = true;
		this.companyService
			.get({ fresh: true })
			.then(companies => {
				this.companies = companies;
				this.wait = false;
			})
			.catch(err => {
				console.log("error getting companies", err);
				this.wait = false;
			});
	}

	public selectCompany(company: Company) {
		if (this.selectedCompany === company) {
			this.selectedCompany = null;
		} else {
			this.selectedCompany = company;
		}

		this.selected.emit(this.selectedCompany);
	}
}
