import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private domainService: DomainService
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

  private async loadDomainInformations() {
    this.domainService.getDomainNameById(this.domainId!)
      .then(name => this.domainName = name);

    this.domainService.getDNSRecords(this.domainId!)
      .then(records => this.dnsRecords = records);
  }

}
