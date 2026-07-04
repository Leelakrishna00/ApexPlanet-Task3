document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INTERACTIVE IMAGE CAROUSEL WIDGET
    // ==========================================
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playPauseBtn = document.getElementById('carousel-play-pause');
    const carouselContainer = document.querySelector('.carousel-container');

    let currentSlide = 0;
    const slideIntervalTime = 4000; // 4 seconds
    let autoplayTimer = null;
    let isAutoplayPaused = false;

    function showSlide(index) {
        // Wrap-around bounds checking
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Reset active classes
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Set active slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoplay() {
        stopAutoplay(); // Clear existing
        if (!isAutoplayPaused) {
            autoplayTimer = setInterval(nextSlide, slideIntervalTime);
        }
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function toggleAutoplay() {
        if (isAutoplayPaused) {
            isAutoplayPaused = false;
            playPauseBtn.textContent = 'Pause Autoplay';
            playPauseBtn.className = 'btn btn-control-play';
            startAutoplay();
        } else {
            isAutoplayPaused = true;
            playPauseBtn.textContent = 'Play Autoplay';
            playPauseBtn.className = 'btn btn-control-play btn-paused';
            stopAutoplay();
        }
    }

    // Attach listeners for Carousel Controls
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoplay(); // Reset timer on click
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoplay(); // Reset timer on click
    });

    if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAutoplay);

    // Click indicators directly
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startAutoplay(); // Reset timer on click
        });
    });

    // Pause auto-rotation when hovering mouse
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            if (!isAutoplayPaused) {
                stopAutoplay();
            }
        });
        carouselContainer.addEventListener('mouseleave', () => {
            if (!isAutoplayPaused) {
                startAutoplay();
            }
        });
    }

    // Initialize Autoplay
    startAutoplay();


    // ==========================================
    // 2. INTERACTIVE SYSTEM QUIZ WIDGET
    // ==========================================
    const quizStartBtn = document.getElementById('quiz-start-btn');
    const quizRetryBtn = document.getElementById('quiz-retry-btn');
    const quizStartScreen = document.getElementById('quiz-start-screen');
    const quizQuestionScreen = document.getElementById('quiz-question-screen');
    const quizResultScreen = document.getElementById('quiz-result-screen');
    const quizContentPanel = document.getElementById('quiz-content-panel');
    
    const quizProgressBar = document.getElementById('quiz-progress-bar-container');
    const quizProgressFill = document.getElementById('quiz-progress-fill');
    const quizQuestionCounter = document.getElementById('quiz-question-counter');
    const quizTimerText = document.getElementById('quiz-timer');
    
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    
    const quizResultScore = document.getElementById('quiz-result-score');
    const quizResultTitle = document.getElementById('quiz-result-title');
    const quizResultDesc = document.getElementById('quiz-result-description');
    const quizStatCorrect = document.getElementById('quiz-stat-correct');
    const quizStatPoints = document.getElementById('quiz-stat-points');

    // Database questions
    const quizData = [
        {
            question: "What does HTML stand for?",
            options: [
                "HyperText Markup Language",
                "HighTech Multi Language",
                "Hyperlink Text Management List",
                "Home Tool Markup Link"
            ],
            correct: 0
        },
        {
            question: "Which CSS layout engine focuses on aligning items in a single axis (row or column)?",
            options: [
                "CSS Grid",
                "Flexbox",
                "Absolute Positioning",
                "Float Frameworks"
            ],
            correct: 1
        },
        {
            question: "Which of the following is NOT a primitive JavaScript data type?",
            options: [
                "String",
                "Boolean",
                "Object",
                "Undefined"
            ],
            correct: 2
        },
        {
            question: "Which HTTP status code represents a successful resource creation?",
            options: [
                "200 OK",
                "201 Created",
                "301 Moved Permanently",
                "404 Not Found"
            ],
            correct: 1
        },
        {
            question: "What is the primary mechanism JavaScript uses to handle asynchronous operations?",
            options: [
                "Infinite Loops",
                "For-Each Blocks",
                "Promises and Async/Await",
                "Local Caching"
            ],
            correct: 2
        }
    ];

    let currentQuestionIdx = 0;
    let quizScore = 0;
    let quizPoints = 0;
    let quizTimer = null;
    let timeRemaining = 15; // 15 seconds per question
    let isQuestionAnswered = false;

    function startQuiz() {
        currentQuestionIdx = 0;
        quizScore = 0;
        quizPoints = 0;
        
        switchQuizScreen(quizQuestionScreen);
        quizProgressBar.style.display = 'block';
        
        loadQuestion();
    }

    function switchQuizScreen(targetScreen) {
        // Toggle screens
        const screens = [quizStartScreen, quizQuestionScreen, quizResultScreen];
        screens.forEach(screen => screen.classList.remove('active'));
        targetScreen.classList.add('active');
    }

    function loadQuestion() {
        isQuestionAnswered = false;
        timeRemaining = 15;
        quizTimerText.textContent = `Time Left: ${timeRemaining}s`;
        quizTimerText.style.color = '';
        
        // Counter update
        quizQuestionCounter.textContent = `Question ${currentQuestionIdx + 1} of ${quizData.length}`;
        
        // Progress fill
        const progressPct = ((currentQuestionIdx) / quizData.length) * 100;
        quizProgressFill.style.width = `${progressPct}%`;

        // Render Question Text
        const currentData = quizData[currentQuestionIdx];
        quizQuestionText.textContent = currentData.question;

        // Render Options
        quizOptionsContainer.innerHTML = '';
        currentData.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt-btn';
            btn.innerHTML = `
                <span>${escapeHTML(optText)}</span>
                <span class="indicator-icon"></span>
            `;
            btn.addEventListener('click', () => selectAnswer(index));
            quizOptionsContainer.appendChild(btn);
        });

        // Set Timer countdown interval
        if (quizTimer) clearInterval(quizTimer);
        quizTimer = setInterval(() => {
            timeRemaining--;
            quizTimerText.textContent = `Time Left: ${timeRemaining}s`;
            
            // Warnings below 5s
            if (timeRemaining <= 5) {
                quizTimerText.style.color = 'var(--error-color)';
            }
            
            if (timeRemaining <= 0) {
                clearInterval(quizTimer);
                handleTimeout();
            }
        }, 1000);
    }

    function selectAnswer(selectedIndex) {
        if (isQuestionAnswered) return; // Prevent double selecting
        isQuestionAnswered = true;
        
        if (quizTimer) clearInterval(quizTimer);

        const currentData = quizData[currentQuestionIdx];
        const correctIndex = currentData.correct;
        const options = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');

        options.forEach((optBtn, index) => {
            // Disable buttons
            optBtn.disabled = true;
            optBtn.style.cursor = 'default';
            
            if (index === correctIndex) {
                optBtn.classList.add('correct-choice');
                optBtn.querySelector('.indicator-icon').textContent = '✓';
            } else if (index === selectedIndex) {
                optBtn.classList.add('wrong-choice');
                optBtn.querySelector('.indicator-icon').textContent = '×';
            }
        });

        if (selectedIndex === correctIndex) {
            quizScore++;
            quizPoints += (timeRemaining * 10) + 100; // Time bonus points
        }

        // Wait 2 seconds, then load next question or show results
        setTimeout(goToNextStep, 2000);
    }

    function handleTimeout() {
        isQuestionAnswered = true;
        const currentData = quizData[currentQuestionIdx];
        const correctIndex = currentData.correct;
        const options = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');

        options.forEach((optBtn, index) => {
            optBtn.disabled = true;
            if (index === correctIndex) {
                optBtn.classList.add('correct-choice');
                optBtn.querySelector('.indicator-icon').textContent = '✓';
            }
        });

        quizTimerText.textContent = "Time's Up!";
        setTimeout(goToNextStep, 2000);
    }

    function goToNextStep() {
        currentQuestionIdx++;
        if (currentQuestionIdx < quizData.length) {
            loadQuestion();
        } else {
            showQuizResults();
        }
    }

    function showQuizResults() {
        if (quizTimer) clearInterval(quizTimer);
        
        // Progress fill to 100%
        quizProgressFill.style.width = '100%';
        
        switchQuizScreen(quizResultScreen);
        quizProgressBar.style.display = 'none';

        // Math statistics
        const scorePct = Math.round((quizScore / quizData.length) * 100);
        quizResultScore.textContent = `${scorePct}%`;
        
        // Set badges
        if (scorePct >= 80) {
            quizResultTitle.textContent = "🏆 Optimum Synthesis Achieved";
            quizResultDesc.textContent = "Full assessment validated. Your system engineering logic is optimized.";
            quizResultScore.parentElement.style.borderColor = 'var(--accent-teal)';
            quizResultScore.style.color = 'var(--accent-teal)';
        } else if (scorePct >= 50) {
            quizResultTitle.textContent = "⚙️ Operational Standard Met";
            quizResultDesc.textContent = "Passing score achieved. Core parameters verified, with minor calibrations recommended.";
            quizResultScore.parentElement.style.borderColor = 'var(--accent-cyan)';
            quizResultScore.style.color = 'var(--accent-cyan)';
        } else {
            quizResultTitle.textContent = "⚠️ System Calibration Required";
            quizResultDesc.textContent = "Assessment failed. Core concepts require further training and review.";
            quizResultScore.parentElement.style.borderColor = 'var(--error-color)';
            quizResultScore.style.color = 'var(--error-color)';
        }

        quizStatCorrect.textContent = `${quizScore} / ${quizData.length}`;
        quizStatPoints.textContent = quizPoints;
    }

    // Attach listeners for Quiz Screen
    if (quizStartBtn) quizStartBtn.addEventListener('click', startQuiz);
    if (quizRetryBtn) quizRetryBtn.addEventListener('click', startQuiz);


    // ==========================================
    // 3. WEATHER REST API FETCH WIDGET
    // ==========================================
    const citySelector = document.getElementById('weather-city-selector');
    const weatherLoading = document.getElementById('weather-loading');
    const weatherError = document.getElementById('weather-error');
    const weatherErrorMsg = document.getElementById('weather-error-msg');
    const weatherRetryBtn = document.getElementById('weather-retry-btn');
    const weatherDataScreen = document.getElementById('weather-data-screen');

    // Weather Display Nodes
    const cityNameNode = document.getElementById('weather-city-name');
    const visualIconNode = document.getElementById('weather-visual-icon');
    const tempValueNode = document.getElementById('weather-temp-value');
    const descNode = document.getElementById('weather-condition-desc');
    const windNode = document.getElementById('weather-wind-value');
    const humidityNode = document.getElementById('weather-humidity-value');
    const apparentTempNode = document.getElementById('weather-apparent-temp');
    const timeNode = document.getElementById('weather-time-value');

    // City mappings for Coordinates
    const citiesConfig = {
        tokyo: { name: 'Tokyo, JP', lat: 35.6762, lon: 139.6503 },
        london: { name: 'London, UK', lat: 51.5074, lon: -0.1278 },
        newyork: { name: 'New York, US', lat: 40.7128, lon: -74.0060 },
        paris: { name: 'Paris, FR', lat: 48.8566, lon: 2.3522 },
        sydney: { name: 'Sydney, AU', lat: -33.8688, lon: 151.2093 },
        cairo: { name: 'Cairo, EG', lat: 30.0444, lon: 31.2357 },
        mumbai: { name: 'Mumbai, IN', lat: 19.0760, lon: 72.8777 }
    };

    // Open-Meteo Weather Codes map to details
    const weatherCodeMap = {
        0: { desc: 'Clear sky', icon: '☀️' },
        1: { desc: 'Mainly clear', icon: '☀️' },
        2: { desc: 'Partly cloudy', icon: '⛅' },
        3: { desc: 'Overcast', icon: '☁️' },
        45: { desc: 'Fog', icon: '🌫️' },
        48: { desc: 'Depositing rime fog', icon: '🌫️' },
        51: { desc: 'Light drizzle', icon: '🌧️' },
        53: { desc: 'Moderate drizzle', icon: '🌧️' },
        55: { desc: 'Dense drizzle', icon: '🌧️' },
        56: { desc: 'Light freezing drizzle', icon: '🌧️' },
        57: { desc: 'Dense freezing drizzle', icon: '🌧️' },
        61: { desc: 'Slight rain', icon: '🌧️' },
        63: { desc: 'Moderate rain', icon: '🌧️' },
        65: { desc: 'Heavy rain', icon: '🌧️' },
        66: { desc: 'Light freezing rain', icon: '🌧️' },
        67: { desc: 'Heavy freezing rain', icon: '🌧️' },
        71: { desc: 'Slight snow fall', icon: '❄️' },
        73: { desc: 'Moderate snow fall', icon: '❄️' },
        75: { desc: 'Heavy snow fall', icon: '❄️' },
        77: { desc: 'Snow grains', icon: '❄️' },
        80: { desc: 'Slight rain showers', icon: '🌧️' },
        81: { desc: 'Moderate rain showers', icon: '🌧️' },
        82: { desc: 'Violent rain showers', icon: '⛈️' },
        85: { desc: 'Slight snow showers', icon: '❄️' },
        86: { desc: 'Heavy snow showers', icon: '❄️' },
        95: { desc: 'Thunderstorm', icon: '⛈️' },
        96: { desc: 'Thunderstorm with slight hail', icon: '⛈️' },
        99: { desc: 'Thunderstorm with heavy hail', icon: '⛈️' }
    };

    function fetchWeatherData() {
        const cityKey = citySelector.value;
        const config = citiesConfig[cityKey];
        if (!config) return;

        // Reset screens
        weatherLoading.style.display = 'flex';
        weatherError.style.display = 'none';
        weatherDataScreen.style.display = 'none';

        const apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${config.lat}&longitude=${config.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`;

        fetch(apiEndpoint)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP network error: status ${res.status}`);
                return res.json();
            })
            .then(data => {
                const currentData = data.current;
                if (!currentData) throw new Error("Weather metrics parsing failed.");

                // Map city details
                cityNameNode.textContent = config.name;
                tempValueNode.textContent = Math.round(currentData.temperature_2m);
                windNode.textContent = `${currentData.wind_speed_10m.toFixed(1)} km/h`;
                humidityNode.textContent = `${currentData.relative_humidity_2m}%`;
                apparentTempNode.textContent = `${currentData.apparent_temperature.toFixed(1)} °C`;
                
                // Format current time
                const apiTime = new Date(currentData.time);
                const localeTime = apiTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeNode.textContent = localeTime;

                // Condition maps
                const wCode = currentData.weather_code;
                const condition = weatherCodeMap[wCode] || { desc: 'Unknown weather', icon: '☁️' };
                
                descNode.textContent = condition.desc;
                visualIconNode.textContent = condition.icon;

                // Show data panel
                weatherLoading.style.display = 'none';
                weatherDataScreen.style.display = 'block';
            })
            .catch(err => {
                console.error("Sat link error:", err);
                weatherLoading.style.display = 'none';
                weatherErrorMsg.textContent = err.message || "Failed to reach weather API servers.";
                weatherError.style.display = 'block';
            });
    }

    // Attach Selector Events
    if (citySelector) {
        citySelector.addEventListener('change', fetchWeatherData);
    }
    if (weatherRetryBtn) {
        weatherRetryBtn.addEventListener('click', fetchWeatherData);
    }

    // Load initial weather
    fetchWeatherData();


    // ==========================================
    // HELPER UTILITY: HTML ESCAPING
    // ==========================================
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

});
