import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageViewer } from './page-viewer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [PageViewer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
