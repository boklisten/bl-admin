import { Component, EventEmitter, Input, Output } from "@angular/core";

const SMS_MAX_SINGLE_SEGMENT_LENGTH = 160;
const SMS_MAX_MULTIPLE_SEGMENT_LENGTH = 153;

@Component({
	selector: "app-messenger-sms-editor",
	templateUrl: "./messenger-sms-editor.component.html",
	styleUrls: ["./messenger-sms-editor.component.scss"],
})
export class MessengerSmsEditorComponent {
	@Input() messageType: string;
	@Input() mediums: { sms: boolean; email: boolean; voice: boolean };
	@Output() textContentChange: EventEmitter<string>;
	@Input() public textContent: string;
	public charCountText: string;

	constructor() {
		this.textContent = "";
		this.updateTextLength("");
		this.textContentChange = new EventEmitter<string>();
	}

	onTextChange($event: Event): void {
		const text = ($event.currentTarget as HTMLTextAreaElement).value;
		this.updateTextLength(text);
		this.textContentChange.emit(text);
	}

	private updateTextLength(text: string): void {
		const length = text.length;
		if (length <= SMS_MAX_SINGLE_SEGMENT_LENGTH) {
			const extraChars =
				length === SMS_MAX_SINGLE_SEGMENT_LENGTH
					? SMS_MAX_SINGLE_SEGMENT_LENGTH
					: length % SMS_MAX_SINGLE_SEGMENT_LENGTH;
			this.charCountText = `1 segment, ${extraChars}/${SMS_MAX_SINGLE_SEGMENT_LENGTH} til neste`;
		} else {
			const segments = Math.ceil(
				length / SMS_MAX_MULTIPLE_SEGMENT_LENGTH
			);
			const extraChars = length % SMS_MAX_MULTIPLE_SEGMENT_LENGTH;
			this.charCountText = `${segments} segmenter, ${extraChars}/${SMS_MAX_MULTIPLE_SEGMENT_LENGTH} til neste`;
		}
	}
}
