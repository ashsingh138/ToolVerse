document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL ELEMENTS ---
    const toolModal = document.getElementById('tool-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const backendUrl ='https://toolverse-backend.onrender.com';

   
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.classList.remove('dark');
            if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    };

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    
    const cardEventMapping = {
        'calculator-card': launchCalculator,
        'spellcheck-card': launchSpellChecker,
        'translator-card': launchTranslator,
        'tts-card': launchTextToSpeech,
        'recorder-card': launchVoiceRecorder,
        'compressor-card': launchImageCompressor,
        'stopwatch-card': launchStopwatch,
        'file-transfer-card': launchFileTransfer,
        'screen-recorder-card': launchScreenRecorder,
    };

    Object.keys(cardEventMapping).forEach(id => {
        const card = document.getElementById(id);
        if (card) card.addEventListener('click', () => cardEventMapping[id]());
    });

    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target === toolModal) closeModal(); });
    
    
    function openModal(title, content) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        toolModal.style.display = 'flex';
    }

    function closeModal() {
        const videoElement = modalBody.querySelector('video');
        if (videoElement && videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
        modalBody.innerHTML = '';
        toolModal.style.display = 'none';
    }
    
    
    function launchCalculator() {
        const calculatorHTML = `
            <div class="bg-gray-800 rounded-lg p-4 shadow-xl max-w-sm mx-auto">
                <div class="bg-gray-200 dark:bg-gray-700 text-right rounded-md p-4 mb-4">
                    <div id="calculator-expression" class="text-gray-500 dark:text-gray-400 text-lg h-6 overflow-x-auto text-right"></div>
                    <div id="calculator-display" class="text-3xl text-gray-900 dark:text-white font-bold overflow-x-auto">0</div>
                </div>
                <div class="grid grid-cols-4 gap-2">
                    <button class="calc-btn bg-red-500 hover:bg-red-600 text-white text-xl p-4 rounded-md" data-value="clear">AC</button>
                    <button class="calc-btn bg-gray-600 hover:bg-gray-700 text-white text-xl p-4 rounded-md" data-value="del">DEL</button>
                    <button class="calc-btn bg-gray-600 hover:bg-gray-700 text-white text-xl p-4 rounded-md" data-value="%">%</button>
                    <button class="calc-btn bg-yellow-500 hover:bg-yellow-600 text-white text-xl p-4 rounded-md" data-value="/">÷</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="7">7</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="8">8</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="9">9</button>
                    <button class="calc-btn bg-yellow-500 hover:bg-yellow-600 text-white text-xl p-4 rounded-md" data-value="*">×</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="4">4</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="5">5</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="6">6</button>
                    <button class="calc-btn bg-yellow-500 hover:bg-yellow-600 text-white text-xl p-4 rounded-md" data-value="-">-</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="1">1</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="2">2</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="3">3</button>
                    <button class="calc-btn bg-yellow-500 hover:bg-yellow-600 text-white text-xl p-4 rounded-md" data-value="+">+</button>
                    <button class="calc-btn col-span-2 bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value="0">0</button>
                    <button class="calc-btn bg-gray-700 hover:bg-gray-900 text-white text-xl p-4 rounded-md" data-value=".">.</button>
                    <button class="calc-btn bg-green-500 hover:bg-green-600 text-white text-xl p-4 rounded-md" data-value="=">=</button>
                </div>
            </div>`;
        openModal('Calculator', calculatorHTML);

        const display = document.getElementById('calculator-display');
        const expressionDisplay = document.getElementById('calculator-expression');
        let expression = '';

        document.querySelectorAll('.calc-btn').forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                const lastChar = expression.slice(-1);

                switch (value) {
                    case 'clear':
                        expression = '';
                        display.textContent = '0';
                        expressionDisplay.textContent = '';
                        break;
                    case 'del':
                        expression = expression.slice(0, -1);
                        display.textContent = expression || '0';
                        break;
                    case '=':
                        try {
                            const evalExpression = expression.replace(/÷/g, '/').replace(/×/g, '*');
                            const result = eval(evalExpression);
                            expressionDisplay.textContent = expression + '=';
                            display.textContent = result;
                            expression = String(result);
                        } catch (e) {
                            display.textContent = 'Error';
                            expression = '';
                        }
                        break;
                    case '.':
                        if (!expression.split(/[\+\-\*\/÷%]/).pop().includes('.')) {
                            expression += value;
                            display.textContent = expression;
                        }
                        break;
                    case '+':
                    case '-':
                    case '*':
                    case '/':
                    case '%':
                    case '÷':
                    case '×':
                        if (!['+', '-', '*', '/', '%', '÷', '×'].includes(lastChar) && expression !== '') {
                            expression += value;
                            display.textContent = expression;
                        }
                        break;
                    default: // Numbers
                        if (display.textContent === '0' && value !== '0') {
                            expression = value;
                        } else {
                            expression += value;
                        }
                        display.textContent = expression;
                        break;
                }
            });
        });
    }

    
    function launchSpellChecker() {
        const spellCheckHTML = `
            <div>
                <p class="mb-4 text-gray-600 dark:text-gray-300">Enter text. We'll find mistakes and suggest corrections.</p>
                <textarea id="spellcheck-input" class="w-full h-40 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" placeholder="Type or paste text here..."></textarea>
                <button id="spellcheck-btn" class="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">Check Spelling</button>
                <div id="spellcheck-output-container" class="mt-4 hidden">
                    <h4 class="font-semibold text-lg dark:text-gray-200">Results:</h4>
                    <div id="spellcheck-output" class="mt-2 p-4 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 min-h-[50px]"></div>
                </div>
            </div>`;
        openModal('Spelling Checker', spellCheckHTML);
        
        const checkBtn = document.getElementById('spellcheck-btn');
        const inputArea = document.getElementById('spellcheck-input');
        const outputContainer = document.getElementById('spellcheck-output-container');
        const outputArea = document.getElementById('spellcheck-output');

        checkBtn.addEventListener('click', async () => {
            const text = inputArea.value;
            if (!text.trim()) {
                outputArea.textContent = 'Please enter some text to check.';
                outputContainer.classList.remove('hidden');
                return;
            }
            
            checkBtn.disabled = true;
            checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
            outputContainer.classList.remove('hidden');
            
            try {
                const response = await fetch(`${backendUrl}/spellcheck`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                const corrections = data.corrections;
                const correctionKeys = Object.keys(corrections);

                if (correctionKeys.length === 0) {
                     outputArea.innerHTML = '<div class="text-green-600 font-semibold">No spelling mistakes found!</div>';
                } else {
                    let resultsHTML = '<ul class="space-y-2">';
                    for (const word in corrections) {
                        if (corrections[word] !== word) {
                            resultsHTML += `<li class="flex items-center text-gray-800 dark:text-gray-200"><span class="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-1 rounded-md line-through">${word}</span> <i class="fas fa-arrow-right mx-3 text-gray-500"></i> <span class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-md">${corrections[word]}</span></li>`;
                        }
                    }
                    resultsHTML += '</ul>';
                    if (resultsHTML === '<ul class="space-y-2"></ul>') {
                         outputArea.innerHTML = '<div class="text-green-600 font-semibold">No spelling mistakes found!</div>';
                    } else {
                        outputArea.innerHTML = resultsHTML;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                outputArea.innerHTML = '<div class="text-red-600">Could not connect to the server. Is the Python app running?</div>';
            } finally {
                 checkBtn.disabled = false;
                 checkBtn.textContent = 'Check Spelling';
            }
        });
    }

    
    function launchTranslator() {
        const languages = { 'auto': 'Auto-Detect', 'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German', 'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese', 'ko': 'Korean', 'zh': 'Chinese', 'hi': 'Hindi', 'ar': 'Arabic' };
        const createSelectOptions = (selectedLang) => Object.entries(languages).map(([code, name]) => `<option value="${code}" ${code === selectedLang ? 'selected' : ''}>${name}</option>`).join('');
        const translatorHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                    <select id="source-lang-select" class="w-full p-2 border rounded-md mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${createSelectOptions('auto')}</select>
                    <textarea id="source-text" class="w-full h-48 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter text to translate..."></textarea>
                </div>
                <div>
                    <select id="target-lang-select" class="w-full p-2 border rounded-md mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">${createSelectOptions('es')}</select>
                    <div id="target-text-container" class="w-full h-48 p-2 border rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white overflow-y-auto"><span class="text-gray-500">Translation will appear here...</span></div>
                </div>
            </div>
            <button id="translate-btn" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Translate</button>`;
        openModal('Translator', translatorHTML);
        const translateBtn = document.getElementById('translate-btn');
        translateBtn.addEventListener('click', async () => {
            const sourceText = document.getElementById('source-text').value;
            const sourceLang = document.getElementById('source-lang-select').value;
            const targetLang = document.getElementById('target-lang-select').value;
            const targetContainer = document.getElementById('target-text-container');
            if (!sourceText.trim()) { targetContainer.textContent = 'Please enter some text.'; return; }
            translateBtn.disabled = true;
            translateBtn.textContent = 'Translating...';
            targetContainer.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            try {
                const response = await fetch(`${backendUrl}/translate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: sourceText, source_lang: sourceLang, target_lang: targetLang })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'HTTP error');
                targetContainer.textContent = data.translated_text;
            } catch (error) {
                console.error('Translation Error:', error);
                targetContainer.innerHTML = `<span class="text-red-600">Error: ${error.message}. Is the Python app running?</span>`;
            } finally {
                translateBtn.disabled = false;
                translateBtn.textContent = 'Translate';
            }
        });
    }

    function launchTextToSpeech() {
        const ttsHTML = `
            <div>
                <p class="mb-4 text-gray-600 dark:text-gray-300">Enter text and click the button to hear it spoken.</p>
                <textarea id="tts-input" class="w-full h-40 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Type or paste text here..."></textarea>
                <button id="tts-btn" class="mt-4 w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"><i class="fas fa-play mr-2"></i>Speak</button>
                <div id="tts-audio-container" class="mt-4"></div>
            </div>`;
        openModal('Text to Speech', ttsHTML);
        const speakBtn = document.getElementById('tts-btn');
        const textInput = document.getElementById('tts-input');
        const audioContainer = document.getElementById('tts-audio-container');
        speakBtn.addEventListener('click', async () => {
            const text = textInput.value;
            if (!text.trim()) { audioContainer.innerHTML = '<span class="text-red-500">Please enter some text.</span>'; return; }
            speakBtn.disabled = true;
            speakBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            audioContainer.innerHTML = '';
            try {
                const response = await fetch(`${backendUrl}/tts`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: text })
                });
                if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to generate audio'); }
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioPlayer = new Audio(audioUrl);
                audioPlayer.controls = true;
                audioPlayer.className = 'w-full';
                audioContainer.appendChild(audioPlayer);
                audioPlayer.play();
            } catch (error) {
                console.error('TTS Error:', error);
                audioContainer.innerHTML = `<span class="text-red-600">Error: ${error.message}. Is the Python app running?</span>`;
            } finally {
                speakBtn.disabled = false;
                speakBtn.innerHTML = '<i class="fas fa-play mr-2"></i>Speak';
            }
        });
    }

    function launchVoiceRecorder() {
        const recorderHTML = `
            <div class="text-center">
                <p id="recorder-status" class="mb-4 text-gray-600 dark:text-gray-300">Click the button to start recording.</p>
                <div id="recorder-timer" class="text-3xl font-mono mb-4 dark:text-white">00:00</div>
                <div class="flex justify-center space-x-4">
                    <button id="start-record-btn" class="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition shadow-lg text-lg"><i class="fas fa-microphone"></i> Start</button>
                    <button id="stop-record-btn" class="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition shadow-lg text-lg" disabled><i class="fas fa-stop"></i> Stop</button>
                </div>
                <div id="audio-playback-container" class="mt-6"></div>
            </div>`;
        openModal('Voice Recorder', recorderHTML);
        const startBtn = document.getElementById('start-record-btn');
        const stopBtn = document.getElementById('stop-record-btn');
        const statusEl = document.getElementById('recorder-status');
        const timerEl = document.getElementById('recorder-timer');
        const playbackContainer = document.getElementById('audio-playback-container');
        let mediaRecorder, audioChunks = [], timerInterval;
        const startRecording = async () => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                statusEl.textContent = 'Your browser does not support audio recording.';
                statusEl.classList.add('text-red-500'); return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    playbackContainer.innerHTML = `<h4 class="font-semibold text-lg mb-2 dark:text-white">Your Recording:</h4><audio controls class="w-full" src="${audioUrl}"></audio><a href="${audioUrl}" download="recording.wav" class="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"><i class="fas fa-download mr-2"></i>Download</a>`;
                    audioChunks = [];
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.start();
                startBtn.disabled = true; stopBtn.disabled = false;
                statusEl.innerHTML = '<span class="recording-dot inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Recording...';
                startTimer();
            } catch (err) {
                console.error("Error accessing microphone:", err);
                statusEl.textContent = 'Microphone access denied. Please allow microphone access in your browser settings.';
                statusEl.classList.add('text-red-500');
            }
        };
        const stopRecording = () => { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); startBtn.disabled = false; stopBtn.disabled = true; statusEl.textContent = 'Recording stopped.'; stopTimer(); };
        const startTimer = () => { let seconds = 0; timerEl.textContent = '00:00'; timerInterval = setInterval(() => { seconds++; const min = Math.floor(seconds / 60).toString().padStart(2, '0'); const sec = (seconds % 60).toString().padStart(2, '0'); timerEl.textContent = `${min}:${sec}`; }, 1000); };
        const stopTimer = () => { clearInterval(timerInterval); };
        startBtn.addEventListener('click', startRecording);
        stopBtn.addEventListener('click', stopRecording);
    }

    function launchImageCompressor() {
        const compressorHTML = `
            <div>
                <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer" id="compressor-dropzone">
                    <i class="fas fa-upload text-4xl text-gray-400 dark:text-gray-500 mb-2"></i><p class="dark:text-gray-300">Drag & drop an image, or click to select.</p>
                    <input type="file" id="compressor-file-input" class="hidden" accept="image/png, image/jpeg">
                </div>
                <div id="compressor-preview" class="mt-4 hidden"></div>
                <div id="compressor-settings" class="mt-4 hidden">
                    <label for="quality-slider" class="block mb-2 font-semibold dark:text-gray-200">Quality: <span id="quality-value">75</span>%</label>
                    <input type="range" id="quality-slider" min="10" max="100" value="75" class="w-full">
                </div>
                <button id="compress-btn" class="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition hidden">Compress Image</button>
                <div id="compressor-result" class="mt-4"></div>
            </div>`;
        openModal('Image Compressor', compressorHTML);
        const dropzone = document.getElementById('compressor-dropzone'), fileInput = document.getElementById('compressor-file-input'), previewEl = document.getElementById('compressor-preview'), settingsEl = document.getElementById('compressor-settings'), compressBtn = document.getElementById('compress-btn'), resultEl = document.getElementById('compressor-result'), qualitySlider = document.getElementById('quality-slider'), qualityValue = document.getElementById('quality-value');
        let uploadedFile = null;
        dropzone.onclick = () => fileInput.click();
        dropzone.ondragover = e => e.preventDefault();
        dropzone.ondrop = e => { e.preventDefault(); if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); };
        fileInput.onchange = e => handleFile(e.target.files[0]);
        qualitySlider.oninput = () => qualityValue.textContent = qualitySlider.value;
        function handleFile(file) {
            if (!file.type.startsWith('image/')) return;
            uploadedFile = file;
            const reader = new FileReader();
            reader.onload = e => {
                previewEl.innerHTML = `<h4 class="font-semibold text-lg mb-2 dark:text-gray-200">Preview:</h4><img src="${e.target.result}" class="max-h-48 mx-auto rounded-md shadow-md"><p class="text-sm text-gray-500 mt-2 dark:text-gray-400">Original size: ${(file.size / 1024).toFixed(2)} KB</p>`;
                previewEl.classList.remove('hidden'); settingsEl.classList.remove('hidden'); compressBtn.classList.remove('hidden'); resultEl.innerHTML = '';
            };
            reader.readAsDataURL(file);
        }
        compressBtn.onclick = async () => {
            if (!uploadedFile) return;
            compressBtn.disabled = true; compressBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compressing...';
            const formData = new FormData();
            formData.append('image', uploadedFile); formData.append('quality', qualitySlider.value);
            try {
                const response = await fetch(`${backendUrl}/compress-image`, { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Compression failed on server.');
                const compressedBlob = await response.blob();
                const compressedUrl = URL.createObjectURL(compressedBlob);
                const sizeReduction = 100 - (compressedBlob.size / uploadedFile.size) * 100;
                resultEl.innerHTML = `<h4 class="font-semibold text-lg mt-4 mb-2 dark:text-gray-200">Result:</h4><p class="text-green-600 font-bold">Success! Size reduced by ${sizeReduction.toFixed(1)}%.</p><p class="text-sm text-gray-500 dark:text-gray-400">New size: ${(compressedBlob.size / 1024).toFixed(2)} KB</p><a href="${compressedUrl}" download="compressed-${uploadedFile.name}" class="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"><i class="fas fa-download mr-2"></i>Download Compressed Image</a>`;
            } catch (error) {
                console.error('Compression Error:', error);
                resultEl.innerHTML = `<p class="text-red-500">Error: ${error.message}. Is the Python app running?</p>`;
            } finally {
                compressBtn.disabled = false; compressBtn.innerHTML = 'Compress Image';
            }
        };
    }
    
    function launchStopwatch() {
        const stopwatchHTML = `
            <div class="text-center">
                <div id="stopwatch-display" class="text-6xl font-mono mb-6 dark:text-white">00:00.00</div>
                <div class="flex justify-center space-x-4 mb-6">
                    <button id="sw-start-btn" class="w-24 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition">Start</button>
                    <button id="sw-stop-btn" class="w-24 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition hidden">Stop</button>
                    <button id="sw-lap-btn" class="w-24 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition" disabled>Lap</button>
                    <button id="sw-reset-btn" class="w-24 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition" disabled>Reset</button>
                </div>
                <div id="laps-container" class="text-left max-h-48 overflow-y-auto border rounded-md p-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"></div>
            </div>`;
        openModal('Stopwatch', stopwatchHTML);
        const display = document.getElementById('stopwatch-display'), startBtn = document.getElementById('sw-start-btn'), stopBtn = document.getElementById('sw-stop-btn'), lapBtn = document.getElementById('sw-lap-btn'), resetBtn = document.getElementById('sw-reset-btn'), lapsContainer = document.getElementById('laps-container');
        let startTime = 0, elapsedTime = 0, timerInterval, lapNumber = 1;
        function formatTime(ms) { const date = new Date(ms); const minutes = date.getUTCMinutes().toString().padStart(2, '0'); const seconds = date.getUTCSeconds().toString().padStart(2, '0'); const milliseconds = (date.getUTCMilliseconds() / 10).toFixed(0).padStart(2, '0'); return `${minutes}:${seconds}.${milliseconds}`; }
        function printTime() { elapsedTime = performance.now() - startTime; display.textContent = formatTime(elapsedTime); }
        startBtn.onclick = () => { startTime = performance.now() - elapsedTime; timerInterval = setInterval(printTime, 10); startBtn.classList.add('hidden'); stopBtn.classList.remove('hidden'); lapBtn.disabled = false; resetBtn.disabled = true; };
        stopBtn.onclick = () => { clearInterval(timerInterval); startBtn.classList.remove('hidden'); stopBtn.classList.add('hidden'); lapBtn.disabled = true; resetBtn.disabled = false; };
        resetBtn.onclick = () => { clearInterval(timerInterval); elapsedTime = 0; display.textContent = "00:00.00"; resetBtn.disabled = true; lapsContainer.innerHTML = ''; lapNumber = 1; };
        lapBtn.onclick = () => { const lapTime = formatTime(elapsedTime); const lapEl = document.createElement('div'); lapEl.className = 'p-1 border-b dark:border-gray-600'; lapEl.textContent = `Lap ${lapNumber++}: ${lapTime}`; lapsContainer.prepend(lapEl); };
    }
    
    function launchFileTransfer() {
        const transferHTML = `
            <div class="grid md:grid-cols-2 gap-6">
                <div class="p-4 border rounded-lg dark:border-gray-600">
                    <h3 class="text-xl font-semibold mb-3 text-center dark:text-white">Send File</h3>
                    <input type="file" id="transfer-file-input" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-teal-900 dark:file:text-teal-300 dark:hover:file:bg-teal-800">
                    <button id="upload-btn" class="mt-4 w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition" disabled>Upload</button>
                    <div id="upload-result" class="mt-4 text-center font-mono dark:text-gray-200"></div>
                </div>
                <div class="p-4 border rounded-lg dark:border-gray-600">
                    <h3 class="text-xl font-semibold mb-3 text-center dark:text-white">Receive File</h3>
                    <input type="text" id="transfer-code-input" class="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter download code">
                    <button id="download-btn" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">Download</button>
                </div>
            </div>`;
        openModal('File Transfer', transferHTML);
        const fileInput = document.getElementById('transfer-file-input'), uploadBtn = document.getElementById('upload-btn'), uploadResult = document.getElementById('upload-result'), codeInput = document.getElementById('transfer-code-input'), downloadBtn = document.getElementById('download-btn');
        fileInput.onchange = () => { uploadBtn.disabled = !fileInput.files.length; };
        uploadBtn.onclick = async () => {
            const file = fileInput.files[0]; if (!file) return;
            uploadBtn.disabled = true; uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            const formData = new FormData(); formData.append('file', file);
            try {
                const response = await fetch(`${backendUrl}/upload-file`, { method: 'POST', body: formData });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Upload failed');
                uploadResult.innerHTML = `Share this code: <strong class="text-lg bg-gray-200 dark:bg-gray-600 p-1 rounded cursor-pointer" onclick="navigator.clipboard.writeText('${data.code}')">${data.code} <i class="far fa-copy"></i></strong><br><small class="text-gray-500">(Expires in 1 hour)</small>`;
            } catch (err) {
                uploadResult.innerHTML = `<span class="text-red-500">Error: ${err.message}</span>`;
            } finally {
                uploadBtn.disabled = false; uploadBtn.innerHTML = 'Upload';
            }
        };
        downloadBtn.onclick = () => { const code = codeInput.value.trim(); if (code) { window.open(`${backendUrl}/download-file/${code}`, '_blank'); } };
    }

    function launchScreenRecorder() {
        const screenRecorderHTML = `
            <div class="text-center">
                <p id="screen-recorder-status" class="mb-4 text-gray-600 dark:text-gray-300">Select a screen, window, or tab to record.</p>
                <div class="bg-black rounded-lg mb-4"><video id="screen-preview" class="w-full h-auto rounded-lg" autoplay muted></video></div>
                <div class="flex justify-center space-x-4">
                    <button id="start-screen-record-btn" class="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition shadow-lg text-lg"><i class="fas fa-video"></i> Start Recording</button>
                    <button id="stop-screen-record-btn" class="bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition shadow-lg text-lg" disabled><i class="fas fa-stop"></i> Stop Recording</button>
                </div>
                <div id="video-playback-container" class="mt-6"></div>
            </div>`;
        openModal('Screen Recorder', screenRecorderHTML);
        const startBtn = document.getElementById('start-screen-record-btn'), stopBtn = document.getElementById('stop-screen-record-btn'), statusEl = document.getElementById('screen-recorder-status'), previewEl = document.getElementById('screen-preview'), playbackContainer = document.getElementById('video-playback-container');
        let mediaRecorder, recordedChunks = [];
        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" }, audio: true });
                previewEl.srcObject = stream;
                stream.getVideoTracks()[0].onended = stopRecording;
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
                mediaRecorder.ondataavailable = event => { if (event.data.size > 0) recordedChunks.push(event.data); };
                mediaRecorder.onstop = () => {
                    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
                    const videoUrl = URL.createObjectURL(videoBlob);
                    playbackContainer.innerHTML = `<h4 class="font-semibold text-lg mb-2 dark:text-white">Your Recording:</h4><video controls class="w-full rounded-lg" src="${videoUrl}"></video><a href="${videoUrl}" download="screen-recording.webm" class="inline-block mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"><i class="fas fa-download mr-2"></i>Download Recording</a>`;
                    if(previewEl.srcObject) previewEl.srcObject.getTracks().forEach(track => track.stop());
                    previewEl.srcObject = null;
                    recordedChunks = [];
                };
                mediaRecorder.start();
                startBtn.disabled = true; stopBtn.disabled = false;
                statusEl.innerHTML = '<span class="recording-dot inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>Recording your screen...';
            } catch (err) {
                console.error("Error starting screen recording:", err);
                statusEl.textContent = 'Could not start screen recording. Please grant permission.';
            }
        };
        const stopRecording = () => { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); startBtn.disabled = false; stopBtn.disabled = true; statusEl.textContent = 'Recording stopped.'; };
        startBtn.addEventListener('click', startRecording);
        stopBtn.addEventListener('click', stopRecording);
    }
});
