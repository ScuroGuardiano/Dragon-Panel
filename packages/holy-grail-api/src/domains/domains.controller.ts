import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Logger, Param, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import CreateDNSRecordDTO from './dtos/create-dns-record.dto';
import PatchDNSRecordDTO from './dtos/patch-dns-record.dto';
import UpdateDNSRecordDTO from './dtos/update-dns-record.dto';
import { DomainProviderFactory } from './services/domain-provider-factory.service';
import IDNSRecord from './services/interfaces/dns-record';
import IDomain from './services/interfaces/domain';
import { ProviderBase } from './services/providers/provider-base';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('domains')
export class DomainsController {
  constructor(private domainProviderFactory: DomainProviderFactory) {
    // Yea currently I hardcoded cloudflare but I created this Domains module
    // to be extensible, later I will add option in config to choose provider.
    this.provider = domainProviderFactory.construct("CLOUDFLARE");
  }

  private provider: ProviderBase;
  private logger = new Logger(DomainsController.name);
  
  @Get('/')
  async getDomains(): Promise<IDomain[]> {
    const domains = await this.provider.listDomains();
    return domains;
  }

  @Get('/:domain')
  async getDNSList(@Param('domain') domain: string): Promise<IDNSRecord[]> {
    const dnsRecords = await this.provider.listDNSRecords(domain);
    return dnsRecords;
  }

  @Post('/:domain')
  async createDNSRecord(@Param('domain') domain: string, @Body() recordData: CreateDNSRecordDTO): Promise<IDNSRecord> {
    const dnsRecord = await this.provider.createDNSRecord(domain, recordData);
    return dnsRecord;
  }

  @Put('/:domain/:record')
  async updateDNSRecord(
    @Param('domain') domain: string,
    @Param('record') record: string,
    @Body() recordData: UpdateDNSRecordDTO
  ): Promise<IDNSRecord> {
    const dnsRecord = await this.provider.updateDNSRecord(domain, record, recordData);
    return dnsRecord;
  }

  @Patch('/:domain/:record')
  async patchDNSRecord(
    @Param('domain') domain: string,
    @Param('record') record: string,
    @Body() recordData: PatchDNSRecordDTO
  ): Promise<IDNSRecord> {
    const dnsRecord = await this.provider.patchDNSRecord(domain, record, recordData);
    return dnsRecord;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:domain/:record')
  async deleteDNSRecord(@Param('domain') domain: string, @Param('record') record: string) {
    const success = await this.provider.deleteDNSRecord(domain, record);
    if (!success) {
      this.logger.error(`Couldn't delete dns record ${record} in domain ${domain}. Provider ${this.provider.name} returned 'false'`);
      throw new InternalServerErrorException();
    }
  }

  @Get('/verify')
  async verify() {
    try {
      const canConnect = await this.provider.canConnect();
      return {
        success: canConnect
      }
    }
    catch(err) {
      this.logger.error(err);
      throw err;
    }
  }

}
