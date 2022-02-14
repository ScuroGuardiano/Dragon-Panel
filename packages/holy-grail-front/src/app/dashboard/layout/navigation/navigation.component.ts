import { Component, OnInit } from '@angular/core';
import { DomainService } from '../../domain/domain.service';

interface INavigationTreeElementBase {
  name: string;
  expanded?: boolean;
}

interface INavigationTreeElementChild extends INavigationTreeElementBase {
  route: string;
}

interface INavigationTreeElement extends INavigationTreeElementBase {
  icon: string;
  route?: string;
  children?: INavigationTreeElementChild[]
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  constructor(private domainService: DomainService) { }

  async ngOnInit(): Promise<void> {
    const domains = await this.domainService.getDomainList();
    this.domainsRoutes.push(...domains.map(domain => {
      return {
        name: domain.name,
        route: `domain/${domain.id}`
      }
    }));
  }

  domainsRoutes: INavigationTreeElementChild[] = [];

  navExpanded = true;

  navigationTree: INavigationTreeElement[] = [
    {
      name: "Dashboard",
      icon: "dashboard-outline",
      route: "dashboard"
    },
    {
      name: "Domain",
      icon: "domain",
      route: "domain",
      children: this.domainsRoutes
    },
    {
      name: "Proxy",
      icon: "forward-arrow",
      route: "proxy"
    },
    {
      name: "Proxmox",
      icon: "server",
      route: "proxmox"
    },
    {
      name: "Settings",
      icon: "gear-small",
      route: "settings",
      children: [
        {
          name: "Config",
          route: "settings/config"
        },
        {
          name: "Users",
          route: "settings/users"
        },
        {
          name: "Permissions",
          route: "settings/permisions"
        }
      ]
    }
  ];

  get logo() {
    return this.navExpanded ? "Dragon Panel" : "DP";
  }

  trackByName(_index: number, item: any): string {
    return item.name;
  }

}
