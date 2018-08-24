import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BlcItemAddComponent} from './blc-item-add.component';
import {FaIconStubComponent} from '../../../test/stub/fontawesome/fa-icon-stub';
import {Component, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {CartService} from '../../cart/cart.service';

@Injectable()
class CartStubService {
	onCartChange() {
		return new Observable<any>();
	}
}


describe('ItemAddComponent', () => {
	let component: BlcItemAddComponent;
	let fixture: ComponentFixture<BlcItemAddComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
				declarations: [
					BlcItemAddComponent,
					FaIconStubComponent
				],
				providers: [
					{provide: CartService, useClass: CartStubService}
				]
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
