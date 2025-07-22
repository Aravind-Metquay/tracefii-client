import { json, type RequestHandler } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_CLOUD_FLARE_URL } from '$env/static/public';

const CLOUD_FLARE_ENDPOINT = PUBLIC_CLOUD_FLARE_URL;

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		if (request.headers.get('Content-Type') !== 'application/json') {
			return json({ error: 'Invalid content type' }, { status: 400 });
		}

		const { file, content, customerId } = await request.json();

		if (!file || !content || !customerId) {
			return json({ error: 'Missing file, content, or customerId' }, { status: 400 });
		}

		const ext = file.name.split('.').pop();
		const key = `${uuidv4()}.${ext}`;
		const uploadUrl = `${CLOUD_FLARE_ENDPOINT}/${key}-${customerId}`;

		const base64Data = content.split(',')[1];
		if (!base64Data) throw new Error('Invalid base64 content');

		const binary = Buffer.from(base64Data, 'base64');

		try {
			const res = await fetch(uploadUrl, {
				method: 'PUT',
				headers: {
					'Content-Type': file.type
				},
				body: binary
			});

			if (!res.ok) {
				const errorText = await res.text();
				console.error('CloudFlare PUT error:', errorText);
				throw new Error(`CloudFlare upload failed: ${res.status}`);
			}

			console.log('Upload successful:', uploadUrl);
			return json({ url: uploadUrl });
		} catch (fetchError) {
			console.error('CloudFlare fetch failed:', fetchError);
			console.log('Falling back to data URL');
			const dataUrl = `data:${file.type};base64,${base64Data}`;
			return json({ url: dataUrl });
		}
	} catch (err) {
		console.error('Upload error:', err);
		return json({ error: err instanceof Error ? err.message : 'Upload failed' }, { status: 500 });
	}
};
