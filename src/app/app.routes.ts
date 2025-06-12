import { Routes } from '@angular/router';
import { ContactComponent } from './basic_component/contact/contact.component';
import { AboutComponent } from './basic_component/about/about.component';
import { ServiceComponent } from './basic_component/service/service.component';
import { HomeComponent } from './basic_component/home/home.component';
import { EditorComponent } from './editor/editor.component';


export const appRoutes: Routes = [
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component: HomeComponent },  // Now points to HomeComponent
{path : 'editor', component: EditorComponent}, // Added EditorComponent route
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'services', component: ServiceComponent },
  { path: '**', redirectTo: '/home' } // Wildcard route for 404s
];
