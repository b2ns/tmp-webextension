import './Popup.css';

export default () => {
  function openOptionsPage() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <div className="popup">
      <p className="popup__title">Translate</p>
      <button onClick={openOptionsPage}>Options</button>
    </div>
  );
};
