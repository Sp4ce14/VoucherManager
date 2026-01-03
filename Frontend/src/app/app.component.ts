// Import the Component decorator from Angular's core module
import { Component } from '@angular/core';

// Define the component decorator with selector, template, and styles
@Component({
  selector: 'app-root', // The CSS selector for this component
  templateUrl: './app.component.html', // Path to the component's template
  styleUrls: ['./app.component.css'] // Path to the component's styles
})
// Export the AppComponent class
export class AppComponent {
  title = 'VoucherManager'; // The title property of the application
}
