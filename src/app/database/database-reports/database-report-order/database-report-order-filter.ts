export interface DatabaseReportOrderFilter {
	branchId?: string;
	fromDate?: Date;
	toDate?: Date;
	byCustomer?: boolean;
	orderItemNotDelivered?: boolean;
}
