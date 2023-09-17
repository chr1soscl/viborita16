import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject, fromEvent, interval, takeUntil } from 'rxjs';
import { Square } from 'src/app/square';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnDestroy,OnInit,OnChanges {

  squareSize=20;
  intervalTime=300;
  isGameOver=false;
  private timeLine$:Observable<number>;
  private keyUp$:Observable<KeyboardEvent>;
  private onDestroy$ = new Subject<void>();
  timeLineSubscription:any;
  keyUpSubscription:any;
  direction:string='right';
  squares:Square[]=[];
  newSquare!:Square;
  observer:any;
  paused:boolean=true;

  @Input('snakeColor') snakeColor:string='purple';
  @Input('goalPointColor') goalPointColor:string='green';

  constructor() {
    this.timeLine$ = interval(this.intervalTime).pipe(takeUntil(this.onDestroy$));
    this.keyUp$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(takeUntil(this.onDestroy$));
  }

  ngOnInit(): void {
    this.squares.push(new Square(0,0,this.squareSize,this.snakeColor,this.isGameOver));
    this.newSquare=new Square(
      this.randomIntFromInterval(0,400-this.squareSize),
      this.randomIntFromInterval(0,600-this.squareSize),
      this.squareSize,this.goalPointColor,this.isGameOver);
    this.observer = {
      next:()=>{
        if(!this.paused){
          if(this.squares.length>1)
            for(let i=this.squares.length-1;i>0;i--){
              let lastX=this.squares[i-1].getPositionX();
              let lastY=this.squares[i-1].getPositionY();
              this.squares[i].setPosition(lastX,lastY);
            }
          this.squares[0].move(this.direction,this.squareSize);
          this.isGameOverFn(this.squares[0]);
          this.isThereCollision(this.squares[0],this.squares);
          this.isSamePosition(this.squares[0],this.newSquare);
          //console.log(this.frontSquare.positionX,this.frontSquare.positionY);
        }
      }
    };
    this.timeLineSubscription=this.timeLine$.subscribe(this.observer);
    this.keyUpSubscription=this.keyUp$.subscribe({
      next:value=>{
        //console.log(value.key)
        if(value.key==='Escape') this.stop();
        if(value.key==='Enter') this.restart();
        if(value.key===' ') this.pause();
        else this.changeDirection(value.key);
      }
    });
  }

  pause(){
    this.paused=!this.paused;
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['snakeColor']?.previousValue!==changes['snakeColor']?.currentValue)
        this.squares.forEach(square=>square.setColor(changes['snakeColor']?.currentValue));
      if(changes['goalPointColor']?.previousValue!==changes['goalPointColor']?.currentValue)
        this.newSquare?.setColor(changes['goalPointColor']?.currentValue);
  }

  randomIntFromInterval(min:number, max:number) { // min and max included 
    let random = Math.floor(Math.random() * (max - min + 1) + min);
    return Math.round(random/this.squareSize)*this.squareSize;
  }

  private stop(){
    this.squares[0].setHidde(true);
    this.onDestroy$.next();
    this.timeLineSubscription.unsubscribe();
  }

  private restart(){
    this.squares=[];
    this.isGameOver=false;
    this.squares.push(new Square(0,0,this.squareSize,this.snakeColor,this.isGameOver));
    this.changeDirection('ArrowRight');
    this.timeLineSubscription.unsubscribe();
    this.timeLineSubscription=this.timeLine$.subscribe(this.observer);
  }

  private isGameOverFn(square:Square){
    this.isGameOver=(
      square.getPositionX()<0 || 
      square.getPositionY()<0 || 
      square.getPositionX()>=400 || 
      square.getPositionY()>=600);
    if(this.isGameOver) 
      this.stop();
  }

  private isThereCollision(front:Square,squares:Square[]){
    let collision = squares.filter(
      (square,index)=>(index!==0 
        && square.getPositionX()===front.getPositionX()
        && square.getPositionY()===front.getPositionY()))?.length>0;
    if(collision){
      this.isGameOver=true;
      this.stop();
    }
        
  }

  private isSamePosition(front:Square,newSquare:Square){
    let samePosition=(
      front.getPositionX()===newSquare.getPositionX() && 
      front.getPositionY()==newSquare.getPositionY());
    if(samePosition){
      this.newSquare.setColor(this.snakeColor);
      //this.intervalTime-=1;
      // this.timeLine$ = interval(this.intervalTime).pipe(takeUntil(this.onDestroy$));
      // this.timeLine$.subscribe(this.observer);
      setTimeout(()=>{
        this.squares.push(this.newSquare);
        this.newSquare = new Square(
          this.randomIntFromInterval(0,400-this.squareSize),
          this.randomIntFromInterval(0,600-this.squareSize),
          this.squareSize,this.goalPointColor,this.isGameOver);
      },0);
    }

   
  }

  private changeDirection(direction:string){
    switch ( direction ) {
      case 'ArrowRight':
          if(this.direction!=='left')
          this.direction = 'right'
          break;
      case 'ArrowLeft':
          if(this.direction!=='right')
          this.direction = 'left';
          break;
      case 'ArrowUp':
          if(this.direction!=='bottom')
          this.direction = 'top';
          break;
      case 'ArrowDown':
          if(this.direction!=='top')
          this.direction = 'bottom'
          break;
   }
  }

  ngOnDestroy(): void {
    this.keyUpSubscription.unsubscribe();
    this.stop();
  }

}
