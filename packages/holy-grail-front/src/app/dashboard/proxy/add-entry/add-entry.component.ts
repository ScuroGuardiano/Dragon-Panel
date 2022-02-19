import { Component, ComponentRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogComponent, DialogService, NotificationService, NotificationStyleType } from '@swimlane/ngx-ui';
import { ProxyService } from '../proxy.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.component.html',
  styleUrls: ['./add-entry.component.scss']
})
export class AddEntryComponent implements OnInit {

  @ViewChild('newEntryTmpl') tmpl?: TemplateRef<any>;

  constructor(
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private proxyService: ProxyService
  ) { }

  ngOnInit(): void {
  }

  get valid() {
    return this.matcher && this.to;
  }

  matcher: string = '';
  to: string = '';
  dialog?: ComponentRef<DialogComponent>;

  newEntry() {
    this.dialog = this.dialogService.create({ title: "Add new proxy entry", template: this.tmpl });
  }

  async addEntry() {
    const proxyEntry = await this.proxyService.addProxyEntry(this.matcher, this.to)
    .catch(err => {
      this.notificationService.create({
        title: "Error while adding entry",
        body: err.message ?? "uknown error"
      })
    });

    if (proxyEntry) {
      this.notificationService.create({
        title: "Entry added successfully",
        body: `Entry ${this.matcher} -> ${this.to} was added successfully.`,
        styleType: NotificationStyleType.success
      });

      this.matcher = '';
      this.to = '';
      this.dialog?.destroy();
      return;
    }

    this.notificationService.create({
      title: "Error while adding entry",
      body: "uknown error"
    })
  }
}
