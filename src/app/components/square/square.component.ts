import { Component, Input } from '@angular/core';
import { Square } from 'src/app/square';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {

  @Input('square') square!:Square;

}
