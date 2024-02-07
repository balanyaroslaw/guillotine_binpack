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
        const shortSidesRotated = [];
        for (let i = 0; i < this.itemsList.length; i++) {
            for (let j = 0; j < this.freeRectList.length; j++) {
                if (this.freeRectList[j].width >= this.itemsList[i].width && this.freeRectList[j].height >= this.itemsList[i].height) {
                    shortSides.push(this.FindBestShortSide(this.itemsList[i], this.freeRectList[j]));
                }
                if (this.freeRectList[j].width >= this.RotateItem(this.itemsList[i]).width && this.freeRectList[j].height >= this.RotateItem(this.itemsList[i]).height) {
                    shortSidesRotated.push(this.FindBestShortSide(this.RotateItem(this.itemsList[i]), this.freeRectList[j]));
                }
            }
        }
        let bestShortSide = Math.min(...shortSides);
        let bestShortSideRotated = Math.min(...shortSidesRotated);
        let freeRect = new FreeRect;
        let item = { width: 0, height: 0 };
        for (let i = 0; i < this.itemsList.length; i++) {
            for (let j = 0; j < this.freeRectList.length; j++) {
                if (bestShortSideRotated <= bestShortSide) {
                    if (this.freeRectList[j].width >= this.RotateItem(this.itemsList[i]).width && this.freeRectList[j].height >= this.RotateItem(this.itemsList[i]).height) {
                        if (bestShortSideRotated === this.FindBestShortSide(this.RotateItem(this.itemsList[i]), this.freeRectList[j])) {
                            this.itemsList[i] = this.RotateItem(this.itemsList[i]);
                            freeRect = this.freeRectList[j];
                            item = this.itemsList[i];
                            if (freeRect.width >= item.width && freeRect.height >= item.height) {
                                item.x = freeRect.x + item.width;
                                item.y = freeRect.y + item.height;
                            }
                        }
                    }
                }
                if (bestShortSideRotated >= bestShortSide) {
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
        }
        this.Merge();
        this.AddItem(item);
        this.Split(item, freeRect);
        this.itemsList = this.itemsList.filter(element => { return element !== item; });
    }
    Packing() {
        for (let i = 0; i < this.itemsListLength; i++) {
            this.Insert();
        }
        console.log(this.freeRectList);
        console.log(this.packedItemsList);
        return this.packedItemsList;
    }
}
class Utility {
    RandomHEXColor() {
        const color = '#' + Math.random().toString(16).slice(-3);
        return color;
    }
}
class Visualization {
    constructor(width, height, items) {
        this.utility = new Utility;
        if (width > 0 && height > 0) {
            this.binWidth = width;
            this.binHeight = height;
        }
        if (items.length > 0) {
            this.items = items;
            this.itemsCount = items.length;
        }
    }
    CreateBin() {
        const checkBin = document.querySelector('.bin__container');
        if (!checkBin) {
            const bin = document.createElement('div');
            const body = document.querySelector('body');
            bin.classList.add("bin__container");
            bin.style.position = 'absolute';
            bin.style.width = this.binWidth.toString() + 'px';
            bin.style.height = this.binHeight.toString() + 'px';
            bin.style.borderStyle = 'solid';
            bin.style.backgroundColor = '#77B5BF';
            body.appendChild(bin);
        }
        else {
            checkBin.remove();
            const bin = document.createElement('div');
            const body = document.querySelector('body');
            bin.classList.add("bin__container");
            bin.style.position = 'absolute';
            bin.style.width = this.binWidth.toString() + 'px';
            bin.style.height = this.binHeight.toString() + 'px';
            bin.style.borderStyle = 'solid';
            bin.style.backgroundColor = '#77B5BF';
            body.appendChild(bin);
        }
    }
    CreateItem(item) {
        const colorList = [];
        const block = document.createElement('div');
        block.classList.add('block__container');
        const bin = document.querySelector('.bin__container');
        const styles = window.getComputedStyle(bin);
        block.style.position = 'absolute';
        block.style.width = item.width.toString() + 'px';
        block.style.height = item.height.toString() + 'px';
        block.style.right = (this.binWidth - item.x).toString() + 'px';
        block.style.top = (this.binHeight - item.y).toString() + 'px';
        if (!colorList.includes(this.utility.RandomHEXColor())) {
            colorList.push(this.utility.RandomHEXColor());
            block.style.backgroundColor = this.utility.RandomHEXColor();
            block.style.backgroundImage = `linear-gradient(to bottom right, ${block.style.backgroundColor}, grey)`;
        }
        bin.appendChild(block);
    }
    AddItems() {
        for (let i = 0; i < this.itemsCount; i++) {
            this.CreateItem(this.items[i]);
        }
    }
    PackingVisualization() {
        this.CreateBin();
        this.AddItems();
    }
}
class Options {
    CountItemsSettings() {
        this.itemsListLength = parseInt(document.getElementsByClassName("count-option")[0].value);
    }
    RangeItemSettings() {
        this.rangeWidth = { max: parseInt(document.getElementsByClassName("max-width")[0].value), min: parseInt(document.getElementsByClassName("min-width")[0].value) };
        this.rangeHeight = { max: parseInt(document.getElementsByClassName("max-height")[0].value), min: parseInt(document.getElementsByClassName("min-height")[0].value) };
    }
    BinSettings() {
        this.bin = { width: parseInt(document.getElementsByClassName("width-option")[0].value), height: parseInt(document.getElementsByClassName("height-option")[0].value) };
    }
    CreateRandomItem() {
        const item = { width: 0, height: 0 };
        item.width = Math.floor(Math.random() * (this.rangeWidth.max - this.rangeWidth.min)) + this.rangeWidth.min;
        item.height = Math.floor(Math.random() * (this.rangeHeight.max - this.rangeHeight.min)) + this.rangeHeight.min;
        return item;
    }
    CreateItemsList() {
        for (let i = 0; i < this.itemsListLength; i++) {
            this.items.push(this.CreateRandomItem());
        }
    }
    constructor() {
        this.items = [];
        this.CountItemsSettings();
        this.BinSettings();
        this.RangeItemSettings();
        this.CreateItemsList();
    }
    Apply() {
        const g = new Guillotine(this.bin.width, this.bin.height, this.items);
        const v = new Visualization(this.bin.width, this.bin.height, g.Packing());
        v.PackingVisualization();
    }
}
function Apply() {
    const settings = new Options;
    settings.Apply();
}
