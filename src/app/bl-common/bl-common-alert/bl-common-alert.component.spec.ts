import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlCommonAlertComponent} from './bl-common-alert.component';
import {Component, Input} from '@angular/core';

@Component({selector: 'ngb-alert', template: ''})
class NgbAlertStubComponent {
	@Input() type;

}

@Component({selector: 'fa-icon', template: ''})
class FaIconStubComponent {
	@Input() icon;
}

describe('BlCommonAlertComponent', () => {
	let component: BlCommonAlertComponent;
	let fixture: ComponentFixture<BlCommonAlertComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
				declarations: [
					BlCommonAlertComponent,
					NgbAlertStubComponent,
					FaIconStubComponent
				]
			})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BlCommonAlertComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
