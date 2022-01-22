import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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
      children: [
        {
          name: "scuroguardiano.net",
          route: "domain/scuroguardiano.net"
        },
        {
          name: "darkentity.net",
          route: "domain/darkentity.net"
        }
      ]
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
    return this.navExpanded ? "Holy Grail" : "HG";
  }

  trackByName(_index: number, item: any): string {
    return item.name;
  }

  ngOnInit(): void {
  }

}
