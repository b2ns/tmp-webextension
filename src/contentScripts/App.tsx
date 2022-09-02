import { useRef, useState } from 'react';
import { getTranslate } from '~/apis/';
import imgIcon from '~/assets/icon-512.png';
import { useEventListener } from '~/hooks/';
import { stopPropagation } from '~/utils/';
import './App.css';

const POPUP_MAX_WIDTH = 300;
const POPUP_MAX_HEIGHT = 200;
const TRIGGER_MAX_WIDTH = 30;
const TRIGGER_MAX_HEIGHT = 30;

export default () => {
  const textRef = useRef('');
  const inputTextRef = useRef('');
  const [translatedText, setTranslatedText] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchTranslate = async () => {
    if (loading) {
      return;
    }
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
      text = selection.toString().trim();
    }
    if (!text) {
      text = inputTextRef.current.trim();
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

  let x = pos.x,
    y = pos.y;
  let itemW, itemH;
  if (translatedText) {
    itemW = POPUP_MAX_WIDTH;
    itemH = POPUP_MAX_HEIGHT;
  } else {
    itemW = TRIGGER_MAX_WIDTH;
    itemH = TRIGGER_MAX_HEIGHT;
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
            style={{ width: POPUP_MAX_WIDTH, height: POPUP_MAX_HEIGHT }}
            className="app__text"
            // use innerHTML here, may suffer xss attack
            dangerouslySetInnerHTML={{ __html: translatedText }}
          ></div>
        ) : (
          <img
            src={imgIcon}
            alt="icon"
            style={{ width: TRIGGER_MAX_WIDTH, height: TRIGGER_MAX_HEIGHT }}
            className={`app__trigger${loading ? ' loading' : ''}`}
            onMouseEnter={fetchTranslate}
          />
        )}
      </div>
    </div>
  );
};
