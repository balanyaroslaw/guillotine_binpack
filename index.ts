/**Guillotine packing v.0.1*/
/**Heuristic Choices: best_shortside */
/**Split Rules: SplitShorterLeftoverAxis */
/**--------------------------------------------------------------------------------------------- */

interface IRectangle{
    x?: number;
    y?: number;
    width:number;
    height:number;
}
interface ISettings
{
    max:number;
    min:number;
}
class FreeRect implements IRectangle
{
    public x:number;
    public y:number;
    public width:number;
    public height:number;

}
class Guillotine
{
    private freeRectList:Array<IRectangle> = [];
    private itemsList:Array<IRectangle> = [];
    private packedItemsList:Array<IRectangle> = [];
    private itemsListLength:number;
    private binWidth:number;
    private binHeight:number;
    constructor (width:number, height:number, rectangles:IRectangle[])
    {
        const Rect = new FreeRect
        if(width > 0 && height  >0)
        {
            this.binWidth =width;
            this.binHeight = height;

            Rect.x = 0;
            Rect.y = 0;

            Rect.width = width;
            Rect.height = height;
            this.freeRectList.push(Rect)
        }
        if(rectangles.length>0)
        {
            this.itemsList = rectangles
            this.itemsListLength = rectangles.length
        }
    }

    public Split(item:IRectangle, freeRect:IRectangle):void
    {

        let Rect = new FreeRect
        
        Rect.width = freeRect.width - item.width
        Rect.height = item.height

        if(freeRect.width>=item.width && freeRect.height >= item.height)
        {
            Rect.x = freeRect.x! + item.width
            Rect.y = freeRect.y!;
        }

        if(Rect.width > 0 && Rect.height > 0)
        {
            if(Rect.x! <= this.binWidth && Rect.y! <= this.binHeight)
            {
                this.freeRectList.push(Rect)
            }
        }

        Rect = new FreeRect

        Rect.width = freeRect.width
        Rect.height = freeRect.height - item.height

        if(freeRect.width>=item.width && freeRect.height >= item.height)
        {
            Rect.y = freeRect.y! + item.height
            Rect.x = freeRect.x! 
        }

        if(Rect.width > 0 && Rect.height > 0)
        {
            if(Rect.x! <= this.binWidth && Rect.y! <= this.binHeight)
            {
                this.freeRectList.push(Rect)
            }
        }

        this.freeRectList = this.freeRectList.filter(element=>{return element!==freeRect})
    }


    private FindBestShortSide(item:IRectangle, freeRect:IRectangle):number
    {
        const leftoverX = Math.abs(freeRect.width - item.width)
        const leftoverY = Math.abs(freeRect.height - item.height)
        return Math.min(leftoverX, leftoverY)  
    } 

    private RotateItem(item:IRectangle):IRectangle
    {
        const newItem = {width:item.height, height:item.width}
        return newItem
    }

    private Merge():void
    {
        for(let i = 0; i < this.freeRectList.length; i++)
        {
            for(let j = i+1; j < this.freeRectList.length; j++)
            { 
                if(i!==j)
                {
                    if(this.freeRectList[i].x! === this.freeRectList[j].x! && this.freeRectList[i].y! !== this.freeRectList[j].y!)
                    {  
                        if(Math.abs(this.freeRectList[i].height - this.freeRectList[j].y!)===this.freeRectList[i].y!)
                        {
                            const freeRect:IRectangle = new FreeRect;

                            let firtsArea  = this.freeRectList[i].width * this.freeRectList[i].height
                            let secondArea = this.freeRectList[j].width * this.freeRectList[j].height
                            if(firtsArea+secondArea>firtsArea || firtsArea+secondArea>secondArea)
                            {
                                freeRect.width = this.freeRectList[i].width;
                                freeRect.height = this.freeRectList[i].height + this.freeRectList[j].height

                                freeRect.x! = this.freeRectList[i].x!
                                freeRect.y! = Math.min(this.freeRectList[i].y!,this.freeRectList[j].y!)

                                this.freeRectList = this.freeRectList.filter(freeRect=>{return freeRect!==this.freeRectList[i] && freeRect!==this.freeRectList[j]})

                                this.freeRectList.push(freeRect)
                            }
                        }
                    }
                    if(this.freeRectList[i].y! === this.freeRectList[j].y! && this.freeRectList[i].x! !== this.freeRectList[j].x!)
                    {
                        if(Math.abs(this.freeRectList[i].width - this.freeRectList[j].x!)===this.freeRectList[i].x!)
                        {
                            const freeRect:IRectangle = new FreeRect;

                            let firtsArea  = this.freeRectList[i].width * this.freeRectList[i].height
                            let secondArea = this.freeRectList[j].width * this.freeRectList[j].height
                            if(firtsArea+secondArea>firtsArea || firtsArea+secondArea>secondArea)
                            {
                                freeRect.width = this.freeRectList[i].width + this.freeRectList[j].width;
                                freeRect.height = this.freeRectList[i].height

                                freeRect.x! = Math.min(this.freeRectList[i].x!,this.freeRectList[j].x!)
                                freeRect.y! = this.freeRectList[j].y!

                                this.freeRectList = this.freeRectList.filter(freeRect=>{return freeRect!==this.freeRectList[i] && freeRect!==this.freeRectList[j]})

                                this.freeRectList.push(freeRect)
                            }
                        }
                    }

                }
                else
                {
                    continue
                }
            }
        }
    }

