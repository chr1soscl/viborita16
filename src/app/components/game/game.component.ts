import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, fromEvent, interval, takeUntil } from 'rxjs';
import { Square } from 'src/app/square';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy,OnInit {

  squareSize=20;
  intervalTime=500;
  isGameOver=false;
  timeLine$!:Observable<number>;
  direction:string='right';
  private keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup');
  private onDestroy$ = new Subject<void>();
  squares:Square[]=[];
  newSquare!:Square;
  observer:any;

  constructor() {
    this.squares.push(new Square(0,0,this.squareSize,'red',this.isGameOver));
    this.timeLine$ = interval(this.intervalTime).pipe(takeUntil(this.onDestroy$));
    this.keyUp$.pipe(takeUntil(this.onDestroy$));
  }

  ngOnInit(): void {
    this.newSquare=new Square(
      this.randomIntFromInterval(0,400-this.squareSize),
      this.randomIntFromInterval(0,600-this.squareSize),
      this.squareSize,'green',this.isGameOver);
    this.observer = {
      next:()=>{
        if(this.squares.length>1)
        for(let i=this.squares.length-1;i>0;i--){
          let lastX=this.squares[i-1].getPositionX();
          let lastY=this.squares[i-1].getPositionY();
          this.squares[i].setPosition(lastX,lastY);
        }
        this.squares[0].move(this.direction,this.squareSize);
        
        this.isGameOverFn(this.squares[0]);
        this.isSamePosition(this.squares[0],this.newSquare);
        //console.log(this.frontSquare.positionX,this.frontSquare.positionY);
      }
    };
    this.timeLine$.subscribe(this.observer);
    this.keyUp$.subscribe({
      next:value=>{
        console.log(value.key)
        if(value.key==='Escape') this.stop();
        if(value.key==='Enter') this.restart();
        else this.changeDirection(value.key);
      }
    });
  }

  randomIntFromInterval(min:number, max:number) { // min and max included 
    let random = Math.floor(Math.random() * (max - min + 1) + min);
    return Math.round(random/this.squareSize)*this.squareSize;
  }

  private stop(){
    this.onDestroy$.next();
    this.squares[0].setHidde(true);
  }

  private restart(){
    this.squares=[];
    this.isGameOver=false;
    this.squares.push(new Square(0,0,this.squareSize,'red',this.isGameOver));
    this.changeDirection('ArrowRight');
    this.timeLine$.subscribe(this.observer);
  }

  private isGameOverFn(square:Square){
    this.isGameOver=(
      square.getPositionX()<0 || 
      square.getPositionY()<0 || 
      square.getPositionX()>=400 || 
      square.getPositionY()>=600);
    if(this.isGameOver) this.stop();
  }

  private isSamePosition(front:Square,newSquare:Square){
    let samePosition=(
      front.getPositionX()===newSquare.getPositionX() && 
      front.getPositionY()==newSquare.getPositionY());
    if(samePosition){
      this.newSquare.setColor('red');
      this.intervalTime-=10;
      this.timeLine$ = interval(this.intervalTime).pipe(takeUntil(this.onDestroy$));
      this.timeLine$.subscribe(this.observer);
      setTimeout(()=>{
        this.squares.push(this.newSquare);
        this.newSquare = new Square(
          this.randomIntFromInterval(0,400-this.squareSize),
          this.randomIntFromInterval(0,600-this.squareSize),
          this.squareSize,'green',this.isGameOver);
      },this.intervalTime);
    }
   
  }

  private changeDirection(direction:string){
    switch ( direction ) {
      case 'ArrowRight':
          this.direction = 'right'
          break;
      case 'ArrowLeft':
          this.direction = 'left';
          break;
      case 'ArrowUp':
          this.direction = 'top';
          break;
      case 'ArrowDown':
          this.direction = 'bottom'
          break;
   }
  }

  ngOnDestroy(): void {
    this.stop();
  }

}
