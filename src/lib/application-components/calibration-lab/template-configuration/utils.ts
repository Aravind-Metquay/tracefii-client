import * as fabric from 'fabric';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import moment from 'moment';

export function createFabricText(text, options = {}) {
  return new fabric.Textbox(text, {
    left: 100,
    top: 100,
    fontSize: 32,
    fontFamily: 'Arial',
    fill: '#000000',
    ...options
  });
}

export function createFabricDate(format = 'MM/DD/YYYY') {
  const now = new Date();
  const dateText = new fabric.Textbox(moment(now).format(format), {
    left: 100,
    top: 100,
    fontSize: 32,
    fontFamily: 'Arial',
    fill: '#000000'
  });
  
  dateText.customType = 'date';
  dateText.customDateValue = now.toISOString();
  dateText.customDateFormat = format;
  
  return dateText;
}

export async function createFabricImage(source) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(source, 
      (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5
        });
        resolve(img);
      },
      { crossOrigin: 'anonymous' }
    );
  });
}

export async function createFabricQRCode(value = 'https://example.com') {
  try {
    const dataUrl = await QRCode.toDataURL(value, {
      errorCorrectionLevel: 'high',
      width: 100
    });
    
    return new Promise((resolve) => {
      fabric.Image.fromURL(dataUrl, (img) => {
        img.set({
          left: 100,
          top: 100,
          data: {
            type: 'QR Code',
            value: value,
            errorCorrectionLevel: 'high'
          }
        });
        resolve(img);
      });
    });
  } catch (error) {
    console.error('Error creating QR code:', error);
    throw error;
  }
}

export function createFabricBarcode(value = 'BAR123456') {
  const canvas = document.createElement('canvas');
  
  try {
    JsBarcode(canvas, value, {
      format: 'CODE128',
      width: 2,
      height: 50,
      displayValue: false
    });
    
    const dataUrl = canvas.toDataURL();
    
    return new Promise((resolve) => {
      fabric.Image.fromURL(dataUrl, (img) => {
        img.set({
          left: 100,
          top: 100,
          data: {
            type: 'Barcode',
            value: value,
            format: 'CODE128'
          }
        });
        resolve(img);
      });
    });
  } catch (error) {
    console.error('Error creating barcode:', error);
    throw error;
  }
}