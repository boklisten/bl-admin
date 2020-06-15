import { Period } from "@wizardcoder/bl-model";

export interface CartItemAction {
	action: string;
	period?: Period;
	deadline?: Date;
	age?: "new" | "used";
}
