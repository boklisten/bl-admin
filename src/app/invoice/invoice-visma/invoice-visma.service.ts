import { Injectable } from "@angular/core";
import { Invoice } from "@wizardcoder/bl-model";
import { DateService } from "../../date/date.service";
import { BlPrintService } from "../../bl-common/bl-print/bl-print.service";
import { BranchService } from "@wizardcoder/bl-connect";

@Injectable({
	providedIn: "root"
})
export class InvoiceVismaService {
	textFields: string[];
	text: {
		title: {
			rent: string;
			"partly-payment": string;
		};
	};
	feeTitle: string;

	constructor(
		private dateService: DateService,
		private printService: BlPrintService,
		private branchService: BranchService
	) {
		this.textFields = [
			"Fakturaen gjelder manglende/for sent leverte bøker fra forrige semester hos: ",
			"",
			"Kundens fødselsdato: ",
			"Kundens telefonnummer: ",
			"Alle fakturahenvendelser sendes til info@boklisten.no",
			""
		];
		this.text = {
			title: {
				rent:
					"Fakturaen gjelder manglende/for sent leverte bøker fra forrige semester hos: ",
				"partly-payment":
					"Faktura gjelder manglende betaling av andre avdrag fra forrige semester hos: "
			}
		};
		this.feeTitle = "Administrasjonsgebyr";
	}

	public async printToVismaInvoices(
		invoices: Invoice[],
		ehf: boolean
	): Promise<boolean> {
		await this.addBranchNames(invoices);
		const vismaRows = this.invoicesToVismaRows(invoices, ehf);
		this.printService.printVismaRows(vismaRows);
		return true;
	}

	public invoicesToVismaRows(invoices: Invoice[], ehf: boolean) {
		const vismaRows = [];

		for (const invoice of invoices) {
			for (const row of this.invoiceToVismaRows(invoice, ehf)) {
				vismaRows.push(row);
			}
		}

		return vismaRows;
	}

	private async addBranchNames(invoices): Promise<boolean> {
		const branches = {};

		for (const invoice of invoices) {
			if (invoice.branch) {
				let branch = branches[invoice.branch];

				if (!branch) {
					branch = await this.branchService.getById(invoice.branch);
					branches[branch.id] = branch;
				}

				invoice.customerInfo.branchName = branches[invoice.branch].name;
			}
		}
		return true;
	}

	private getMongoIdEpoch(mongoId: string): number {
		const timestamp = mongoId.substring(0, 8);
		// 1993350442166 -- mongoIdNumber
		// 770658889500 -- mongoIdNumber
		// 770658889442 -- epoch + counter
		//   1551362211 -- epoch
		return new Date(parseInt(timestamp, 16)).getTime();
	}

	private getMongoIdMiniEpoch(mongoId: string): number {
		const mongoEpoch = this.getMongoIdEpoch(mongoId);
		const shortEpoch = mongoEpoch
			.toString()
			.substring(2, mongoEpoch.toString().length);
		return parseInt(shortEpoch);
	}

	private getMongoIdCounter(mongoId: string): number {
		return parseInt(mongoId.substring(18, 24), 16);
	}

	private mongoIdToNumber(mongoId: string): number {
		const timestamp = mongoId.substring(0, 8);
		const epoch = new Date(parseInt(timestamp, 16)).getTime();
		const randomVal = parseInt(mongoId.substring(8, 18), 16);
		const counter = parseInt(mongoId.substring(18, 24), 16);
		return epoch + counter; // return epoch + randomVal + counter;
	}

	private invoiceToVismaRows(invoice: Invoice, ehf: boolean): any[] {
		const rows = [];
		let lineNum = 0;
		rows.push(this.createVismaH1Field(lineNum, invoice, ehf));

		lineNum++;

		for (const row of this.createVismaL1Fields(lineNum, invoice)) {
			rows.push(row);

			lineNum++;
		}

		if (invoice.payment.fee) {
			rows.push(this.createVismaL1FeeField(lineNum, invoice));
			lineNum++;
		}

		if (!invoice.customerInfo.organizationNumber) {
			for (const row of this.createVismaL1TextFields(lineNum, invoice)) {
				rows.push(row);
			}
		} else {
			for (const comment of invoice.comments) {
				rows.push(
					this.createVismaL1TextField(
						lineNum,
						invoice.invoiceId,
						comment.msg
					)
				);
				lineNum++;
			}
		}

		return rows;
	}

