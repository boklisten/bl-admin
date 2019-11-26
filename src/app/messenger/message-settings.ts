export type MessageSettings = {
	messageType: "generic" | "match";
	messageSubtype: "none" | "partly-payment" | "rent" | "loan";
	sequenceNumber?: number;
	messageMethod: "email" | "sms" | "all";
	subject?: string;
	htmlContent?: string;
	deadline?: Date;
};
