import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAppConfigSchema } from './config-interfaces';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(
    private configService: ConfigService
  ) { }

  appConfigSchema?: IAppConfigSchema;

  onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }

  async ngOnInit() {
    this.appConfigSchema = await this.configService.getConfigSchema();
  }

}
