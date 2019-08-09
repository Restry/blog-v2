/* eslint no-useless-escape:0 import/prefer-default-export:0 */
import moment from 'moment';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

export function showTime(time: string, level = 4) {
  const mTime = moment(time);
  const diffSeconds = moment().diff(mTime, 's');
  const u = ['年', '个月', '星期', '天', '小时', '分钟', '秒'];
  const t = [31536000, 2592000, 604800, 86400, 3600, 60, 1];

  if (diffSeconds > t[level]) {
    if (moment().year() === mTime.year()) {
      return mTime.format('MM-DD HH:mm');
    }

    return mTime.format('YYYY-MM-DD HH:mm');
  }

  for (let i = 1; i <= 6; i++) {
    // eslint-disable-line
    const inm = Math.floor(diffSeconds / t[i]);

    if (inm !== 0) {
      return `${inm}${u[i]}前`;
    }
  }

  return time;
}

const dynamicLoaded: string[] = [];

export function dynamicLoad(srcs: string | string[]): Promise<any> {
  const srcList = Array.isArray(srcs) ? srcs : srcs.split(/\s+/);
  return Promise.all(
    srcList.map(src => {
      if (!dynamicLoaded[src]) {
        dynamicLoaded[src] = new Promise((resolve, reject) => {
          if (src.indexOf('.css') > 0) {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = src;
            style.onload = e => resolve(e);
            style.onerror = e => reject(e);
            document.head && document.head.appendChild(style);
          } else {
            const script = document.createElement('script');
            script.async = true;
            script.src = src;
            script.onload = e => resolve(e);
            script.onerror = e => reject(e);
            document.head && document.head.appendChild(script);
          }
        });
      }

      return dynamicLoaded[src];
    }),
  );
}

export function randomString(len: number) {
  const text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const rdmIndex = (text: string) => Math.random() * text.length || 0;

  let rdmString = '';

  while (rdmString.length < len) {
    rdmString += text.charAt(rdmIndex(text));
  }

  return rdmString;
}
