import {Component, Input} from '@angular/core';


@Component({selector: 'fa-icon', template: ''})
export class FaIconStubComponent {
	@Input() icon;
	@Input() size;
	@Input() spin;
}
