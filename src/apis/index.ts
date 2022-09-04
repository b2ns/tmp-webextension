import { TRANSLATE_HREF, YOUDAO_ORIGIN } from '~/constants/';
import { request } from '~/utils/';

export const getTranslate = async (text: string) => {
  const url = `${TRANSLATE_HREF}/${encodeURIComponent(text)}`;
  let data = (await request(url, { raw: true })) as string;
  if (data) {
    // 没钱搞公用翻译api
    // 这里比较trick，直接硬解析有道翻译官网内容
    data = data.replace(/[\r\t\n]/g, '');
    const res = data.match(/<div[^>]*trans-container">(.*?)<\/div>/);
    if (res && res[0]) {
      let html = res[0];
      html = html.replaceAll('f.youdao', 'fanyi.youdao');
      html = html.replace(/href="(.+?)"/g, (_, p1) => {
        return `target="_blank" href="${
          p1.startsWith('http')
            ? ''
            : YOUDAO_ORIGIN + (p1.startsWith('/') ? '' : '/')
        }${p1}"`;
      });
      return html;
    }
    throw new Error('未找到翻译!');
  }
  throw new Error('出错了:(');
};