    private AddItem(item:IRectangle):void
    {
        const Rect:IRectangle = {x:item.x, y:item.y, width:item.width, height:item.height}
        this.packedItemsList.push(Rect)
    }

    public Insert():void
    {
        const shortSides:Array<number> = []
        const shortSidesRotated:Array<number> = []
        for(let  i = 0; i < this.itemsList.length; i++)
        {
            for(let j = 0; j < this.freeRectList.length; j++)
            {
                if(this.freeRectList[j].width>=this.itemsList[i].width && this.freeRectList[j].height>=this.itemsList[i].height)
                {
                    shortSides.push(this.FindBestShortSide(this.itemsList[i],this.freeRectList[j]))
                }
                if(this.freeRectList[j].width>=this.RotateItem(this.itemsList[i]).width && this.freeRectList[j].height>=this.RotateItem(this.itemsList[i]).height)
                {
                    shortSidesRotated.push(this.FindBestShortSide(this.RotateItem(this.itemsList[i]), this.freeRectList[j]))
                }
            }
        }
        let bestShortSide:number = Math.min(...shortSides)
        let bestShortSideRotated:number = Math.min(...shortSidesRotated)
        let freeRect:IRectangle = new FreeRect;
        let item:IRectangle = {width:0, height:0}
        
        for(let  i = 0; i < this.itemsList.length; i++)
        {
            for(let j = 0; j < this.freeRectList.length; j++)
            {
                if(bestShortSideRotated<=bestShortSide)
                {
                    if(this.freeRectList[j].width>=this.RotateItem(this.itemsList[i]).width && this.freeRectList[j].height>=this.RotateItem(this.itemsList[i]).height)
                    {
                        if(bestShortSideRotated===this.FindBestShortSide(this.RotateItem(this.itemsList[i]),this.freeRectList[j]))
                        {
                            this.itemsList[i] = this.RotateItem(this.itemsList[i])
                            freeRect = this.freeRectList[j];
                            item = this.itemsList[i];
    
                            if(freeRect.width>=item.width && freeRect.height >= item.height)
                            {
                                item.x = freeRect.x! + item.width
                                item.y = freeRect.y! + item.height
                            }
                        }
                    }
                }
                if(bestShortSideRotated>=bestShortSide)
                {
                    if(this.freeRectList[j].width>=this.itemsList[i].width && this.freeRectList[j].height>=this.itemsList[i].height)
                    {
                        if(bestShortSide===this.FindBestShortSide(this.itemsList[i],this.freeRectList[j]))
                        {
                            freeRect = this.freeRectList[j];
                            item = this.itemsList[i];
                            if(freeRect.width>=item.width && freeRect.height >= item.height)
                            {
                                item.x = freeRect.x! + item.width
                                item.y = freeRect.y! + item.height
                            }
                        }
                    }
                }
            }
        }

        this.Merge()
        
        this.AddItem(item)

        this.Split(item,freeRect)

        this.itemsList = this.itemsList.filter(element=>{return element!==item})
    }

    public Packing():Array<IRectangle>
    {
        for(let i = 0; i < this.itemsListLength; i++)
        {
            this.Insert()
        }
        console.log(this.freeRectList)
        console.log(this.packedItemsList)
        return this.packedItemsList
    }
}


class Utility
{
    public RandomHEXColor():string
    {
        const color:string = '#' + Math.random().toString(16).slice(-3)
        return color
    }
}
class Visualization
{   
    private binWidth:number;
    private binHeight:number;

    private itemsCount:number;
    private items:Array<IRectangle>;