	private asEars(num: number) {
		return num * 100;
	}

	private createVismaL1Fields(lineNumber: number, invoice: Invoice): any[] {
		const rows = [];

		for (const customerItemPayment of invoice.customerItemPayments) {
			rows.push(
				this.createVismaL1Field(
					lineNumber,
					invoice.invoiceId,
					customerItemPayment
				)
			);
			lineNumber++;
		}

		return rows;
	}

	private createVismaL1TextFields(
		lineNumber: number,
		invoice: Invoice
	): any[] {
		const rows = [];
		if (
			invoice.type === undefined ||
			invoice.type === "rent" ||
			invoice.type === "loan"
		) {
			rows.push(
				this.createVismaL1TextField(
					lineNumber,
					invoice.invoiceId,
					this.text.title.rent + invoice.customerInfo.branchName
				)
			);
		} else {
			rows.push(
				this.createVismaL1TextField(
					lineNumber,
					invoice.invoiceId,
					this.text.title["partly-payment"] +
						invoice.customerInfo.branchName
				)
			);
		}

		lineNumber++;

		rows.push(
			this.createVismaL1TextField(
				lineNumber,
				invoice.invoiceId,
				this.textFields[2] +
					this.dateService.dateOnFormat(
						invoice.customerInfo.dob,
						"DD.MM.YYYY"
					)
			)
		);
		lineNumber++;
		rows.push(
			this.createVismaL1TextField(
				lineNumber,
				invoice.invoiceId,
				this.textFields[3] + invoice.customerInfo.phone
			)
		);
		lineNumber++;

		rows.push(
			this.createVismaL1TextField(
				lineNumber,
				invoice.invoiceId,
				this.textFields[4]
			)
		);
		lineNumber++;
		return rows;
	}

