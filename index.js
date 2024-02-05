"use strict";
/**Guillotine packing v.0.1*/
/**Heuristic Choices: best_shortside */
/**Split Rules: SplitShorterLeftoverAxis */
/**--------------------------------------------------------------------------------------------- */
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
        if (freeRect.width >= item.width && freeRect.height >= item.height) {
            Rect.x = freeRect.x + item.width;
            Rect.y = freeRect.y;
        }
        if (Rect.width > 0 && Rect.height > 0) {
            if (Rect.x <= this.binWidth && Rect.y <= this.binHeight) {
                this.freeRectList.push(Rect);
            }
        }
        Rect = new FreeRect;
        Rect.width = freeRect.width;
        Rect.height = freeRect.height - item.height;
        if (freeRect.width >= item.width && freeRect.height >= item.height) {
            Rect.y = freeRect.y + item.height;
            Rect.x = freeRect.x;
        }
        if (Rect.width > 0 && Rect.height > 0) {
            if (Rect.x <= this.binWidth && Rect.y <= this.binHeight) {
                this.freeRectList.push(Rect);
            }
        }
        this.freeRectList = this.freeRectList.filter(element => { return element !== freeRect; });
    }
    FindBestShortSide(item, freeRect) {
        const leftoverX = Math.abs(freeRect.width - item.width);
        const leftoverY = Math.abs(freeRect.height - item.height);
        return Math.min(leftoverX, leftoverY);
    }
    RotateItem(item) {
        const newItem = { width: item.height, height: item.width };
        return newItem;
    }
    Merge() {
        for (let i = 0; i < this.freeRectList.length; i++) {
            for (let j = i + 1; j < this.freeRectList.length; j++) {
                if (i !== j) {
                    if (this.freeRectList[i].x === this.freeRectList[j].x && this.freeRectList[i].y !== this.freeRectList[j].y) {
                        if (Math.abs(this.freeRectList[i].height - this.freeRectList[j].y) === this.freeRectList[i].y) {
                            const freeRect = new FreeRect;
                            let firtsArea = this.freeRectList[i].width * this.freeRectList[i].height;
                            let secondArea = this.freeRectList[j].width * this.freeRectList[j].height;
                            if (firtsArea + secondArea > firtsArea || firtsArea + secondArea > secondArea) {
                                freeRect.width = this.freeRectList[i].width;
                                freeRect.height = this.freeRectList[i].height + this.freeRectList[j].height;
                                freeRect.x = this.freeRectList[i].x;
                                freeRect.y = Math.min(this.freeRectList[i].y, this.freeRectList[j].y);
                                this.freeRectList = this.freeRectList.filter(freeRect => { return freeRect !== this.freeRectList[i] && freeRect !== this.freeRectList[j]; });
                                this.freeRectList.push(freeRect);
                            }
                        }
                    }
                    if (this.freeRectList[i].y === this.freeRectList[j].y && this.freeRectList[i].x !== this.freeRectList[j].x) {
                        if (Math.abs(this.freeRectList[i].width - this.freeRectList[j].x) === this.freeRectList[i].x) {
                            const freeRect = new FreeRect;
                            let firtsArea = this.freeRectList[i].width * this.freeRectList[i].height;
                            let secondArea = this.freeRectList[j].width * this.freeRectList[j].height;
                            if (firtsArea + secondArea > firtsArea || firtsArea + secondArea > secondArea) {
                                freeRect.width = this.freeRectList[i].width + this.freeRectList[j].width;
                                freeRect.height = this.freeRectList[i].height;
                                freeRect.x = Math.min(this.freeRectList[i].x, this.freeRectList[j].x);
                                freeRect.y = this.freeRectList[j].y;
                                this.freeRectList = this.freeRectList.filter(freeRect => { return freeRect !== this.freeRectList[i] && freeRect !== this.freeRectList[j]; });
                                this.freeRectList.push(freeRect);
                            }
                        }
                    }
                }
                else {
                    continue;
                }
            }
        }
    }
    AddItem(item) {
        const Rect = { x: item.x, y: item.y, width: item.width, height: item.height };
        this.packedItemsList.push(Rect);
    }
    Insert() {
        const shortSides = [];
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
                if (this.freeRectList[j].width >= this.itemsList[i].width && this.freeRectList[j].height >= this.itemsList[i].height) {
                    if (bestShortSide === this.FindBestShortSide(this.itemsList[i], this.freeRectList[j])) {
                        freeRect = this.freeRectList[j];
                        item = this.itemsList[i];
                        if (freeRect.width >= item.width && freeRect.height >= item.height) {
                            item.x = freeRect.x + item.width;
                            item.y = freeRect.y + item.height;
                        }
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
    { width: 200, height: 50 },
    { width: 100, height: 60 }
];
const g = new Guillotine(700, 500, r);
g.testPack();
