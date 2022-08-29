import { useState } from 'react';
import { getTranslate } from '~/apis/';
import { useEventListener } from '~/hooks/';
import { nextTick } from '~/utils/';
import './App.css';

export default () => {
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const showPopup = () => {
    let text = selectedText;
    if (!text) {
      const selection = document.getSelection();
      if (selection) {
        text = selection.toString();
      }
    }
    if (!text) {
      return;
    }

    setSelectedText(text);
    setShow(true);
  };

  const fetchTranslate = async () => {
    setLoading(true);
    try {
      const data = await getTranslate(selectedText);
      setLoading(false);
      setTranslatedText(data || '');
    } catch (e: any) {
      setLoading(false);
      e && setTranslatedText(e.message);
    }
  };

  const reset = () => {
    setShow(false);
    setLoading(false);
    setSelectedText('');
    setTranslatedText('');
  };

  const onSelect = (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { selectionStart, selectionEnd } = target;
    if (selectionStart === selectionEnd) {
      return;
    }
    setSelectedText(target.value.slice(selectionStart!, selectionEnd!));
  };

  const onMouseup = (e: Event) => {
    const { clientX, clientY } = e as MouseEvent;

    setPos({
      x: clientX,
      y: clientY,
    });

    nextTick(showPopup);
  };

  useEventListener(document, 'select', onSelect);
  useEventListener(document, 'mouseup', onMouseup);
  useEventListener(document, 'mousedown', reset);

  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };

  return (
    <div
      className="app"
      onMouseUp={stopPropagation}
      onMouseDown={stopPropagation}
    >
      <div
        className={`app__popup${show ? ' show' : ''}`}
        style={{ transform: `translate(${pos.x}px, calc(${pos.y}px - 100%))` }}
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
            onClick={fetchTranslate}
            disabled={loading}
          >
            {loading ? '翻译中...' : '翻译'}
          </button>
        )}
      </div>
    </div>
  );
};
