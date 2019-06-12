import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges
} from "@angular/core";

@Component({
	selector: "app-messenger-sequence-picker",
	templateUrl: "./messenger-sequence-picker.component.html",
	styleUrls: ["./messenger-sequence-picker.component.scss"]
})
export class MessengerSequencePickerComponent implements OnInit, OnChanges {
	@Input() messageType: string;
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
				this.sequences = [0, 1];
				break;
			case "rent":
				this.sequences = [0, 1];
				break;
			case "loan":
				this.sequences = [0];
				break;
			default:
				this.sequences = [0];
		}
		this.selectSequence(this.sequences[0]);
	}

	public selectSequence(sequence: number) {
		this.sequencePicked.emit(sequence);
	}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.messageType) {
			this.setSequences();
		}
	}
}
