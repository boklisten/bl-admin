import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ItemSearchSelectComponent } from "./item-search-select.component";

describe("ItemSearchSelectComponent", () => {
	let component: ItemSearchSelectComponent;
	let fixture: ComponentFixture<ItemSearchSelectComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ItemSearchSelectComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ItemSearchSelectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
