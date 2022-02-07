import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationService, NotificationStyleType } from '@swimlane/ngx-ui';
import { DomainService } from '../domain.service';
import IDNSRecord from '../interfaces/dns-record';
import { RecordValidatorService } from '../record-validator.service';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent implements OnInit {

  constructor(
    private recordValidator: RecordValidatorService,
    private domainService: DomainService,
    private notificationService: NotificationService
  ) { }

  @Input() domainName = '';
  @Input() domainId = '';
  @Output() recordAdded = new EventEmitter<void>();
  addingActive = false;
  recordName = '';
  ttl = 60; // TODO: change it later from form XD
  _recordType = ['A'];
  recordContent = '';
  RECORD_TYPES = ['A', 'AAAA', 'CNAME'];

  async addRecord() {
    if (!this.recordValidator.validateContent(this.recordType, this.recordContent)) {
      this.showValidationError();
      return;
    }
    try {
      const record = await this.domainService.addDNSRecord(this.domainId, {
        name: this.recordName,
        type: this.recordType,
        content: this.recordContent,
        ttl: this.ttl
      });

      this.recordAdded.emit();
      this.showSuccess(record);
      this.clearValues();
    }
    catch (err) {
      this.handleError(err);
    }
  }

  get recordType() {
     return this._recordType[0];
  }

  set recordType(value: string) {
     this._recordType = [value];
  }

  get recordRegex() {
    return this.recordValidator.getRegexForType(this.recordType);
  }

  ngOnInit(): void {
  }

  private showValidationError() {
    this.notificationService.create({
      title: "Validation error",
      body: `${this.recordContent} is not valid value for record type ${this.recordType}.`,
      styleType: NotificationStyleType.error
    });
  }

  private handleError(err: any) {
    console.error(err);
    this.notificationService.create({
      title: "Server returned error",
      body: `${err.message ?? 'Error doesn\'t contain message'}`,
      styleType: NotificationStyleType.error
    });
  }

  private showSuccess(record: IDNSRecord) {
    this.notificationService.create({
      title: "DNS Record created",
      body: `${record.name} [${record.type}] pointing to ${record.content} has been created.`,
      styleType: NotificationStyleType.success
    });
  }

  private clearValues() {
    this.recordName = '';
    this.recordContent = '';
  }
}