    private utility = new Utility
    constructor(width:number, height:number, items:Array<IRectangle>)
    {
        if(width > 0 && height > 0)
        {
            this.binWidth = width;
            this.binHeight = height
        }

        if(items.length > 0)
        {
            this.items = items
            this.itemsCount = items.length
        }

    }

    private CreateBin():void
    {
        const checkBin = document.querySelector('.bin__container')
        if(!checkBin)
        {
            const bin = document.createElement('div')

            const body = document.querySelector('body')!
    
            bin.classList.add("bin__container")
    
            bin.style.position = 'absolute'
            bin.style.width = this.binWidth.toString()+'px';
            bin.style.height = this.binHeight.toString()+'px';
    
            bin.style.borderStyle = 'solid'
            bin.style.backgroundColor = '#77B5BF'
    
            body.appendChild(bin)
        }
        else
        {
            checkBin.remove()
            const bin = document.createElement('div')

            const body = document.querySelector('body')!
    
            bin.classList.add("bin__container")
    
            bin.style.position = 'absolute'
            bin.style.width = this.binWidth.toString()+'px';
            bin.style.height = this.binHeight.toString()+'px';
    
            bin.style.borderStyle = 'solid'
            bin.style.backgroundColor = '#77B5BF'
    
            body.appendChild(bin)
        }
    }

    private CreateItem(item:IRectangle):void
    {
        const colorList:Array<string> = []

        const block = document.createElement('div')
        block.classList.add('block__container')
        const bin = document.querySelector('.bin__container')!

        const styles = window.getComputedStyle(bin);

        block.style.position = 'absolute'
        block.style.width = item.width.toString() + 'px'
        block.style.height = item.height.toString() + 'px'

        block.style.right = (this.binWidth - item.x!).toString() + 'px'
        block.style.top = (this.binHeight - item.y!).toString() + 'px'
        

        if(!colorList.includes(this.utility.RandomHEXColor()))
        {
            colorList.push(this.utility.RandomHEXColor())
            block.style.backgroundColor = this.utility.RandomHEXColor()
            block.style.backgroundImage = `linear-gradient(to bottom right, ${block.style.backgroundColor}, grey)`
        }

        bin.appendChild(block)
    }

    private AddItems():void
    {
        for(let i = 0; i < this.itemsCount;i++)
        {
           this.CreateItem(this.items[i])
        }
    }

    public PackingVisualization():void
    {
        this.CreateBin()
        this.AddItems()
    }
}   

class Options
{
    private bin:IRectangle;
    
    private items:Array<IRectangle> = []
    private itemsListLength:number;

    private rangeWidth:ISettings;
    private rangeHeight:ISettings;

    private CountItemsSettings():void
    {
        this.itemsListLength = parseInt((<HTMLInputElement>document.getElementsByClassName("count-option")[0]).value)
    }

    private RangeItemSettings():void
    {
        this.rangeWidth = {max:parseInt((<HTMLInputElement>document.getElementsByClassName("max-width")[0]).value),min:parseInt((<HTMLInputElement>document.getElementsByClassName("min-width")[0]).value)}

        this.rangeHeight = {max:parseInt((<HTMLInputElement>document.getElementsByClassName("max-height")[0]).value), min:parseInt((<HTMLInputElement>document.getElementsByClassName("min-height")[0]).value)}
    }

    private BinSettings():void
    {
        this.bin = {width:parseInt((<HTMLInputElement>document.getElementsByClassName("width-option")[0]).value), height:parseInt((<HTMLInputElement>document.getElementsByClassName("height-option")[0]).value)}
    }

    private CreateRandomItem():IRectangle
    {
        const item:IRectangle = {width:0, height:0}

        item.width = Math.floor(Math.random() * (this.rangeWidth.max - this.rangeWidth.min) ) + this.rangeWidth.min;
        item.height = Math.floor(Math.random() * (this.rangeHeight.max - this.rangeHeight.min) ) + this.rangeHeight.min;

        return item;
    }

    private CreateItemsList():void
    {
        for(let i = 0; i < this.itemsListLength; i++)
        {
            this.items.push(this.CreateRandomItem())
        }
    }

    constructor()
    {
        this.CountItemsSettings()
        this.BinSettings()
        this.RangeItemSettings()
        this.CreateItemsList()
    }

    public Apply():void
    {
        const g = new Guillotine(this.bin.width, this.bin.height, this.items)
        const v = new Visualization(this.bin.width, this.bin.height, g.Packing())

        v.PackingVisualization()
    }
}
function Apply():void
{
    const settings = new Options
    settings.Apply()
}