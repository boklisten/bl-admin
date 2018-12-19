import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TextBlock } from "@wizardcoder/bl-model";


@Component({
  selector: 'app-blc-textblock-edit',
  templateUrl: './blc-textblock-edit.component.html',
  styleUrls: ['./blc-textblock-edit.component.scss']
})
export class BlcTextblockEditComponent implements OnInit {
  @Input() textBlocks: TextBlock[];
  @Output() textBlocksChange: EventEmitter<TextBlock[]>;

  constructor() { 
    this.textBlocks = [];
    this.textBlocksChange = new EventEmitter<TextBlock[]>()
  }

  ngOnInit() {
  }

  selectTextBlockType(index, textblockType) {
    this.textBlocks[index].secondary = false;
    this.textBlocks[index].warning = false;
    this.textBlocks[index].alert = false;

    switch (textblockType) {
      case "secondary": 
        this.textBlocks[index].secondary = true;
        break;
      case "warning":
        this.textBlocks[index].warning = true;
        break;
      case "alert":
        this.textBlocks[index].alert = true;
        break;

    }

    console.log("hello", this.textBlocks[index]);
  }

  public addTextBlock() {
    this.textBlocks.push({text: ""});
  }

  public removeTextBlock(index: number) {
    this.textBlocks.splice(index, 1);
  }

}