	private createVismaH1Field(
		lineNum: number,
		invoice: Invoice,
		ehf: boolean
	) {
		let distributionChannel = "";
		let eInvoiceCode = "";
		let eInvoiceRef = "";

		if (ehf) {
			distributionChannel = "H";
			eInvoiceCode = "EHF";
			eInvoiceRef = invoice.customerInfo.organizationNumber;
		}

		let dobOrOrganizationNumber = "";
		const customerNumber = invoice.customerInfo.userDetail
			? (invoice.customerInfo.userDetail as string)
			: invoice.customerInfo.customerNumber;

		if (invoice.customerInfo.organizationNumber) {
			dobOrOrganizationNumber = invoice.customerInfo.organizationNumber;
		} else {
			dobOrOrganizationNumber = this.dateService.dateOnFormat(
				invoice.customerInfo.dob,
				"DDMMYYYY"
			);
		}

		return [
			"H1", // 1 Record Type (M)
			lineNum, // 2 Line number (M)
			this.getMongoIdMiniEpoch(customerNumber).toString(), // 3 Customer no (M)
			invoice.customerInfo.name, // 4 'Customer name': (M)
			invoice.customerInfo.postal.address, // 5 'Address 1':
			"", // 6 'Address 2':
			invoice.customerInfo.postal.code, // 7 'Postal code': (M)
			invoice.customerInfo.postal.city, // 8 'City': (M)
			invoice.customerInfo.postal.country, // 9 'Country':
			invoice.customerInfo.phone, // 10 'Customer phone': (M)
			"", // 11 'Customer Fax':
			invoice.customerInfo.email, // 12 'Customer Email':
			this.dateService.dateOnFormat(invoice.creationTime, "DDMMYYYY"), // 13 'Invoice Date': (M)
			"", // 14 'Credit Invoice':
			invoice.invoiceId, // 15 'Invoice number': (M)
			"", // 16 'KID/ODCR':
			"", // 17 'Currency':
			"", // 18 'Exchange Rate':
			this.dateService.dateOnFormat(invoice.duedate, "DDMMYYYY"), // 19 'Invoice due date': (M)
			dobOrOrganizationNumber, // 20 'Customer organisation no':
			this.asEars(invoice.payment.total.gross), // 21 'Invoice gross amount': (M)
			this.asEars(invoice.payment.total.net), // 22 'Invoice net amunt': (M)
			this.asEars(invoice.payment.total.vat), // 23 'VAT': (M)
			invoice.payment.total.gross >= 0 ? "IN" : "CR", // 24 'Document Type': (M) IN = invoice, CR = credit nota
			"", // 25 'Order number':
			"", // 26 'Project Number':
			"", // 27 'Department/Dimension':
			invoice.customerInfo["branchName"]
				? invoice.customerInfo["branchName"]
				: invoice.ourReference, // 28 'Our reference':
			"", // 29 'Your reference':
			invoice.reference, // 30 'Reference':
			"", // 31 'Ref. 1':
			"", // 32 'Ref. 2':
			"", // 33 'Ref. 3':
			"", // 34 'Ref. 4':
			distributionChannel, // 35 'Distribution channel per invoice': P = postal, M = email, H = EHF, S = supress, Blank = default (P)
			"", // 36 'Cent rounding threshold':
			"P", // 37 'Brand':
			"", // 38 'Amount type':
			invoice.customerInfo.name, // 39 'Delivery address name':
			invoice.customerInfo.postal.address, // 40 'Delivery address 1':
			"", // 41 'Delivery address 2':
			invoice.customerInfo.postal.code, // 42 'Delivery address Postal code':
			invoice.customerInfo.postal.city, // 43 'Delivery address city':
			invoice.customerInfo.postal.country, // 44 'Delivery address country':
			"", // 45 'Rating Date':
			"", // 46 'Rating poeng':
			"", // 47 'Client ID':
			invoice.customerInfo.email, // 48 'Delivery address Email':
			"", // 49 'Postal charge':
			"", // 50 'Fees':
			"", // 51 'Discount':
			"", // 52 'Add-ons or reduction':
			"", // 53 'Set reminder flag':
			"", // 54 'Set interest flag':
			"", // 55 'Invoice address name':
			"", // 56 'Invoice address 1':
			"", // 57 'Invoice address 2':
			"", // 58 'Invoice Postal Code':
			"", // 59 'Invoice City':
			"", // 60 'Invoice Country':
			"", // 61 'Marketing message code':
			eInvoiceCode, // 62 'eInvoice code': can be 'EHF' or Blank
			eInvoiceRef, // 63 'eInvoice Reference': if eIncoiceCode is 'EHF' this is the orgNumber
			"", // 64 'VAT Code fields 49-52':
			"", // 65 'Invoice address Email':
			"", // 66 'Settlement ratio':
			"", // 67 'General ledger dimension A':
			"", // 68 'General ledger dimension B':
			"", // 69 'For future use':
			"", // 70 'Attachment':
			"" // 71 'Customer code(s)':
		];
	}

