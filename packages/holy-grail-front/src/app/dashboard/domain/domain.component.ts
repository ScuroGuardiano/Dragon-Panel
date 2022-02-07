import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService, NotificationService, NotificationStyleType } from '@swimlane/ngx-ui';
import { DomainService } from './domain.service';
import IDNSRecord from './interfaces/dns-record';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.scss']
})
export class DomainComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private domainService: DomainService,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) { }

  domainId?: string;
  domainName?: string;
  dnsRecords: IDNSRecord[] = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.domainId = params.get('domain')!;
      this.loadDomainInformations();
    });
  }

  get pageTitle(): string {
    if (!this.domainName) {
      return 'Loading...';
    }
    return `Domain: ${this.domainName}`;
  }

  onRecordAdded() {
    this.loadDNSRecords();
  }

  editRecordHandler(record: IDNSRecord) {
    alert("If you want to edit record then delete it and create new one");
  }

  deleteRecordHandler(record: IDNSRecord) {
    this.alertService.confirm({
      title: `Deleting record`,
      content: `Do you really want to delete record ${record.name}? Long press to confirm`,
      longPress: true
    }).subscribe(confirmation => {
      if (confirmation.type === "ok") {
        this.deleteRecord(record);
      }
    });
  }

  private async deleteRecord(record: IDNSRecord) {
    await this.domainService.deleteDNSRecord(this.domainId!, record.id)
    .catch(err => {
      this.notificationService.create({
        title: "Couldn't delete DNS Record.",
        body: `DNS Record ${record.name} couldn't be deleted. Error: ${err.message}`,
        styleType: NotificationStyleType.error
      });
    });

    this.notificationService.create({
      title: "Deleted DNS Record.",
      body: `DNS Record ${record.name} has been deleted.`,
      styleType: NotificationStyleType.success
    });
    await this.loadDNSRecords();
  }

  private async loadDomainInformations() {
    this.domainService.getDomainNameById(this.domainId!)
      .then(name => this.domainName = name);

    this.loadDNSRecords();
  }

  private async loadDNSRecords() {
    this.domainService.getDNSRecords(this.domainId!)
      .then(records => this.dnsRecords = records);
  }
}
