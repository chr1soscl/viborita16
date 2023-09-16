export class Square{
    
    private positionX:number;
    private positionY:number;
    private squareSize:number=10;
    private color:string='red';
    private hidden:boolean=false;

    constructor(x:number,y:number,squareSize:number,color:string,hidden:boolean){
        this.positionX=x;
        this.positionY=y;
        this.squareSize=squareSize;
        this.color=color;
        this.hidden=hidden;
    }

    public move(direction:string,size:number){
        switch ( direction ) {
            case 'right':
                this.positionX = this.positionX + size;
                break;
            case 'left':
                this.positionX = this.positionX - size;
                break;
            case 'top':
                this.positionY = this.positionY - size;
                break;
            case 'bottom':
                this.positionY = this.positionY + size;
                break;
         }
    }

    public setHidde(hidden:boolean){
        this.hidden=hidden;
    }

    public getPositionX(){
        return this.positionX;
    }

    public getPositionY(){
        return this.positionY;
    }

    public getHidden(){
        return this.hidden;
    }

    public getColor(){
        return this.color;
    }

    public setColor(color:string){
        this.color=color;
    }

    public getSize(){
        return this.squareSize;
    }

    public setPosition(x:number,y:number){
        this.positionX=x;
        this.positionY=y;
    }

}