	private createVismaL1Field(
		lineNumber: number,
		invoiceNumber: string,
		customerItemPayment
	) {
		return [
			"L1", // 1 'Record type'
			lineNumber, // 2 'Line number':
			invoiceNumber, // 3 'Invoice number':
			"V", // 4 'Line type': (M)
			customerItemPayment["payment"]["vat"] <= 0 ? "FRI" : "", // 5 'VAT type': (M)
			customerItemPayment["item"]
				? this.getMongoIdCounter(customerItemPayment["item"]).toString()
				: "", // 6 'Article number':
			customerItemPayment["title"], // 7 'Article name': (M)
			customerItemPayment["numberOfItems"], // 8 'Invoiced quantity (no of units)': (M)
			customerItemPayment["payment"]["discount"], // 9 'Discount%':
			"", // 10 Currency
			this.asEars(customerItemPayment["payment"]["gross"]), // 11 Gross amount (M)
			this.asEars(customerItemPayment["payment"]["unit"]), // 12 Price per unit without VAT
			this.asEars(customerItemPayment["payment"]["net"]), // 13 Net amount (M)
			this.asEars(customerItemPayment["payment"]["vat"]), // 14 VAT amount (M)
			"", // 15 VAT code
			"", // 16 Article code
			"", // 17 Posting code
			"", // 18 numbers of accruals
			"", // 19 start accural
			"", // 20 start year
			"", // 21 volume unit descr.
			"", // 22 volume (base qunatity)
			"", // 23 unit descr.
			"", // 24 amount type
			"", // 25 for future use
			"", // 26 contact number
			"", // 27 numbers of terms
			"", // 28 contract status
			"", // 29 article group
			"", // 30 duration
			"", // 31 article group 2
			"", // 32 from date
			"", // 33 to date
			"", // 34 initial amount
			"", // 35 initial price
			"", // 36 order date
			"", // 37 general ledger, dimension A
			"", // 38 general ledger, dimension B
			"" // 39 for future use
		];
	}
	private createVismaL1FeeField(lineNum: number, invoice: Invoice): any[] {
		return [
			"L1", // 1 'Record type'
			lineNum, // 2 'Line number':
			invoice.invoiceId, // 3 'Invoice number':
			"V", // 4 'Line type': (M)
			"PLH", // 5 'VAT type': (M)
			"1000", // 6 'Article number':
			this.feeTitle, // 7 'Article name': (M)
			invoice.customerItemPayments.length, // 8 'Invoiced quantity (no of units)': (M)
			invoice.payment.total.discount, // 9 'Discount%':
			"", // 10 Currency
			this.asEars(invoice.payment.fee.gross), // 11 Gross amount (M)
			this.asEars(invoice.payment.fee.unit), // 12 Price per unit without VAT
			this.asEars(invoice.payment.fee.net), // 13 Net amount (M)
			this.asEars(invoice.payment.fee.vat), // 14 VAT amount (M)
			"", // 15 VAT code
			"", // 16 Article code
			"", // 17 Posting code
			"", // 18 numbers of accruals
			"", // 19 start accural
			"", // 20 start year
			"", // 21 volume unit descr.
			"", // 22 volume (base qunatity)
			"", // 23 unit descr.
			"", // 24 amount type
			"", // 25 for future use
			"", // 26 contact number
			"", // 27 numbers of terms
			"", // 28 contract status
			"", // 29 article group
			"", // 30 duration
			"", // 31 article group 2
			"", // 32 from date
			"", // 33 to date
			"", // 34 initial amount
			"", // 35 initial price
			"", // 36 order date
			"", // 37 general ledger, dimension A
			"", // 38 general ledger, dimension B
			"" // 39 for future use
		];
	}

	private createVismaL1TextField(
		lineNum: number,
		invoiceId: string,
		text: string
	): any[] {
		return [
			"L1", // 1 'Record type'
			lineNum, // 2 'Line number':
			invoiceId, // 3 'Invoice number':
			"K", // 4 'Line type': (M)
			"txt", // 5 'VAT type': (M)
			"", // 6 'Article number':
			text, // 7 'Article name': (M)
			"", // 8 'Invoiced quantity (no of units)': (M)
			"", // 9 'Discount%':
			"", // 10 Currency
			"", // 11 Gross amount (M)
			"", // 12 Price per unit without VAT
			"", // 13 Net amount (M)
			"", // 14 VAT amount (M)
			"", // 15 VAT code
			"", // 16 Article code
			"", // 17 Posting code
			"", // 18 numbers of accruals
			"", // 19 start accural
			"", // 20 start year
			"", // 21 volume unit descr.
			"", // 22 volume (base qunatity)
			"", // 23 unit descr.
			"", // 24 amount type
			"", // 25 for future use
			"", // 26 contact number
			"", // 27 numbers of terms
			"", // 28 contract status
			"", // 29 article group
			"", // 30 duration
			"", // 31 article group 2
			"", // 32 from date
			"", // 33 to date
			"", // 34 initial amount
			"", // 35 initial price
			"", // 36 order date
			"", // 37 general ledger, dimension A
			"", // 38 general ledger, dimension B
			"" // 39 for future use
		];
	}
}
