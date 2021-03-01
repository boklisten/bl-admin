import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ItemSearchResultComponent } from "./item-search-result.component";

describe("ItemSearchResultComponent", () => {
	let component: ItemSearchResultComponent;
	let fixture: ComponentFixture<ItemSearchResultComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ItemSearchResultComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemSearchResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
