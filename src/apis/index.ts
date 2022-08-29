import { request } from '~/utils/';

export const getTranslate = async (text: string) => {
  const url = `https://dict.youdao.com/w/${encodeURIComponent(text)}`;
  let data = (await request(url, { raw: true })) as string;
  if (data) {
    // 没钱搞公用翻译api
    // 这里比较trick，直接硬解析有道翻译官网内容
    data = data.replace(/[\r\t\n]/g, '');
    const res = data.match(/<div[^>]*trans-container">(.*?)<\/div>/);
    if (res && res[0]) {
      return res[0];
    }
    throw new Error('未找到翻译');
  }
  throw new Error('出错了:(');
};
