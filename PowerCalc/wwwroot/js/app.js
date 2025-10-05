let currentState = null;
let allLifters = [];
let allPrograms = [];

async function init() {
    await loadState();
    await loadLifters();
    await loadPrograms();
    renderDashboard();
}

async function loadState() {
    try {
        const response = await fetch('api/state');
        if (!response.ok) {
            console.error('Failed to load state:', response.statusText);
            return;
        }
        const text = await response.text();
        const state = text ? JSON.parse(text) : {};
        // Normalize property names to PascalCase
        currentState = {
            CurrentProgram: state.currentProgram || state.CurrentProgram || '',
            CurrentWeek: state.currentWeek || state.CurrentWeek || 1,
            CurrentDay: state.currentDay || state.CurrentDay || 1
        };
        console.log('Loaded state:', currentState);
    } catch (error) {
        console.error('Error loading state:', error);
    }
}

async function loadLifters() {
    try {
        const response = await fetch('api/lifters');
        if (!response.ok) {
            console.error('Failed to load lifters:', response.statusText);
            return;
        }
        const text = await response.text();
        allLifters = text ? JSON.parse(text) : [];
    } catch (error) {
        console.error('Error loading lifters:', error);
    }
}

async function loadPrograms() {
    try {
        const response = await fetch('/api/programs');
        if (!response.ok) {
            console.error('Failed to load programs:', response.statusText);
            return;
        }
        const text = await response.text();
        allPrograms = text ? JSON.parse(text) : [];

        const select = document.getElementById('programSelect');
        select.innerHTML = '';
        allPrograms.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.name;
            opt.textContent = p.name;
            opt.selected = p.name === currentState.CurrentProgram;
            select.appendChild(opt);
        });

        updateWeekDaySelectors();
    } catch (error) {
        console.error('Error loading programs:', error);
    }
}

function updateWeekDaySelectors() {
    const programName = document.getElementById('programSelect').value;
    const currentProgram = allPrograms.find(p => p.name === programName);

    if (!currentProgram) return;

    const weekSelect = document.getElementById('weekSelect');
    weekSelect.innerHTML = '';
    for (let i = 1; i <= currentProgram.weeks; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Week ${i}`;
        opt.selected = i === currentState.CurrentWeek;
        weekSelect.appendChild(opt);
    }

    const daySelect = document.getElementById('daySelect');
    daySelect.innerHTML = '';
    for (let i = 1; i <= currentProgram.days; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Day ${i}`;
        opt.selected = i === currentState.CurrentDay;
        daySelect.appendChild(opt);
    }

    checkForChanges();
}

function checkForChanges() {
    const programSelect = document.getElementById('programSelect');
    const weekSelect = document.getElementById('weekSelect');
    const daySelect = document.getElementById('daySelect');
    const indicator = document.getElementById('unsavedIndicator');

    if (!currentState || !programSelect || !weekSelect || !daySelect || !indicator) {
        return;
    }

    const hasChanges =
        programSelect.value !== currentState.CurrentProgram ||
        parseInt(weekSelect.value) !== currentState.CurrentWeek ||
        parseInt(daySelect.value) !== currentState.CurrentDay;

    if (hasChanges) {
        indicator.classList.add('visible');
    } else {
        indicator.classList.remove('visible');
    }
}

async function updateState() {
    const newState = {
        CurrentProgram: document.getElementById('programSelect').value,
        CurrentWeek: parseInt(document.getElementById('weekSelect').value),
        CurrentDay: parseInt(document.getElementById('daySelect').value)
    };

    await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState)
    });

    currentState = newState;
    checkForChanges();
}       

function renderDashboard() {
    // Render lifters
    const listEl = document.getElementById('liftersList');
    listEl.innerHTML = '';
    allLifters.forEach(lifter => {
        const card = document.createElement('div');
        card.className = 'lifter-card';
        card.innerHTML = `
            <h3>${lifter.name}</h3>
            <div class="lifter-stats">
                <div class="stat">
                    <span class="stat-label">Squat</span>
                    <span class="stat-value">${lifter.oneRepMaxes.squat || 0} kg</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Bench</span>
                    <span class="stat-value">${lifter.oneRepMaxes.bench || 0} kg</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deadlift</span>
                    <span class="stat-value">${lifter.oneRepMaxes.deadlift || 0} kg</span>
                </div>
                <div class="stat">
                    <span class="stat-label">OHP</span>
                    <span class="stat-value">${lifter.oneRepMaxes.ohp || 0} kg</span>
                </div>
            </div>
            <div class="actions">
                <button class="edit-button" onclick="editLifter('${lifter.name}')">Edit</button>
                <button class="delete-button" onclick="deleteLifter('${lifter.name}')">Delete</button>
            </div>
        `;
        listEl.appendChild(card);
    });

    // Render lifter selection
    const selectionEl = document.getElementById('lifterSelection');
    selectionEl.innerHTML = '';
    allLifters.forEach(lifter => {
        const label = document.createElement('label');
        label.className = 'lifter-checkbox';
        label.innerHTML = `
            <input type="checkbox" value="${lifter.name}">
            <span>${lifter.name}</span>
        `;
        selectionEl.appendChild(label);
    });
}

