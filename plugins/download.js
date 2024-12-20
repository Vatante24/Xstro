import { extractUrlFromString, getBuffer } from 'xstro-utils';
import { bot } from '#lib/cmds';
import { facebook, gdrivedl, instagram, play, tiktok, twitter } from '#utils/scrapers';
import config from '../config.js';

bot(
	{
		pattern: 'facebook',
		isPublic: true,
		desc: 'Downloads Facebook Videos',
	},
	async (message, match) => {
		const input = match || message.reply_message?.text;
		if (!input) return message.send('_Invalid URL_');
		const url = extractUrlFromString(input);
		if (!url) return message.send('_Invalid URL_');
		const res = await facebook(url);
		const video = await getBuffer(res.hd_video);
		return await message.send(video);
	},
);

bot(
	{
		pattern: 'instagram',
		isPublic: true,
		desc: 'Downloads Instagram Videos',
	},
	async (message, match) => {
		const input = match || message.reply_message?.text;
		if (!input) return message.send('_Invalid URL_');
		const url = extractUrlFromString(input);
		if (!url) return message.send('_Invalid URL_');
		const res = await instagram(url);
		const video = await getBuffer(res.download_url);
		return await message.send(video);
	},
);

bot(
	{
		pattern: 'twitter',
		isPublic: true,
		desc: 'Downloads X Videos',
	},
	async (message, match) => {
		const input = match || message.reply_message?.text;
		if (!input) return message.send('_Invalid URL_');
		const url = extractUrlFromString(input);
		if (!url) return message.send('_Invalid URL_');
		const res = await twitter(url);
		const video = await getBuffer(res.downloads.url);
		return await message.send(video);
	},
);

bot(
	{
		pattern: 'tiktok',
		isPublic: true,
		desc: 'Downloads Tiktok Videos',
	},
	async (message, match) => {
		const input = match || message.reply_message?.text;
		if (!input) return message.send('_Invalid URL_');
		const url = extractUrlFromString(input);
		if (!url) return message.send('_Invalid URL_');
		const res = await tiktok(url);
		const video = await getBuffer(res.video.noWatermark);
		return await message.send(video, { caption: res.title });
	},
);

bot(
	{
		pattern: 'gdrive',
		isPublic: true,
		desc: 'Downloads Google Drive Documents',
	},
	async (message, match) => {
		const input = match || message.reply_message?.text;
		if (!input) return message.send('_Invalid URL_');
		const url = extractUrlFromString(input);
		if (!url) return message.send('_Invalid URL_');
		const res = await gdrivedl(url);
		const doc = await getBuffer(res.link);
		return await message.send(doc);
	},
);

bot(
	{
		pattern: 'play',
		isPublic: false,
		desc: 'Downloads Music from search query',
	},
	async (message, match) => {
		if (!match) return message.send('_Give me A Search Query!_');
		const msg = await message.send('*downloading*');
		const res = await play(encodeURIComponent(match.trim()));
		const { title, downloadUrl } = res;
		await msg.edit(`*${title}*\n*downloaded*`);
		await msg.react('✅');
		const audio = await getBuffer(downloadUrl);
		return await message.send(audio, {
			type: 'audio',
			contextInfo: {
				isForwarded: false,
				externalAdReply: {
					title: title,
					body: config.CAPTION,
					mediaType: 1,
					thumbnail: await getBuffer('https://avatars.githubusercontent.com/u/188756392?v=4'),
					sourceUrl: 'https://whatsapp.com/channel/0029VazuKvb7z4kbLQvbn50x',
					renderLargerThumbnail: true,
				},
			},
			quoted_type: 'new',
		});
	},
);
