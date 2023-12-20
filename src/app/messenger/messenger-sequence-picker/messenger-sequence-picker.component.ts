import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges,
} from "@angular/core";

@Component({
	selector: "app-messenger-sequence-picker",
	templateUrl: "./messenger-sequence-picker.component.html",
	styleUrls: ["./messenger-sequence-picker.component.scss"],
})
export class MessengerSequencePickerComponent implements OnInit, OnChanges {
	@Input() messageType: string;
	@Input() mediums: { sms: boolean; email: boolean; voice: boolean };
	@Output() sequencePicked: EventEmitter<number>;
	public sequences: number[];
	public sequence: number;

	constructor() {
		this.sequencePicked = new EventEmitter();
		this.sequence = 0;
		this.sequences = [0];
	}

	ngOnInit() {
		this.setSequences();
	}

	private setSequences() {
		switch (this.messageType) {
			case "partly-payment":
				this.sequences = [0, 1, 2, 3];
				break;
			case "rent":
				this.sequences = [0, 1, 2];
				break;
			case "loan":
				this.sequences = [0, 1, 2];
				break;
			case "match":
				this.sequences = [0, 1, 2];
				break;
			default:
				this.sequences = [0];
		}

		if (this.mediums.sms && !this.mediums.email && !this.mediums.voice) {
			this.sequences.unshift(-1);
		}

		this.selectSequence(this.sequences[0]);
	}

	public selectSequence(sequence: number) {
		this.sequence = sequence;
		this.sequencePicked.emit(sequence);
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.messageType || changes.mediums) {
			this.setSequences();
		}
	}
}
