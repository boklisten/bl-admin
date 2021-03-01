import { Pipe, PipeTransform } from "@angular/core";
import { UserDetailService } from "@boklisten/bl-connect";
import { UserDetail } from "@boklisten/bl-model";

@Pipe({
	name: "customerName",
})
export class CustomerNamePipe implements PipeTransform {
	constructor(private _userDetailService: UserDetailService) {}

	transform(customerId: string): Promise<string> {
		return this._userDetailService
			.getById(customerId)
			.then((customerDetail: UserDetail) => {
				return customerDetail.name ? customerDetail.name : "<no name>";
			})
			.catch(() => {
				return "<no customer>";
			});
	}
}
