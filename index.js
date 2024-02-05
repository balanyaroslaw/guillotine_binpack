"use strict";
/**Guillotine packing v.0.1*/
/**Heuristic Choices: best_shortside */
/**Split Rules: SplitShorterLeftoverAxis */
/**------------------------------------------------------------------------------------------------------------------------------------------ */
class FreeRect {
}
class Guillotine {
    constructor(width, height, rectangles) {
        this.freeRectList = [];
        this.itemsList = [];
        this.packedItemsList = [];
        const Rect = new FreeRect;
        if (width > 0 && height > 0) {
            this.binWidth = width;
            this.binHeight = height;
            Rect.x = 0;
            Rect.y = 0;
            Rect.width = width;
            Rect.height = height;
            this.freeRectList.push(Rect);
        }
        if (rectangles.length > 0) {
            this.itemsList = rectangles;
            this.itemsListLength = rectangles.length;
        }
    }
    Split(item, freeRect) {
        let Rect = new FreeRect;
        Rect.width = freeRect.width - item.width;
        Rect.height = item.height;
        if (freeRect.x === 0 && freeRect.y === 0) {
            Rect.x = item.width;
            Rect.y = freeRect.y;
        }
        else if (freeRect.width + item.width > this.binWidth) {
            Rect.x = this.binWidth - item.width;
            Rect.y = (this.binHeight - freeRect.height) + item.height;
        }
        else {
            Rect.y = item.height;
            Rect.x = (this.binWidth - freeRect.width) + item.width;
        }
        if (Rect.width > 0 && Rect.height > 0) {
            this.freeRectList.push(Rect);
        }
        Rect = new FreeRect;
        Rect.width = freeRect.width;
        Rect.height = freeRect.height - item.height;
        if (freeRect.width + item.width > this.binWidth && freeRect.width - item.width !== 0) {
            Rect.x = freeRect.width;
            Rect.y = (this.binHeight - freeRect.height) + freeRect.height;
        }
        else if (freeRect.width + item.width > this.binWidth) {
            Rect.y = freeRect.y - item.height;
            Rect.x = this.binWidth - freeRect.width;
        }
        else {
            Rect.y = freeRect.height;
            Rect.x = this.binWidth - freeRect.width;
        }
        if (Rect.width > 0 && Rect.height > 0) {
            this.freeRectList.push(Rect);
        }
        this.freeRectList = this.freeRectList.filter(element => { return element !== freeRect; });
    }
    FindBestShortSide(item, freeRect) {
        const leftoverX = Math.abs(freeRect.width - item.width);
        const leftoverY = Math.abs(freeRect.height - item.height);
        return Math.min(leftoverX, leftoverY);
    }
    Merge() {
        for (let i = 0; i < this.freeRectList.length; i++) {
            for (let j = 0; j < this.freeRectList.length; j++) {
                if (this.freeRectList[i].x === this.freeRectList[j].x) {
                    /*console.log(this.freeRectList[i])
                    console.log(this.freeRectList[j])*/
                }
            }
        }
    }
    AddItem(item) {
        const Rect = { x: item.x, y: item.y, width: item.width, height: item.height };
        this.packedItemsList.push(Rect);
    }
    Insert() {
        let shortSides = [];
        for (let i = 0; i < this.itemsList.length; i++) {
            for (let j = 0; j < this.freeRectList.length; j++) {
                if (this.freeRectList[j].width >= this.itemsList[i].width && this.freeRectList[j].height >= this.itemsList[i].height) {
                    shortSides.push(this.FindBestShortSide(this.itemsList[i], this.freeRectList[j]));
                }
            }
        }
        let bestShortSide = Math.min(...shortSides);
        let freeRect = new FreeRect;
        let item = { width: 0, height: 0 };
        for (let i = 0; i < this.itemsList.length; i++) {
            for (let j = 0; j < this.freeRectList.length; j++) {
                if (bestShortSide === this.FindBestShortSide(this.itemsList[i], this.freeRectList[j])) {
                    freeRect = this.freeRectList[j];
                    item = this.itemsList[i];
                    if (item.width < freeRect.width && item.height < freeRect.height && item.width + freeRect.width < this.binWidth) {
                        item.x = freeRect.x + item.width;
                        item.y = freeRect.y + item.height;
                    }
                    else if (item.width < freeRect.x && item.height < freeRect.y && item.width + freeRect.width > this.binWidth) {
                        item.x = item.width;
                        item.y = (this.binHeight - freeRect.height) + item.height;
                    }
                    else if (item.height === freeRect.height) {
                        item.x = freeRect.x - item.width;
                        item.y = freeRect.y;
                    }
                    else if (item.width === freeRect.width) {
                        item.x = freeRect.x;
                        item.y = freeRect.y - item.height;
                    }
                    else {
                        item.x = freeRect.x + item.width;
                        item.y = freeRect.y + item.height;
                    }
                }
            }
        }
        this.Merge();
        this.AddItem(item);
        this.Split(item, freeRect);
        this.itemsList = this.itemsList.filter(element => { return element !== item; });
    }
    testPack() {
        for (let i = 0; i < this.itemsListLength; i++) {
            this.Insert();
        }
        console.log(this.freeRectList);
        console.log(this.packedItemsList);
    }
}
const r = [
    { width: 250, height: 100 },
    { width: 550, height: 220 },
    { width: 100, height: 100 },
    { width: 450, height: 50 },
    { width: 50, height: 60 }
];
const g = new Guillotine(700, 500, r);
g.testPack();
