import {TestBed, inject} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {TokenService} from '@wizardcoder/bl-connect';
import {Router} from '@angular/router';
import {AuthLoginService} from '@wizardcoder/bl-login';

@Injectable()
class TokenStubService {

}

@Injectable()
class RouterStubService {

}

@Injectable()
class AuthLoginStubService {
	onLogin() {
		return new Observable<any>();
	}

	onLogout() {
		return new Observable<any>();
	}
}


describe('AuthService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthService,
				{provide: TokenService, useClass: TokenStubService},
				{provide: Router, useClass: RouterStubService},
				{provide: AuthLoginService, useClass: AuthLoginStubService}
			]
		});
	});

	it('should be created', inject([AuthService], (service: AuthService) => {
		expect(service).toBeTruthy();
	}));
});
