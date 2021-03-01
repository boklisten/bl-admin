import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ItemSearchResultItemComponent } from "./item-search-result-item.component";

describe("ItemSearchResultItemComponent", () => {
	let component: ItemSearchResultItemComponent;
	let fixture: ComponentFixture<ItemSearchResultItemComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ItemSearchResultItemComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemSearchResultItemComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
