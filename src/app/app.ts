import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageViewer, NotificationComponent } from './page-viewer';
import {  } from './page-viewer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [PageViewer, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
