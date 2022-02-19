import { Component, ComponentRef, Input, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from '@swimlane/ngx-ui';
import IProxyEntry from '../interfaces/proxy-entry';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.component.html',
  styleUrls: ['./edit-entry.component.scss']
})
export class EditEntryComponent implements OnInit {

  constructor() { }

  @Input() entry?: IProxyEntry;
  @Input() dialog?: ComponentRef<DialogComponent>;
  matcher = '';
  to = '';

  ngOnInit(): void {
    this.matcher = this.entry?.matcher ?? '';
    this.to = this.entry?.to ?? '';
  }

  cancel() {
    this.dialog?.destroy();
  }

  get valid() {
    return this.matcher && this.to;
  }
}
