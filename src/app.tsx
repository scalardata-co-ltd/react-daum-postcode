import * as React from 'react';
import { PostcodeProps } from './types';

const getJSApi = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') reject({ message: 'unsupported platform' });
    // @ts-ignore
    const postcodeSDK = global.daum?.Postcode;
    if (postcodeSDK) {
      resolve(postcodeSDK);
      return;
    }

    const jsapi = document.createElement('script');
    jsapi.type = 'text/javascript';
    jsapi.src = 'https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js?autoload=false';
    const s = document.getElementsByTagName('script')[0];
    s?.parentNode?.insertBefore(jsapi, s);
    // @ts-ignore
    jsapi.onload = () => resolve(global.daum.Postcode);
    jsapi.onabort = jsapi.onerror = reject;
  });
};

const Postcode: React.FC<PostcodeProps> = ({ onSelected, jsOptions, style }) => {
  const layer = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const loadData = async () => {
      const Postcode = await getJSApi();
      new Postcode({
        ...jsOptions,
        oncomplete: onSelected,
      }).embed(layer.current);
    };
    loadData().catch(console.warn);
  }, []);
  return <div ref={layer} style={style} />;
};

export default Postcode;