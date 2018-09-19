import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlCommonUpdateButtonComponent} from './bl-common-update-button.component';
import {Component, Input} from '@angular/core';



@Component({selector: 'fa-icon', template: ''})
class FaIconStubComponent {
	@Input() icon;
	@Input() size;
}

describe('UpdateButtonComponent', () => {
	let component: BlCommonUpdateButtonComponent;
	let fixture: ComponentFixture<BlCommonUpdateButtonComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
				declarations: [
					BlCommonUpdateButtonComponent,
					FaIconStubComponent
				]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlCommonUpdateButtonComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
