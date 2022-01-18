import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from "typeorm";
import { IAppConfig, IAppConfigSchema } from "../app-config.schema";
import cryptoJS from 'crypto-js';

@Entity()
export default class AppConfig {
    @PrimaryColumn()
    key: string;

    @Column()
    value: string;

    @Column()
    encrypted: boolean;

    static fromKeyValue(key: string, value: string, encrypted: boolean): AppConfig {
        const appConfig = new AppConfig();
        appConfig.key = key;
        appConfig.value = value;
        appConfig.encrypted = encrypted;
        return appConfig;
    }

    static fromConfigObject(config: IAppConfig, schema: IAppConfigSchema): AppConfig[] {
        const appConfigs: AppConfig[] = [];
        for (const key of Object.keys(config)) {
            const value = config[key];
            const schemaEntry = schema[key];
            if (schemaEntry) {
                const appConfig = new AppConfig();
                appConfig.key = key;
                appConfig.value = value;
                appConfig.encrypted = schemaEntry.encrypted ?? false;
                appConfigs.push(appConfig);
            }
        }
        return appConfigs;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private encryptValue() {
        if (this.encrypted) {
            this.value = this.encrypt(this.value);
        }
    }

    @AfterLoad()
    private decryptValue() {
        if (this.encrypted) {
            this.value = this.decrypt(this.value);
        }
    }

    private encrypt(value: string): string {
        return cryptoJS.AES.encrypt(value, process.env.ENCRYPTION_KEY).toString();
    }

    private decrypt(value: string): string {
        return cryptoJS.AES.decrypt(value, process.env.ENCRYPTION_KEY).toString(cryptoJS.enc.Utf8);
    }
}
