// Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwP_0d1w1YSLFGb5uqhSO0-NrS5Xs3kBXhhvdBt0MQnq4ySY4ID0CrtcLmaImrwEeLRuw/exec';

// Application State
let currentSection = 'intro';
let currentComparisonIndex = 0;
let randomizedOrder = []; 
let responses = {
    demographics: {},
    comparisons: {}, // { task1: { choice: 'A', reliability: 4 }, ... }
    comparisonOrder: [],
    timestamp: null,
    duration: null
};
let startTime = null;
let currentSelection = null; // Temporary selection before confirming

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Consent
    document.getElementById('consentCheckbox').addEventListener('change', function(e) {
        document.getElementById('startBtn').disabled = !e.target.checked;
    });

    // Navigation buttons
    document.getElementById('startBtn').addEventListener('click', startStudy);
    document.getElementById('nextToDemographics').addEventListener('click', validateDemographics);
    document.getElementById('backToDemographics').addEventListener('click', () => showSection('intro'));
    document.getElementById('nextBtn').addEventListener('click', nextComparison);
    // Back button in comparisons disabled for simplicity in logical flow, or only previous visualization
    
    updateProgressBar();
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startStudy() {
    startTime = new Date();
    
    // Randomize the order of the 5 tasks
    const indices = [0, 1, 2, 3, 4]; 
    randomizedOrder = shuffleArray(indices);
    
    responses.comparisonOrder = randomizedOrder.map(idx => comparisons[idx].id);
    console.log('Task order:', responses.comparisonOrder);
    
    showSection('demographics');
}

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + 'Section').classList.add('active');
    currentSection = section;
    updateProgressBar();
    
    if (section === 'comparisons') {
        renderComparison(currentComparisonIndex);
    }
}

function updateProgressBar() {
    const totalSteps = 7; // intro, demo, 5 tasks
    let currentStep = 0;
    
    if (currentSection === 'intro') currentStep = 0;
    else if (currentSection === 'demographics') currentStep = 1;
    else if (currentSection === 'comparisons') currentStep = 2 + currentComparisonIndex;
    else if (currentSection === 'thankYou') currentStep = 7;
    
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function validateDemographics() {
    const status = document.getElementById('professionalStatus').value;
    const exp = document.getElementById('experience').value;
    const spec = document.getElementById('specialty').value;
    const fam = document.getElementById('aiFamiliarity').value;
    const gen = document.getElementById('gender').value;
    const age = document.getElementById('ageGroup').value;
    
    if (!status || !exp || !spec || !fam || !gen || !age) {
        alert('Please complete all required fields (*)');
        return;
    }
    
    responses.demographics = {
        professionalStatus: status,
        experience: exp,
        specialty: spec,
        aiFamiliarity: fam,
        gender: gen,
        ageGroup: age
    };
    
    showSection('comparisons');
}

function renderComparison(index) {
    const actualIndex = randomizedOrder[index];
    const comparison = comparisons[actualIndex];
    const container = document.getElementById('comparisonContainer');
    
    // Reset selection and Likert
    currentSelection = null;
    document.querySelectorAll('input[name="reliability"]').forEach(r => r.checked = false);
    document.getElementById('postChoiceSection').classList.remove('visible');
    document.getElementById('nextBtn').disabled = true;

    const sysADesc = getSystemDescription(comparison.systemA);
    const sysBDesc = getSystemDescription(comparison.systemB);
    const sysCDesc = getSystemDescription(comparison.systemC);
    
    container.innerHTML = `
        <div class="comparison">
            <div class="comparison-title">
                ${comparison.title}
            </div>
            <p style="text-align: center; margin-bottom: 20px; color: #666;">
                <strong>Which of these THREE systems would you trust MOST to use in your professional practice?</strong>
            </p>
            <div class="systems-grid">
                <div class="system-card" data-system="A" onclick="selectSystem('A')">
                    <div class="system-header">SYSTEM A</div>
                    ${renderAttributes(sysADesc)}
                </div>
                <div class="system-card" data-system="B" onclick="selectSystem('B')">
                    <div class="system-header">SYSTEM B</div>
                    ${renderAttributes(sysBDesc)}
                </div>
                <div class="system-card" data-system="C" onclick="selectSystem('C')">
                    <div class="system-header">SYSTEM C</div>
                    ${renderAttributes(sysCDesc)}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('nextBtn').textContent = index === 4 ? 'Finish' : 'Next';
}

function renderAttributes(desc) {
    return `
        <div class="attribute">
            <div class="attribute-name">AI Diagnostic Accuracy</div>
            <div class="attribute-value">${desc.precision}</div>
        </div>
        <div class="attribute">
            <div class="attribute-name">AI Explainability</div>
            <div class="attribute-value">${desc.explainability}</div>
        </div>
        <div class="attribute">
            <div class="attribute-name">AI Clinical Validation</div>
            <div class="attribute-value">${desc.validation}</div>
        </div>
        <div class="attribute">
            <div class="attribute-name">Professional Control of AI</div>
            <div class="attribute-value">${desc.control}</div>
        </div>
        <div class="attribute">
            <div class="attribute-name">AI Transparency</div>
            <div class="attribute-value">${desc.transparency}</div>
        </div>
    `;
}

function selectSystem(system) {
    // Visually mark
    document.querySelectorAll('.system-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`[data-system="${system}"]`).classList.add('selected');
    
    currentSelection = system;
    
    // Show Likert question
    document.getElementById('postChoiceSection').classList.add('visible');
    document.getElementById('postChoiceSection').scrollIntoView({ behavior: 'smooth' });
    
    checkStepCompletion();
}

function selectLikert(value) {
    // Select radio button programmatically if div clicked
    document.getElementById('likert' + value).checked = true;
    checkStepCompletion();
}

function checkStepCompletion() {
    const likert = document.querySelector('input[name="reliability"]:checked');
    // Enable next only if system and likert selected
    if (currentSelection && likert) {
        document.getElementById('nextBtn').disabled = false;
    }
}

function nextComparison() {
    const actualIndex = randomizedOrder[currentComparisonIndex];
    const likertVal = document.querySelector('input[name="reliability"]:checked').value;
    
    // Save response
    responses.comparisons[`task_${actualIndex + 1}`] = {
        selectedSystem: currentSelection,
        reliabilityScore: likertVal
    };

    if (currentComparisonIndex < 4) {
        currentComparisonIndex++;
        renderComparison(currentComparisonIndex);
        updateProgressBar();
        window.scrollTo(0, 0);
    } else {
        finishStudy();
    }
}

async function finishStudy() {
    responses.timestamp = new Date().toISOString();
    responses.duration = Math.round((new Date() - startTime) / 1000);
    
    console.log("Final results:", responses);

    // 1. CHANGE: Show thank you section IMMEDIATELY
    // so user doesn't notice the delay of sending.
    showSection('thankYou');

    // 2. Send data in background
    try {
        // Optional: add keepalive: true to try sending
        // even if user closes tab quickly.
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            keepalive: true, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(responses)
        });
        console.log('Data sent');
    } catch (error) {
        console.error('Send error:', error);
        // Note: Since we are already on the thank you screen,
        // if sending fails the user won't know, but it is preferable
        // to the interface getting stuck.
    }
}
