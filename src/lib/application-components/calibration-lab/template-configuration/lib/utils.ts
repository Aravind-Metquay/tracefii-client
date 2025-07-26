import * as fabric from 'fabric';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import moment from 'moment';

// Extend fabric.Textbox for custom properties
declare module 'fabric' {
	namespace fabric {
		interface Textbox {
			customType?: string;
			customDateValue?: string;
			customDateFormat?: string;
		}
	}
}

interface TextOptions {
	left?: number;
	top?: number;
	fontSize?: number;
	fontFamily?: string;
	fill?: string;
	[key: string]: any;
}

export function createFabricText(text: string, options: TextOptions = {}): fabric.Textbox {
	return new fabric.Textbox(text, {
		left: 100,
		top: 100,
		fontSize: 32,
		fontFamily: 'Arial',
		fill: '#000000',
		...options
	});
}

export function createFabricDate(format: string = 'MM/DD/YYYY'): fabric.Textbox {
	const now = new Date();
	const dateText = new fabric.Textbox(moment(now).format(format), {
		left: 100,
		top: 100,
		fontSize: 32,
		fontFamily: 'Arial',
		fill: '#000000'
	});

	// Use type assertion to add custom properties
	(dateText as any).customType = 'date';
	(dateText as any).customDateValue = now.toISOString();
	(dateText as any).customDateFormat = format;

	return dateText;
}

export async function createFabricImage(source: string): Promise<fabric.FabricImage> {
	return new Promise<fabric.FabricImage>((resolve, reject) => {
		fabric.FabricImage.fromURL(source, {
			crossOrigin: 'anonymous'
		})
			.then((img: fabric.FabricImage) => {
				img.set({
					left: 100,
					top: 100,
					scaleX: 0.5,
					scaleY: 0.5
				});
				resolve(img);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

export async function createFabricQRCode(
	value: string = 'https://example.com'
): Promise<fabric.FabricImage> {
	try {
		const dataUrl = await QRCode.toDataURL(value, {
			errorCorrectionLevel: 'high',
			width: 100
		});

		const img = await fabric.FabricImage.fromURL(dataUrl, {
			crossOrigin: 'anonymous'
		});

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
	} catch (error) {
		console.error('Error creating QR code:', error);
		throw error;
	}
}

export async function createFabricBarcode(
	value: string = 'BAR123456'
): Promise<fabric.FabricImage> {
	const canvas = document.createElement('canvas');

	try {
		JsBarcode(canvas, value, {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: false
		});

		const dataUrl = canvas.toDataURL();

		const img = await fabric.FabricImage.fromURL(dataUrl, {
			crossOrigin: 'anonymous'
		});

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
	} catch (error) {
		console.error('Error creating barcode:', error);
		throw error;
	}
}
