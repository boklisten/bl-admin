import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CompanyService } from "@boklisten/bl-connect";
import { Company } from "@boklisten/bl-model";

@Component({
	selector: "app-database-company-add",
	templateUrl: "./database-company-add.component.html",
	styleUrls: ["./database-company-add.component.scss"],
})
export class DatabaseCompanyAddComponent implements OnInit {
	@Output() added: EventEmitter<Company>;
	companyForm: FormGroup;
	contactInfoForm: FormGroup;

	constructor(private companyService: CompanyService) {
		this.companyForm = new FormGroup({
			name: new FormControl("", [Validators.required]),
			customerNumber: new FormControl(""),
			organizationNumber: new FormControl(""),
		});

		this.added = new EventEmitter<Company>();

		this.contactInfoForm = new FormGroup({
			phone: new FormControl("", [Validators.required]),
			email: new FormControl("", [Validators.required]),
			address: new FormControl("", [Validators.required]),
			postCode: new FormControl("", [Validators.required]),
			postCity: new FormControl("", [Validators.required]),
		});
	}

	ngOnInit() {}

	public add() {
		const company = {
			name: this.companyForm.controls["name"].value,
			customerNumber: this.companyForm.controls["customerNumber"]
				.value as any,
			organizationNumber: this.companyForm.controls["organizationNumber"]
				.value,
			contactInfo: {
				phone: this.contactInfoForm.controls["phone"].value,
				email: this.contactInfoForm.controls["email"].value,
				address: this.contactInfoForm.controls["address"].value,
				postCode: this.contactInfoForm.controls["postCode"].value,
				postCity: this.contactInfoForm.controls["postCity"].value,
			},
		} as Company;

		this.companyService
			.add(company)
			.then((companyResponse) => {
				this.added.emit(companyResponse);
			})
			.catch((err) => {
				console.log("could not add company", err);
			});
	}
}
