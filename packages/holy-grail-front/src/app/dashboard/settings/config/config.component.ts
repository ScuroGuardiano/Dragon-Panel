import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTypes, NotificationService, NotificationStyleType } from '@swimlane/ngx-ui';
import { IAppConfig, IAppConfigSchema, IAppConfigSchemaEntry } from './config-interfaces';
import { ConfigService } from './config.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  constructor(
    private configService: ConfigService,
    private notificationService: NotificationService
  ) { }

  appConfigSchema?: IAppConfigSchema;
  InputTypes = InputTypes;
  config?: IAppConfig;
  modifiedConfig?: IAppConfig;

  onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
    return -1;
  }

  discard() {
    this.modifiedConfig = {...this.config};
  }

  async save() {
    try {
      await this.configService.saveConfig(this.modifiedConfig!);
      this.config = {...this.modifiedConfig};
      this.notificationService.create({
        title: "Configuration saved!",
        body: "Configuration has been saved to the server!",
        styleType: NotificationStyleType.success
      });
    }
    catch(err) {
      const error: any = err;
      this.notificationService.create({
        title: "Error!",
        body: `Error of type ${error.name ?? 'Uknown'} occurred while saving config. Check dev console for full details.`,
        styleType: NotificationStyleType.error
      });
      console.error(err);
    }
  }

  get hasConfigChanged() {
    if (this.config && this.modifiedConfig) {
      return Object.keys(this.config).filter(key => {
        return this.modifiedConfig![key] != this.config![key];
      }).length != 0;
    }
    return false;
  }

  async ngOnInit() {
    this.appConfigSchema = await this.configService.getConfigSchema();
    this.config = await this.configService.getConfig();
    this.modifiedConfig = {...this.config};
  }

  schemaEntryToNgxInputType(schemaEntry: IAppConfigSchemaEntry): InputTypes {
    if (schemaEntry.encrypted) {
      return InputTypes.password;
    }
    // if (schemaEntry.type && schemaEntry.type === "number") {
    //   return InputTypes.number;
    // }
    // Actually I store all config entries as string, so fuck it.
    // I will add config verification later XD I must rewrite config on backend anyways

    return InputTypes.text;
  }

}
