import * as fabric from 'fabric';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import moment from 'moment';

interface TextOptions {
	left?: number;
	top?: number;
	fontSize?: number;
	fontFamily?: string;
	fill?: string;
	[key: string]: any;
}

// Extend Textbox to include custom properties
interface CustomTextbox extends fabric.Textbox {
	customType?: string;
	customDateValue?: string;
	customDateFormat?: string;
}

export function createFabricText(text: string, options: TextOptions = {}) {
	return new fabric.Textbox(text, {
		left: 100,
		top: 100,
		fontSize: 32,
		fontFamily: 'Arial',
		fill: '#000000',
		...options
	});
}

export function createFabricDate(format: string = 'MM/DD/YYYY') {
	const now = new Date();
	const dateText = new fabric.Textbox(moment(now).format(format), {
		left: 100,
		top: 100,
		fontSize: 32,
		fontFamily: 'Arial',
		fill: '#000000'
	}) as CustomTextbox;

	dateText.customType = 'date';
	dateText.customDateValue = now.toISOString();
	dateText.customDateFormat = format;

	return dateText;
}

export async function createFabricImage(source: string) {
	return new Promise<fabric.Image>((resolve) => {
		fabric.Image.fromURL(source, { crossOrigin: 'anonymous' }).then((img: fabric.Image) => {
			img.set({
				left: 100,
				top: 100,
				scaleX: 0.5,
				scaleY: 0.5
			});
			resolve(img);
		});
	});
}

export async function createFabricQRCode(value: string = 'https://example.com') {
	try {
		const dataUrl = await QRCode.toDataURL(value, {
			errorCorrectionLevel: 'high',
			width: 100
		});

		return fabric.Image.fromURL(dataUrl).then((img: fabric.Image) => {
			img.set({
				left: 100,
				top: 100,
				data: {
					type: 'QR Code',
					value: value,
					errorCorrectionLevel: 'high'
				}
			});
			return img;
		});
	} catch (error) {
		console.error('Error creating QR code:', error);
		throw error;
	}
}

export async function createFabricBarcode(value: string = 'BAR123456') {
	const canvas = document.createElement('canvas');

	try {
		JsBarcode(canvas, value, {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: false
		});

		const dataUrl = canvas.toDataURL();

		return fabric.Image.fromURL(dataUrl).then((img: fabric.Image) => {
			img.set({
				left: 100,
				top: 100,
				data: {
					type: 'Barcode',
					value: value,
					format: 'CODE128'
				}
			});
			return img;
		});
	} catch (error) {
		console.error('Error creating barcode:', error);
		throw error;
	}
}
