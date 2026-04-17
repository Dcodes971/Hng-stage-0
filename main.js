

document.addEventListener('DOMContentLoaded', function () {

  // ===== ELEMENTS =====
  const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const title = document.querySelector('[data-testid="test-todo-title"]');
  const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
  const statusControl = document.querySelector('[data-testid="test-todo-status-control"]');
  const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');
  const overdueIndicator = document.querySelector('[data-testid="test-todo-overdue-indicator"]');
  const priorityBadge = document.querySelector('[data-testid="test-todo-priority"]');
  const priorityIndicator = document.querySelector('[data-testid="test-todo-priority-indicator"]');
  const collapsible = document.getElementById('collapsible-section');
  const expandToggle = document.querySelector('[data-testid="test-todo-expand-toggle"]');
  const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');
  const deleteBtn = document.querySelector('[data-testid="test-todo-delete-button"]');
  const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
  const saveBtn = document.querySelector('[data-testid="test-todo-save-button"]');
  const cancelBtn = document.querySelector('[data-testid="test-todo-cancel-button"]');
  const editTitleInput = document.querySelector('[data-testid="test-todo-edit-title-input"]');
  const editDescInput = document.querySelector('[data-testid="test-todo-edit-description-input"]');
  const editPrioritySelect = document.querySelector('[data-testid="test-todo-edit-priority-select"]');
  const editDueDateInput = document.querySelector('[data-testid="test-todo-edit-due-date-input"]');
  const description = document.querySelector('[data-testid="test-todo-description"]');

  // ===== STATE =====
  let dueDate = new Date('2026-04-16T18:00:00');
  let currentPriority = 'High';
  let isDone = false;
  let timerInterval = null;

  // ===== PRIORITY INDICATOR =====
  function updatePriorityIndicator(priority) {
    priorityIndicator.className = 'priority-indicator';
    if (priority === 'Low') {
      priorityIndicator.classList.add('low');
      priorityBadge.textContent = '🟢 Low';
      priorityBadge.style.backgroundColor = '#dcfce7';
      priorityBadge.style.color = '#15803d';
    } else if (priority === 'Medium') {
      priorityIndicator.classList.add('medium');
      priorityBadge.textContent = '🟡 Medium';
      priorityBadge.style.backgroundColor = '#fef9c3';
      priorityBadge.style.color = '#854d0e';
    } else {
      priorityIndicator.classList.add('high');
      priorityBadge.textContent = '🔴 High';
      priorityBadge.style.backgroundColor = '#fee2e2';
      priorityBadge.style.color = '#b91c1c';
    }
  }

  // ===== STATUS UPDATE =====
  function updateStatus(value) {
    statusBadge.textContent = value;
    statusControl.value = value;
    statusBadge.className = 'status-badge';

    if (value === 'Done') {
      isDone = true;
      checkbox.checked = true;
      title.classList.add('done');
      statusBadge.classList.add('done');
      timeRemaining.textContent = 'Completed';
      timeRemaining.classList.remove('overdue');
      overdueIndicator.style.display = 'none';
      clearInterval(timerInterval);
    } else {
      isDone = false;
      checkbox.checked = false;
      title.classList.remove('done');
      if (value === 'Pending') statusBadge.classList.add('pending');
      startTimer();
    }
  }

  // ===== TIME REMAINING =====
  function updateTimeRemaining() {
    if (isDone) return;

    const now = new Date();
    const diff = dueDate - now;
    let message = '';
    let isOverdue = false;

    if (diff <= 0) {
      const abs = Math.abs(diff);
      const minutes = Math.floor(abs / (1000 * 60));
      const hours = Math.floor(abs / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (minutes < 60) {
        message = `Overdue by ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else if (hours < 24) {
        message = `Overdue by ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else {
        message = `Overdue by ${days} day${days !== 1 ? 's' : ''}`;
      }
      isOverdue = true;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);

      if (minutes < 60) {
        message = `Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else if (hours < 24) {
        message = `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else if (days === 1) {
        message = 'Due tomorrow';
      } else {
        message = `Due in ${days} days`;
      }
    }

    timeRemaining.textContent = message;

    if (isOverdue) {
      timeRemaining.classList.add('overdue');
      overdueIndicator.style.display = 'inline-flex';
    } else {
      timeRemaining.classList.remove('overdue');
      overdueIndicator.style.display = 'none';
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    updateTimeRemaining();
    timerInterval = setInterval(updateTimeRemaining, 30000);
  }

  // ===== EXPAND / COLLAPSE =====
  expandToggle.addEventListener('click', function () {
    const isExpanded = collapsible.classList.contains('expanded');
    if (isExpanded) {
      collapsible.classList.remove('expanded');
      expandToggle.textContent = 'Show more';
      expandToggle.setAttribute('aria-expanded', 'false');
    } else {
      collapsible.classList.add('expanded');
      expandToggle.textContent = 'Show less';
      expandToggle.setAttribute('aria-expanded', 'true');
    }
  });

  // ===== CHECKBOX =====
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      updateStatus('Done');
    } else {
      updateStatus('Pending');
    }
  });

  // ===== STATUS CONTROL =====
  statusControl.addEventListener('change', function () {
    updateStatus(statusControl.value);
  });

  // ===== EDIT BUTTON =====
  editBtn.addEventListener('click', function () {
    // Pre-fill form with current values
    editTitleInput.value = title.textContent.trim();
    editDescInput.value = description.textContent.trim();
    editPrioritySelect.value = currentPriority;
    editDueDateInput.value = dueDate.toISOString().split('T')[0];

    // Show form, hide action buttons
    editForm.style.display = 'flex';
    document.querySelector('.card-actions').style.display = 'none';

    // Focus first input
    editTitleInput.focus();
  });

  // ===== SAVE BUTTON =====
  saveBtn.addEventListener('click', function () {
    // Update values from form
    title.textContent = editTitleInput.value.trim() || title.textContent;
    description.textContent = editDescInput.value.trim() || description.textContent;
    currentPriority = editPrioritySelect.value;
    dueDate = new Date(editDueDateInput.value + 'T18:00:00');

    // Update priority visuals
    updatePriorityIndicator(currentPriority);

    // Update due date display
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    document.querySelector('[data-testid="test-todo-due-date"]').textContent =
      'Due ' + dueDate.toLocaleDateString('en-US', options);

    // Hide form, show buttons
    editForm.style.display = 'none';
    document.querySelector('.card-actions').style.display = 'flex';

    // Restart timer with new date
    startTimer();

    // Return focus to edit button
    editBtn.focus();
  });

  // ===== CANCEL BUTTON =====
  cancelBtn.addEventListener('click', function () {
    editForm.style.display = 'none';
    document.querySelector('.card-actions').style.display = 'flex';
    editBtn.focus();
  });

  // ===== DELETE BUTTON =====
  deleteBtn.addEventListener('click', function () {
    alert('Delete clicked');
  });

  // ===== INIT =====
  updatePriorityIndicator(currentPriority);
  startTimer();

});