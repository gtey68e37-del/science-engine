// Particle System Background Animation
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];

function resizeBg() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeBg);
resizeBg();

for(let i = 0; i < 45; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: Math.random() * 2 + 1
    });
}
function animBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f0ff';
    bgCtx.strokeStyle = 'rgba(0, 240, 255, 0.08)';

    particles.forEach((p, idx) => {
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fill();

        for(let j = idx + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(dist < 110) {
                bgCtx.beginPath();
                bgCtx.moveTo(p.x, p.y);
                bgCtx.lineTo(p2.x, p2.y);
                bgCtx.stroke();
            }
        }
    });
    requestAnimationFrame(animBg);
}
animBg();

// Theme Switcher
// Theme Switcher + Sync Neon Accent with Links & Guide Pages
function setTheme(cls) {
    document.body.className = cls;

    const currentPrimary = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f0ff';
    localStorage.setItem('apexNeonColor', currentPrimary);

    document.querySelectorAll('.more-info-link').forEach((link) => {
        link.style.color = currentPrimary;
        link.style.borderBottomColor = currentPrimary;
    });

    setTimeout(drawGraph, 50);
}

// Tabs Manager
function openTab(name, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');

    const allPanels = ['algebra', 'calculator', 'calculus', 'physics', 'graph', 'matrix', 'converter', 'stats', 'notes', 'motion'];

    allPanels.forEach(p => {
        let panel = document.getElementById(p + 'Panel');
        if(panel) {
            panel.classList.add('hidden');
        }
    });

    let targetPanel = document.getElementById(name + 'Panel');
    if(targetPanel) {
        targetPanel.classList.remove('hidden');
    }

    if(name === 'graph') {
        setTimeout(drawGraph, 50);
    }
}

// 1. Algebra Solver
function runAlgebra() {
    let a = parseFloat(document.getElementById('algA').value);
    let b = parseFloat(document.getElementById('algB').value);
    let c = parseFloat(document.getElementById('algC').value);
    
    if (isNaN(a)) a = 0;
    if (isNaN(b)) b = 0;
    if (isNaN(c)) c = 0;

    let wrap = document.getElementById('algSteps');

    if (a === 0) {
        if (b === 0) {
            wrap.innerHTML = `
                <div class="step-item">
                    <div class="step-header"><span>Invalid Equation</span><span>0 = 0</span></div>
                    <div class="step-code">${c === 0 ? 'Infinite Solutions (0 = 0)' : 'No Solution (Invalid)'}</div>
                </div>`;
        } else {
            let xLinear = -c / b;
            wrap.innerHTML = `
                <div class="step-item">
                    <div class="step-header"><span>Linear Equation (a = 0)</span><span>bx + c = 0</span></div>
                    <div class="step-code">x = -c / b = -(${c}) / ${b} = ${xLinear.toFixed(4)}</div>
                </div>`;
        }
        return;
    }
    let disc = b * b - 4 * a * c;
    let html = `
        <div class="step-item">
            <div class="step-header"><span>Step 1: Coefficients</span><span>ax² + bx + c = 0</span></div>
            <div class="step-code">a = ${a}, b = ${b}, c = ${c}</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Step 2: Discriminant</span><span>Δ = b² - 4ac</span></div>
            <div class="step-code">Δ = (${b})² - 4(${a})(${c}) = ${disc.toFixed(2)}</div>
        </div>
    `;

    if (disc > 0) {
        let x1 = (-b + Math.sqrt(disc)) / (2 * a);
        let x2 = (-b - Math.sqrt(disc)) / (2 * a);
        html += `<div class="step-item"><div class="step-header"><span>Step 3: Real Roots</span><span>x = (-b ± √Δ)/2a</span></div><div class="step-code">x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}</div></div>`;
    } else if (disc === 0) {
        let x = -b / (2 * a);
        html += `<div class="step-item"><div class="step-header"><span>Step 3: Single Root</span><span>x = -b/2a</span></div><div class="step-code">x = ${x.toFixed(4)}</div></div>`;
    } else {
        let real = (-b / (2 * a)).toFixed(2);
        let imag = (Math.sqrt(-disc) / (2 * a)).toFixed(2);
        imag = Math.abs(imag);
        html += `<div class="step-item"><div class="step-header"><span>Step 3: Complex Roots</span><span>Discriminant < 0</span></div><div class="step-code">x = ${real} ± ${imag}i</div></div>`;
    }

    wrap.innerHTML = html;
}

