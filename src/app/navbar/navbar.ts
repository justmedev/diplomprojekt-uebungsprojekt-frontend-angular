import {Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from '@openng/optimus-ui/api';
import {CommonModule} from '@angular/common';
import {MenubarModule} from '@openng/optimus-ui/menubar';
import {ToastModule} from '@openng/optimus-ui/toast';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-navbar',
  template: `
    <div class="card">
      <p-toast/>
      <p-menubar [model]="items">
        <ng-template #start>
          PDF Editor
        </ng-template>
      </p-menubar>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MenubarModule, ToastModule, RouterModule],
  providers: [MessageService]
})
export class Navbar implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/']
      },
      {
        label: 'Upload',
        icon: 'pi pi-cloud-upload',
        routerLink: ['/upload']
      },
      {
        separator: true
      },
    ];
  }
}
