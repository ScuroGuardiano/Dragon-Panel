import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorPageService } from './error-page.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {

  constructor(private errorPageService: ErrorPageService) { }

  error?: any;
  subscription?: Subscription;

  ngOnInit(): void {
    this.error = this.errorPageService.getError();
    this.subscription = this.errorPageService.subscribe(error => this.error = error);
  }

  ngOnDestroy(): void {
    this.errorPageService.cleanError();
    this.subscription?.unsubscribe();
  }

  errorToString() {
    return JSON.stringify(this.error, null, 2);
  }

  get errorName() {
    return this.error?.name ?? "UKNOWN";
  }

  get at() {
    if (this.error?.status) {
      return `H77P_ST4TUS:${this.error.status}`;
    }
    return "0x1337:H01YGR41L";
  }
}
