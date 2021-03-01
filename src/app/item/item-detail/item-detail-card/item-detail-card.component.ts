import { Component, Input, OnInit } from "@angular/core";
import { Item } from "@boklisten/bl-model";

@Component({
	selector: "app-item-detail-card",
	templateUrl: "./item-detail-card.component.html",
	styleUrls: ["./item-detail-card.component.scss"],
})
export class ItemDetailCardComponent implements OnInit {
	@Input() item: Item;

	constructor() {}

	ngOnInit() {}
}