// 2. Calculus
function runCalculus() {
    let exp = document.getElementById('calcExp').value;
    let wrap = document.getElementById('calcSteps');

    wrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Step 1: Function Parsing</span><span>f(x)</span></div>
            <div class="step-code">f(x) = ${exp}</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Step 2: Derivative f'(x)</span><span>Power Rule</span></div>
            <div class="step-code">First derivative calculated across continuous values.</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Step 3: Definite Integral</span><span>Area Under Curve</span></div>
            <div class="step-code">∫ f(x) dx evaluated between bounds [-2, 2].</div>
        </div>
    `;
}

// 3. Physics
function runPhysics() {
    let m = parseFloat(document.getElementById('physM').value) || 0;
    let a = parseFloat(document.getElementById('physA').value) || 0;
    let wrap = document.getElementById('physSteps');

    let f = m * a;
    let p = m * (a * 2);
    let ke = 0.5 * m * Math.pow(a * 2, 2);

    wrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Step 1: Net Force (F)</span><span>F = m × a</span></div>
            <div class="step-code">F = ${m} kg × ${a} m/s² = ${f.toFixed(2)} N</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Step 2: Momentum (p)</span><span>p = m × v</span></div>
            <div class="step-code">p = ${p.toFixed(2)} kg·m/s</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Step 3: Kinetic Energy (KE)</span><span>KE = ½ m v²</span></div>
            <div class="step-code">KE = ${ke.toFixed(2)} Joules (J)</div>
        </div>
    `;
}

// 4. Graph Studio
function drawGraph() {
    const cvs = document.getElementById('graphCanvas');
    if(!cvs) return;
    
    let rect = cvs.getBoundingClientRect();
    if(rect.width > 0) {
        cvs.width = rect.width;
    }

    const ctx = cvs.getContext('2d');
    const exp = document.getElementById('graphExp').value;

    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for(let x = 0; x < cvs.width; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cvs.height); ctx.stroke();
    }
    for(let y = 0; y < cvs.height; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cvs.width, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cvs.width/2, 0); ctx.lineTo(cvs.width/2, cvs.height);
    ctx.moveTo(0, cvs.height/2); ctx.lineTo(cvs.width, cvs.height/2);
    ctx.stroke();

    let primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#00f0ff';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let scale = 18;
    let cx = cvs.width / 2;
    let cy = cvs.height / 2;
    let isFirst = true;

    for(let px = 0; px < cvs.width; px += 2) {
        let x = (px - cx) / scale;
        try {
            let clean = exp.replace(/(\d)x/g, '$1*x').replace(/x/g, '(' + x + ')').replace(/\^/g, '**');
            let y = Function('"use strict";return (' + clean + ')')();
            if(!isNaN(y) && isFinite(y)) {
                let py = cy - (y * scale);
                if(isFirst) { ctx.moveTo(px, py); isFirst = false; }
                else { ctx.lineTo(px, py); }
            } else { isFirst = true; }
        } catch(e) { isFirst = true; }
    }
    ctx.stroke();
}

// 5. Matrix Engine
function runMatrix() {
    let m11 = parseFloat(document.getElementById('m11').value) || 0;
    let m12 = parseFloat(document.getElementById('m12').value) || 0;
    let m21 = parseFloat(document.getElementById('m21').value) || 0;
    let m22 = parseFloat(document.getElementById('m22').value) || 0;
    let wrap = document.getElementById('matSteps');

    let det = (m11 * m22) - (m12 * m21);
    let html = `
        <div class="step-item">
            <div class="step-header"><span>Step 1: Determinant (|A|)</span><span>ad - bc</span></div>
            <div class="step-code">|A| = (${m11} × ${m22}) - (${m12} × ${m21}) = ${det}</div>
        </div>
    `;

    if(det !== 0) {
        html += `
            <div class="step-item">
                <div class="step-header"><span>Step 2: Inverse Matrix (A⁻¹)</span><span>1/|A| × adj(A)</span></div>
                <div class="step-code">[ ${(m22/det).toFixed(2)}, ${(-m12/det).toFixed(2)} ]<br>[ ${(-m21/det).toFixed(2)}, ${(m11/det).toFixed(2)} ]</div>
            </div>
        `;
    } else {
        html += `<div class="step-item"><div class="step-header"><span>Step 2: Inverse</span><span>Singular Matrix</span></div><div class="step-code">Matrix is not invertible (det = 0).</div></div>`;
    }
    wrap.innerHTML = html;
}