function showAddLifterModal() {
    document.getElementById('addLifterModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('addLifterModal').classList.add('hidden');
}

async function saveLifter() {
    const lifter = {
        name: document.getElementById('lifterName').value,
        oneRepMaxes: {
            squat: parseFloat(document.getElementById('squatMax').value),
            bench: parseFloat(document.getElementById('benchMax').value),
            deadlift: parseFloat(document.getElementById('deadliftMax').value),
            ohp: parseFloat(document.getElementById('ohpMax').value),
            rdl: parseFloat(document.getElementById('rdlMax').value),
            row: parseFloat(document.getElementById('rowMax').value),
            curl: parseFloat(document.getElementById('curlMax').value),
            triceps: parseFloat(document.getElementById('tricepsMax').value),
            crunch: parseFloat(document.getElementById('crunchMax').value),
            calf: parseFloat(document.getElementById('calfMax').value)
        }
    };

    await fetch('/api/lifters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lifter)
    });

    closeModal();
    await loadLifters();
    renderDashboard();
}

async function deleteLifter(name) {
    if (!confirm(`Delete ${name}?`)) return;

    await fetch(`/api/lifters/${name}`, { method: 'DELETE' });
    await loadLifters();
    renderDashboard();
}

async function startWorkout() {
    const selectedLifters = Array.from(
        document.querySelectorAll('.lifter-checkbox input:checked')
    ).map(cb => cb.value);

    if (selectedLifters.length === 0) {
        alert('Please select at least one lifter');
        return;
    }

    try {
        const response = await fetch('/api/workouts/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                programName: currentState.CurrentProgram,
                week: currentState.CurrentWeek,
                day: currentState.CurrentDay,
                lifterNames: selectedLifters
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to start workout:', response.status, errorText);
            alert(`Failed to start workout: ${errorText || response.statusText}`);
            return;
        }

        const text = await response.text();
        const session = text ? JSON.parse(text) : null;

        if (session) {
            renderWorkout(session);
        }
    } catch (error) {
        console.error('Error starting workout:', error);
        alert('Error starting workout. Check console for details.');
    }
}

function renderWorkout(session) {
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('workoutView').classList.remove('hidden');
    document.getElementById('workoutWeek').textContent = session.week;
    document.getElementById('workoutDay').textContent = session.day;

    const contentEl = document.getElementById('workoutContent');
    contentEl.innerHTML = '';

    // Set the number of participants for dynamic layout
    const participantCount = Math.min(session.workouts.length, 3);
    contentEl.setAttribute('data-participants', participantCount);

    session.workouts.forEach(workout => {
        const lifterDiv = document.createElement('div');
        lifterDiv.className = 'lifter-workout';
        lifterDiv.innerHTML = `<h2>${workout.lifterName}</h2><div class="lifter-exercises"></div>`;

        const exercisesContainer = lifterDiv.querySelector('.lifter-exercises');

        workout.exercises.forEach((ex, index) => {
            const exDiv = document.createElement('div');
            exDiv.className = 'exercise';

            let setsHTML = '<table class="sets-table">';
            ex.sets.forEach(set => {
                setsHTML += `<tr>
                    <td>${set.setNumber}. Set</td>
                    <td><span class="weight">${set.reps} x ${set.weight} kg</span></td>
                </tr>`;
            });
            setsHTML += '</table>';

            exDiv.innerHTML = `
                <div class="exercise-badge">${index + 1}</div>
                <div class="exercise-header">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-rest">Rest: ${ex.restSeconds}s</div>
                </div>
                ${setsHTML}
                ${ex.note ? `<div class="exercise-info">${ex.note}</div>` : ''}
            `;

            exercisesContainer.appendChild(exDiv);
        });

        contentEl.appendChild(lifterDiv);
    });
}

async function finishWorkout() {
    await fetch('/api/state/advance', { method: 'POST' });
    await loadState();
    backToDashboard();    
}

function backToDashboard() {
    document.getElementById('workoutView').classList.add('hidden');
    document.getElementById('dashboardView').classList.remove('hidden');
    updateWeekDaySelectors();
}

init();