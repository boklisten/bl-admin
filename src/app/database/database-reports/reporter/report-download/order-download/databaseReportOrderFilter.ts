import { OrderItemType } from "@boklisten/bl-model";

export interface DatabaseReportOrderFilter {
	branchId?: string;
	fromDate?: Date;
	toDate?: Date;
	byCustomer?: boolean;
	orderItemNotHandedOut?: boolean;
	includedOrderItemTypes?: OrderItemType[];
}
