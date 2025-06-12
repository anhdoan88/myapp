import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './basic_component/header/header.component';
import { FooterComponent } from './basic_component/footer/footer.component';

@Component({
  imports: [
  
    RouterModule,
    HeaderComponent,
    FooterComponent
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'myapp';
}
