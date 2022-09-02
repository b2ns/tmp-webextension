import { useRef, useState } from 'react';
import { getTranslate } from '~/apis/';
import { useEventListener } from '~/hooks/';
import './App.css';

const POPUP_MAX_WIDTH = 300;
const POPUP_MAX_HEIGHT = 200;
const BTN_MAX_WIDTH = 80;
const BTN_MAX_HEIGHT = 40;

export default () => {
  const textRef = useRef('');
  const inputTextRef = useRef('');
  const [translatedText, setTranslatedText] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTranslate = async () => {
    setLoading(true);
    try {
      const data = await getTranslate(textRef.current);
      setLoading(false);
      setTranslatedText(data || '');
    } catch (e: any) {
      setLoading(false);
      e && setTranslatedText(e.message);
    }
  };

  const reset = () => {
    textRef.current = '';
    inputTextRef.current = '';
    setShow(false);
    setLoading(false);
    setTranslatedText('');
  };

  const onSelect = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = target;
    if (selectionStart === selectionEnd) {
      return;
    }
    inputTextRef.current = target.value.slice(selectionStart!, selectionEnd!);
  };

  const onMouseup = (e: Event) => {
    if (textRef.current) {
      reset();
      return;
    }

    const { clientX, clientY } = e as MouseEvent;
    let text = '';
    const selection = document.getSelection();
    if (selection) {
      text = selection.toString();
    }
    if (!text) {
      text = inputTextRef.current;
    }
    if (!text) {
      return;
    }

    textRef.current = text;
    setPos({ x: clientX, y: clientY });
    setShow(true);
  };

  useEventListener(document, 'select', onSelect);
  useEventListener(document, 'mouseup', onMouseup);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  let x = pos.x,
    y = pos.y;
  let itemW, itemH;
  if (translatedText) {
    itemW = POPUP_MAX_WIDTH;
    itemH = POPUP_MAX_HEIGHT;
  } else {
    itemW = BTN_MAX_WIDTH;
    itemH = BTN_MAX_HEIGHT;
  }

  if (x + itemW >= window.innerWidth) {
    x = window.innerWidth - itemW - 50;
  }
  if (y - itemH <= 0) {
    y = itemH + 50;
  }

  return (
    <div className="app" onMouseUp={stopPropagation}>
      <div
        className={`app__popup${show ? ' show' : ''}`}
        style={{
          transform: `translate(calc(${x}px + 10px), calc(${y}px - 100%))`,
        }}
      >
        {translatedText ? (
          <div
            className="app__text"
            // use innerHTML here, may suffer xss attack
            dangerouslySetInnerHTML={{ __html: translatedText }}
          ></div>
        ) : (
          <button
            className="app__btn"
            onMouseEnter={fetchTranslate}
            disabled={loading}
          >
            {loading ? '翻译中...' : '翻译'}
          </button>
        )}
      </div>
    </div>
  );
};
