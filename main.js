console.log(document.querySelector('[data-testid="test-todo-edit-button"]'));

document.addEventListener('DOMContentLoaded', function () {

  // ===== ELEMENTS =====
  const checkbox = document.querySelector('[data-testid="test-todo-complete-toggle"]');
  const title = document.querySelector('[data-testid="test-todo-title"]');
  const status = document.querySelector('[data-testid="test-todo-status"]');
  const timeRemaining = document.querySelector('[data-testid="test-todo-time-remaining"]');

  // ===== DUE DATE =====
  const dueDate = new Date('2026-04-16T18:00:00');

  // ===== TIME REMAINING FUNCTION =====
  function updateTimeRemaining() {
    const now = new Date();
    const diff = dueDate - now;

    let message = '';
    let isOverdue = false;

    if (diff <= 0) {
      const overdueDiff = Math.abs(diff);
      const overdueHours = Math.floor(overdueDiff / (1000 * 60 * 60));
      const overdueDays = Math.floor(overdueHours / 24);

      if (overdueHours < 1) {
        message = 'Overdue by less than an hour';
      } else if (overdueHours < 24) {
        message = `Overdue by ${overdueHours} hour${overdueHours > 1 ? 's' : ''}`;
      } else {
        message = `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`;
      }

      isOverdue = true;

    } else {
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (totalMinutes < 60) {
        message = 'Due in less than an hour';
      } else if (totalHours < 24) {
        message = `Due in ${totalHours} hour${totalHours > 1 ? 's' : ''}`;
      } else if (totalDays === 1) {
        message = 'Due tomorrow';
      } else {
        message = `Due in ${totalDays} days`;
      }
    }

    timeRemaining.textContent = message;

    if (isOverdue) {
      timeRemaining.classList.add('overdue');
    } else {
      timeRemaining.classList.remove('overdue');
    }
  }

  // ===== CHECKBOX TOGGLE =====
  checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
      status.textContent = 'Done';
      status.style.backgroundColor = '#dcfce7';
      status.style.color = '#15803d';
    } else {
      status.textContent = 'In Progress';
      status.style.backgroundColor = '#dbeafe';
      status.style.color = '#1e40af';
    }
  });

  // ===== EDIT & DELETE BUTTONS =====
  document.querySelector('[data-testid="test-todo-edit-button"]')
    .addEventListener('click', function () {
      console.log('Edit clicked');
    });

  document.querySelector('[data-testid="test-todo-delete-button"]')
    .addEventListener('click', function () {
      alert('Delete clicked');
    });

  // ===== INIT =====
  updateTimeRemaining();
  setInterval(updateTimeRemaining, 60000);

});