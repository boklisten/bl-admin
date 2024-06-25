export interface CustomerItemFilter {
	branchIds?: string[];
	fromDate?: Date;
	toDate?: Date;
	returned?: boolean;
	buyout?: boolean;
}
