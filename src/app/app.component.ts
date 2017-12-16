import { Component } from '@angular/core';
import { QuadProvider } from '../providers/quad/quad';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  constructor(quad: QuadProvider) {
    quad.init();
  }

}

