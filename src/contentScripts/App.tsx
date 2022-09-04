import { useCallback, useRef, useState } from 'react';
import { getTranslate } from '~/apis/';
import imgIcon from '~/assets/icon-512.png';
import { DICT_HREF } from '~/constants';
import { useEventListener } from '~/hooks/';
import { stopPropagation } from '~/utils/';
import './App.css';

const TRIGGER_MAX_WIDTH = 30;
const TRIGGER_MAX_HEIGHT = 30;

interface Pos {
  x: number;
  y: number;
}

export default () => {
  const textRef = useRef('');
  const inputTextRef = useRef('');
  const [translatedText, setTranslatedText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [triggerPos, setTriggerPos] = useState({ x: 0, y: 0 });
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
      e && setErrorMsg(e.message);
    }
  };

  const reset = () => {
    if (textRef.current) {
      textRef.current = '';
      inputTextRef.current = '';
      setShow(false);
      setLoading(false);
      setTranslatedText('');
      setErrorMsg('');
    }
  };

  const onSelect = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = target;
    if (selectionStart === selectionEnd) {
      return;
    }
    inputTextRef.current = target.value.slice(selectionStart!, selectionEnd!);
    target.addEventListener(
      'blur',
      () => {
        inputTextRef.current = '';
      },
      { once: true }
    );
  };

  const onMouseup = (e: Event) => {
    if (textRef.current) {
      reset();
      return;
    }

    const { clientX, clientY } = e as MouseEvent;
    let text = inputTextRef.current.trim();
    if (!text) {
      const selection = document.getSelection();
      if (selection) {
        text = selection.toString().trim();
      }
    }
    if (!text) {
      return;
    }

    textRef.current = text;
    const pos = { x: clientX, y: clientY };
    setTriggerPos(pos);
    setPos(adjustPos(pos, TRIGGER_MAX_WIDTH, TRIGGER_MAX_HEIGHT));
    setShow(true);
  };

  useEventListener(document, 'select', onSelect, true);
  useEventListener(document, 'mouseup', onMouseup, true);

  const getTextEl = useCallback(
    (el: HTMLDivElement) => {
      if (el) {
        setPos(adjustPos(triggerPos, el.offsetWidth, el.offsetHeight));
      }
    },
    [triggerPos]
  );

  return (
    <div className="app" onMouseUp={stopPropagation}>
      <div
        className={`app__popup${show ? ' show' : ''}`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        {translatedText || errorMsg ? (
          <div ref={getTextEl} className="app__text">
            <div
              // use innerHTML here, may suffer xss attack
              dangerouslySetInnerHTML={{ __html: translatedText || errorMsg }}
            ></div>
            {translatedText && (
              <div className="app__external">
                <a
                  href={`${DICT_HREF}${encodeURIComponent(textRef.current)}`}
                  target="_blank"
                >
                  详细
                </a>
              </div>
            )}
          </div>
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

const adjustPos = (pos: Pos, itemW: number, itemH: number) => {
  const OFFSET_X = 20;
  const OFFSET_Y = 20;
  let { x, y } = pos;
  x += 10;
  y -= 1.1 * itemH;

  if (x + itemW >= window.innerWidth) {
    x = window.innerWidth - itemW - OFFSET_X;
  }
  if (y <= 0) {
    y = OFFSET_Y;
  }
  return { x, y };
};
