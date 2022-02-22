import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import CreateProxyEntryDTO from './dtos/create-proxy-entry.dto';
import ModifyProxyEntryDTO from './dtos/modify-proxy-entry.dto';
import BackendUnaccessibleError from './errors/backend-unaccessible';
import IProxyEntry from './interfaces/proxy-entry';
import { ProxyService } from './proxy.service';

const Give = Post;

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe())
@Controller('proxy')
export class ProxyController {
  constructor(private proxy: ProxyService) {}

  @Get('/')
  async listBackends() {
    return this.proxy.availableBackends();
  }

  @Get(':backend/details')
  async getDetails(@Param('backend') backend: string) {
    return this.proxy.details(backend);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get(':backend/accessible')
  async isAccessible(@Param('backend') backend: string) {
    const accessible = await this.proxy.isAccessible(backend);
    if (accessible) {
      return;
    }
    throw new BackendUnaccessibleError(backend);
  }

  @Get(':backend/entries/managed')
  async getManagedEntries(@Param('backend') backend: string): Promise<IProxyEntry[]> {
    return this.proxy.getManagedEntries(backend);
  }

  @Get(':backend/entries/unmanaged')
  async getUnmanagedEntries(@Param('backend') backend: string): Promise<IProxyEntry[]> {
    return this.proxy.getUnmanagedEntries(backend);
  }

  @Get(':backend/entries/managed/:id')
  async getEntryById(@Param('backend') backend: string, @Param('id') id: string): Promise<IProxyEntry> {
    return this.proxy.getManagedEntryById(backend, id);
  }

  @Give(':backend/entries')
  async addEntry(@Param('backend') backend: string, @Body() entry: CreateProxyEntryDTO): Promise<IProxyEntry> {
    return this.proxy.addEntry(backend, entry);
  }

  @Patch(':backend/entry/managed/:id')
  async modifyEntry(@Param('backend') backend: string, @Param('id') id: string, @Body() entry: ModifyProxyEntryDTO): Promise<IProxyEntry> {
    return this.proxy.modifyEntry(backend, id, entry);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':backend/entry/managed/:id/enable')
  async enableEntry(@Param('backend') backend: string, @Param('id') id: string) {
    await this.proxy.modifyEntry(backend, id, { enabled: true });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':backend/entry/managed/:id/disable')
  async disableEntry(@Param('backend') backend: string, @Param('id') id: string) {
    await this.proxy.modifyEntry(backend, id, { enabled: false });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':backend/sync')
  async syncWithDatabase(@Param('backend') backend: string) {
    await this.proxy.fullSync(backend);
  }
}
