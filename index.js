(() => {
    const synth = window.speechSynthesis;
    const speechForm = document.querySelector("form#speech");
    const voiceSelect = document.querySelector("#lang-supported");
    const voiceInput = document.querySelector("#text-input");
    const pitchInput = document.querySelector("#pitch");
    const rateInput = document.querySelector("#rate");
    let voices = [];
    function onRangeInput(rangeInput) {
        const id = rangeInput.id;
        rangeInput.addEventListener('input', function() {
            const inputValueElem = document.querySelector(`div#${id}-value`);
            inputValueElem.innerHTML = `${id.charAt(0).toUpperCase() + id.slice(1)}: ${this.value}`;
        });
    }
    function onSubmit(e) {
        e.preventDefault();
        // The chrome queue sometimes gets 'stuck' and it's useful to have a cancel command handy.
        synth.cancel();
        // submit
        const speechObj = new SpeechSynthesisUtterance();
        speechObj.voice = voices[voiceSelect.selectedOptions[0].getAttribute('data-index')];
        speechObj.text = voiceInput.value;
        speechObj.pitch = pitchInput.value;
        speechObj.rate = rateInput.value;
        speechObj.lang = voiceSelect.value;
        synth.speak(speechObj);
    }
    function onVoicesChanged() {
        voiceSelect.innerHTML = "";
        voices = synth.getVoices();
        voices.forEach((voice, index) => {
            const voiceOption = document.createElement('option');
            voiceOption.value = voice.lang;
            voiceOption.innerHTML = voice.name;
            voiceOption.setAttribute('data-index', index);
            voiceSelect.appendChild(voiceOption);
        });
        // set default language
        const defaultVoice = voices.find(voice => voice.lang === "en-US");
        if (defaultVoice) {
            voiceSelect.value = defaultVoice.lang;
        }

    }
    function App() {
        onVoicesChanged();
        synth.addEventListener('voiceschanged', onVoicesChanged);
        speechForm.addEventListener('submit', onSubmit);
        // rate and pitch setup
        const rangeInput = document.querySelectorAll("input[type=range]");
        rangeInput.forEach(onRangeInput);
    }
    App();
})();