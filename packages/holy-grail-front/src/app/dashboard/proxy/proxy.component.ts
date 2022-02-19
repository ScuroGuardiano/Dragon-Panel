import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertService, DialogService, NotificationService, NotificationStyleType } from '@swimlane/ngx-ui';
import { Observable, of, Subscription, timer } from 'rxjs';
import IProxyEntry from './interfaces/proxy-entry';
import { ProxyService } from './proxy.service';

@Component({
  selector: 'app-proxy',
  templateUrl: './proxy.component.html',
  styleUrls: ['./proxy.component.scss']
})
export class ProxyComponent implements OnInit, OnDestroy {

  constructor(
    private proxyService: ProxyService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) { }

  @ViewChild('editTmpl') editTmpl?: TemplateRef<any>;

  backend = "Caddy";
  status: "offline" | "online" = "offline";
  timer?: Subscription;
  proxyEntries?: IProxyEntry[];

  async ngOnInit(): Promise<void> {
    this.proxyAccessibilityCheckingLoop();
    this.loadProxyEntries();
  }

  ngOnDestroy(): void {
    this.timer!.unsubscribe();
  }

  deleteEntryHandler(entry: IProxyEntry) {
    this.alertService.confirm({
      title: `Deleting proxy entry`,
      content: `Do you really want to delete ${entry.matcher}? Long press to confirm`,
      longPress: true,
      closeOnEscape: true
    }).subscribe(confirmation => {
      if (confirmation.type === "ok") {
        this.deleteEntry(entry);
      }
    });
  }

  private async deleteEntry(entry: IProxyEntry) {
    await this.proxyService.deleteProxyEntry(entry.id)
    .catch(err => {
      this.notificationService.create({
        title: "Couldn't delete proxy entry.",
        body: `Proxy entry ${entry.matcher} couldn't be deleted. Error: ${err.message}`,
        styleType: NotificationStyleType.error
      });
    });

    this.notificationService.create({
      title: "Deleted proxy entry",
      body: `Proxy entry ${entry.matcher} has been deleted.`,
      styleType: NotificationStyleType.success
    });
    await this.loadProxyEntries();
  }

  async edit(entry: IProxyEntry) {
    const context: any = { entry }
    const dialog = this.dialogService.create({ template: this.editTmpl, title: `Editing ${entry.matcher}`, context });
    context.dialog = dialog;
  }

  entryStatus(entry: IProxyEntry): Observable<string> {
    if (!entry.enabled) {
      return of("disabled");
    }

    // TODO: Check entry health and return success or error
    return of("success");
  }

  async enableDisableEntry(event: Event, entry: IProxyEntry) {
    event.preventDefault();
    if (entry.enabled && await this.proxyService.disableProxyEntry(entry.id)) {
      return entry.enabled = false;
    }
    if (await this.proxyService.enableProxyEntry(entry.id)) {
      return entry.enabled = true;
    }
    return false;
  }

  private async loadProxyEntries() {
    this.proxyEntries = await this.proxyService.getProxyEntries();
  }


  // #region ================== P R O X Y   S T A T U S   C H E C K S ==================
  // Later I will add some alert or something if proxy status will go from online to offline ^^
  // TODO: Shouldn't I use https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events for this?

  private async proxyAccessibilityCheckingLoop() {
    await this.checkProxyAccessibility();
    this.timer = timer(30000).subscribe(
      () => this.proxyAccessibilityCheckingLoop()
    )
  }

  private async checkProxyAccessibility() {
    const isAccessible = await this.proxyService.isProxyAccessible();
    this.status = isAccessible ? "online" : "offline";
  }
  // #endregion ================== P R O X Y   S T A T U S   C H E C K S ==================
}
