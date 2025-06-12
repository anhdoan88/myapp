import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  companyName = 'My Angular Practice';

  // Define your links
  navigationLinks = [
    { label: 'Home', route: '/home' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' }
  ];

  socialLinks = [
    { label: 'GitHub', url: 'https://github.com/anhdoan88' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/anh-%C4%91o%C3%A0n-th%E1%BA%BF-036027368/' }
  ];
}
