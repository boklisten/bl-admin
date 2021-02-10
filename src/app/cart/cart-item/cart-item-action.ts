import { Period } from "@boklisten/bl-model";

export interface CartItemAction {
	action: string;
	period?: Period;
	deadline?: Date;
	age?: "new" | "used";
}
