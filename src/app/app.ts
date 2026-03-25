import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageViewer } from './page-viewer';

@Component({
  selector: 'app-root',
  imports: [PageViewer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'page-viewer';
}
