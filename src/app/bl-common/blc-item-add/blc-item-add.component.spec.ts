import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlcItemAddComponent} from './item-add.component';

describe('ItemAddComponent', () => {
	let component: BlcItemAddComponent;
	let fixture: ComponentFixture<BlcItemAddComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
				declarations: [BlcItemAddComponent]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlcItemAddComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
