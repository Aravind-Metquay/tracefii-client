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

// Extended interface for custom textbox properties
interface CustomTextbox extends fabric.Textbox {
	customType?: string;
	customDateValue?: string;
	customDateFormat?: string;
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
	}) as CustomTextbox;

	// Add custom properties safely
	dateText.customType = 'date';
	dateText.customDateValue = now.toISOString();
	dateText.customDateFormat = format;

	return dateText;
}

export async function createFabricImage(source: string): Promise<fabric.Image> {
	try {
		// Check fabric.js version and use appropriate method
		const createImage = (fabric as any).FabricImage?.fromURL || fabric.Image.fromURL;

		const img = await createImage(source, {
			crossOrigin: 'anonymous'
		});

		img.set({
			left: 100,
			top: 100,
			scaleX: 0.5,
			scaleY: 0.5
		});

		return img;
	} catch (error) {
		console.error('Error creating fabric image:', error);
		throw error;
	}
}

export async function createFabricQRCode(
	value: string = 'https://example.com'
): Promise<fabric.Image> {
	try {
		const dataUrl = await QRCode.toDataURL(value, {
			errorCorrectionLevel: 'high',
			width: 100
		});

		// Check fabric.js version and use appropriate method
		const createImage = (fabric as any).FabricImage?.fromURL || fabric.Image.fromURL;

		const img = await createImage(dataUrl, {
			crossOrigin: 'anonymous'
		});

		img.set({
			left: 100,
			top: 100
		});

		// Add custom data safely
		(img as any).data = {
			type: 'QR Code',
			value: value,
			errorCorrectionLevel: 'high'
		};

		return img;
	} catch (error) {
		console.error('Error creating QR code:', error);
		throw error;
	}
}

export async function createFabricBarcode(value: string = 'BAR123456'): Promise<fabric.Image> {
	try {
		const canvas = document.createElement('canvas');

		JsBarcode(canvas, value, {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: false
		});

		const dataUrl = canvas.toDataURL();

		// Check fabric.js version and use appropriate method
		const createImage = (fabric as any).FabricImage?.fromURL || fabric.Image.fromURL;

		const img = await createImage(dataUrl, {
			crossOrigin: 'anonymous'
		});

		img.set({
			left: 100,
			top: 100
		});

		// Add custom data safely
		(img as any).data = {
			type: 'Barcode',
			value: value,
			format: 'CODE128'
		};

		return img;
	} catch (error) {
		console.error('Error creating barcode:', error);
		throw error;
	}
}
