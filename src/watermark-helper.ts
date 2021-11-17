import uniqueId from "lodash/uniqueId";

export type WatermarkHelperCanvas = string | HTMLCanvasElement;

export interface ImageInfo { 
    id: string; 
    url: string, 
    img: HTMLImageElement, 
    ratio: number, 
    error?: boolean 
}

export interface WatermarkHelperOptions {
    images: string[];
    text: string;
}

export default class WatermarkHelper {
    private _canvas: HTMLCanvasElement | null = null;
    private _ctx?: CanvasRenderingContext2D | null;
    private _images: ImageInfo[] = [];
    private _text: string = '';

    constructor(canvas: WatermarkHelperCanvas, options: WatermarkHelperOptions) {
        this._canvas = this._getCanvas(canvas);
        this._ctx = this._canvas!.getContext('2d');
        const { images = [], text = '' } = options;
        this._text = text;
        this._dealImage(images).then(() => {
            this._init();
        });
    }

    private _init() {
        if (this._images.length > 0) {
            this._drawImage(this._images[0]);
        }
    }

    private _drawImage(image: ImageInfo) {
        const {img, ratio, error} = image;
        if (error) {
            this._drawErrorImage();
            return;
        }
        const {width, height} = img;
        this._ctx!.drawImage(img, 0, 0, width * ratio, height * ratio)
    }

    private _drawErrorImage() {
        const text = '图片异常！'
        // const { width } = this._ctx!.measureText(text);
        this._ctx!.fillText(text, 0, 0)
    }

    private _calcRatio(img: HTMLImageElement) {
        const  { width: imgW, height: imgH } = img;
        const { width, height } = this._canvas!;
        const wr = width / imgW, hr = height / imgH;
        return Math.min(wr, hr)
    }

    private _dealImage(images: string[]) {
        return new Promise((resolve) => {
            let count = 0;
            images.forEach(url => {
                const img = new Image();
                img.onload = () => {
                    this._images.push({
                        id: uniqueId(`${Date.now()}`),
                        url,
                        img,
                        ratio: this._calcRatio(img)
                    });
                    count ++;
                }
                img.onerror = () => {
                    this._images.push({
                        id: uniqueId(`${Date.now()}`),
                        url,
                        img,
                        ratio: 1,
                        error: true
                    });
                    count ++;
                }
                img.src = url;
            })
            const timer = setInterval(() => {
                if (count === images.length) {
                    clearInterval(timer);
                    resolve(true)
                }
            }, 300)
        })
        
    }

    private _getCanvas(canvas: WatermarkHelperCanvas): HTMLCanvasElement | null {
        let dom = null;
        if (typeof canvas === 'string') {
            const elm = document.querySelector(canvas);
            if (elm && 'getContext' in elm) {
                dom = elm as HTMLCanvasElement;
            }
        } else if (canvas instanceof HTMLCanvasElement) {
            dom = canvas as HTMLCanvasElement;
        }
        if (dom === null) {
            this._catchError('Get canvas failed!');
            return null;
        }
        return dom;
    }

    private _catchError(errorMessage: string) {
        throw new Error(errorMessage);
    }

    // addImages(images: string[]) {
    //     this._images.push(...images);
    // }
}