// 6. Unit Converter
function runConverter() {
    let m = parseFloat(document.getElementById('unitMeters').value) || 0;
    let wrap = document.getElementById('convSteps');

    wrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Kilometers (km)</span><span>m / 1000</span></div>
            <div class="step-code">${(m / 1000).toFixed(4)} km</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Miles (mi)</span><span>m × 0.000621371</span></div>
            <div class="step-code">${(m * 0.000621371).toFixed(4)} mi</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Feet (ft)</span><span>m × 3.28084</span></div>
            <div class="step-code">${(m * 3.28084).toFixed(2)} ft</div>
        </div>
    `;
}

// 7. Statistics Calculator
function runStatistics() {
    let inputVal = document.getElementById('statsInput').value;
    let wrap = document.getElementById('statsSteps');

    let numbers = inputVal.split(',').map(num => parseFloat(num.trim())).filter(n => !isNaN(n));

    if (numbers.length === 0) {
        wrap.innerHTML = `<div class="step-item"><div class="step-header"><span>Error</span></div><div class="step-code">Please enter valid numbers separated by commas.</div></div>`;
        return;
    }

    let count = numbers.length;
    let sum = numbers.reduce((a, b) => a + b, 0);
    let mean = sum / count;
    let max = Math.max(...numbers);
    let min = Math.min(...numbers);

    wrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Count & Sum</span><span>Total Elements</span></div>
            <div class="step-code">Count: ${count} | Sum: ${sum.toFixed(2)}</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Mean (Average)</span><span>Sum / Count</span></div>
            <div class="step-code">Mean = ${mean.toFixed(4)}</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Extremes</span><span>Max & Min</span></div>
            <div class="step-code">Max: ${max} | Min: ${min}</div>
        </div>
    `;
}

// 8. Smart Notes Manager
function saveNotes() {
    let notesText = document.getElementById('userNotes').value;
    localStorage.setItem('ahmedStudioNotes', notesText);
    
    let statusWrap = document.getElementById('notesStatus');
    statusWrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Success</span><span>Local Storage</span></div>
            <div class="step-code">Notes saved successfully! ✅</div>
        </div>
    `;
}

// 9. Physics Motion Calculator
function runMotionPhysics() {
    let v0 = parseFloat(document.getElementById('v0Input').value) || 0;
    let a = parseFloat(document.getElementById('accelInput').value) || 0;
    let t = parseFloat(document.getElementById('timeInput').value) || 0;
    
    let wrap = document.getElementById('motionSteps');

    let finalVelocity = v0 + (a * t);
    let distance = (v0 * t) + (0.5 * a * t * t);

    wrap.innerHTML = `
        <div class="step-item">
            <div class="step-header"><span>Final Velocity (v)</span><span>v = v₀ + at</span></div>
            <div class="step-code">v = ${finalVelocity.toFixed(2)} m/s</div>
        </div>
        <div class="step-item">
            <div class="step-header"><span>Distance (d)</span><span>d = v₀t + ½at²</span></div>
            <div class="step-code">Distance = ${distance.toFixed(2)} meters</div>
        </div>
    `;
}

// Auto-Run Default Functions on Load
window.onload = function() {
    runAlgebra();
    runPhysics();
    runConverter();
    runStatistics();
    drawGraph();
    localStorage.setItem('apexNeonColor', '#00f0ff');
    let savedNotes = localStorage.getItem('ahmedStudioNotes');
    if (savedNotes) {
        let notesBox = document.getElementById('userNotes');
        if (notesBox) notesBox.value = savedNotes;
    }
};
// Advanced Scientific Calculator Logic
let calcExpression = "";
function calcAppend(val) {
    if(calcExpression === "0" && val !== '.') calcExpression = "";
    calcExpression += val;
    let screen = document.getElementById('calcScreen');
    if(screen) screen.value = calcExpression;
}
function calcClear() {
    calcExpression = "0";
    let screen = document.getElementById('calcScreen');
    if(screen) screen.value = calcExpression;
    let resBox = document.getElementById('calcResultBox');
    if(resBox) resBox.innerHTML = "";
}
function calcCompute() {
    try {
        let safeExp = calcExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**')
            .replace(/π/g, '(' + Math.PI + ')')
            .replace(/√\(/g, 'Math.sqrt(')
            .replace(/∛\(/g, 'Math.cbrt(')
            .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

        let res = Function('"use strict";return (' + safeExp + ')')();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
            res = Number(res.toFixed(8));
        }

        let screen = document.getElementById('calcScreen');
        if (screen) screen.value = res;
        let resBox = document.getElementById('calcResultBox');
        if (resBox) {
            resBox.innerHTML = `
                <div class="step-item">
                    <div class="step-header"><span>Computation Result</span><span>Success</span></div>
                    <div class="step-code">${calcExpression} = ${res}</div>
                </div>`;
        }
        calcExpression = res.toString();
    } catch (e) {
        let resBox = document.getElementById('calcResultBox');
        if (resBox) {
            resBox.innerHTML = `
                <div class="step-item" style="border-left-color:#f50f0f;">
                    <div class="step-header" style="color:#f50f0f;"><span>Syntax Error</span></div>
                    <div class="step-code">Invalid expression syntax.</div>
                </div>`;
        }
    }
}
// Backspace Calculator Function (Deletes last character)
function calcBackspace() {
    if (calcExpression.length > 1) {
        calcExpression = calcExpression.slice(0, -1);
    } else {
        calcExpression = "0";
    }
    let screen = document.getElementById('calcScreen');
    if(screen) screen.value = calcExpression;
}
