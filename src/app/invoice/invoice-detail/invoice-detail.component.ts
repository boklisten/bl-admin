import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from "@wizardcoder/bl-model";
import { InvoiceService } from "@wizardcoder/bl-connect";
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss']
})
export class InvoiceDetailComponent implements OnInit {
  public invoice: Invoice;

  constructor(private invoiceService: InvoiceService, private route: ActivatedRoute ) {

  }

  ngOnInit() {

		this.route.params.subscribe((params: Params) => {
			const currentId = params['id'];

      this.invoiceService.getById(currentId).then((invoice) => {
        this.invoice = invoice as any;
      });
		});
  }

}
