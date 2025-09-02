window.addEventListener('DOMContentLoaded', () => {
  const displayExpression = document.getElementById('display-expression');
  const displayResult = document.getElementById('display-result');
  const buttons = document.querySelectorAll('.button');
  let currentInput = '';
  let lastResult = null;

  function updateDisplay() {
    displayExpression.textContent = currentInput || '0';
    if (lastResult !== null) {
      displayResult.textContent = lastResult;
    } else {
      displayResult.textContent = '0';
    }
  }

  function safeEval(expr) {
    // Replace % with /100
    const replaced = expr.replace(/%/g, '/100');
    // Evaluate safely
    return Function(`"use strict"; return (${replaced})`)();
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');

      if (button.id === 'clear') {
        currentInput = '';
        lastResult = null;
        updateDisplay();
        return;
      }

      if (button.id === 'delete') {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') lastResult = null;
        updateDisplay();
        return;
      }

      if (button.id === 'equals') {
        if (currentInput === '') return;
        try {
          const result = safeEval(currentInput);
          lastResult = result;
          currentInput = result.toString();
          updateDisplay();
        } catch (e) {
          lastResult = 'Error';
          updateDisplay();
          currentInput = '';
        }
        return;
      }

      // Prevent multiple operators in a row
      const operators = ['+', '-', '*', '/', '%'];
      const lastChar = currentInput.slice(-1);

      if (operators.includes(value)) {
        if (currentInput === '' && value !== '-') {
          // Don't allow operator at start except minus
          return;
        }
        if (operators.includes(lastChar)) {
          // Replace last operator with new one
          currentInput = currentInput.slice(0, -1);
        }
      }

      // Prevent multiple decimals in the current number segment
      if (value === '.') {
        // Find last operator index
        let lastOpIndex = -1;
        for (let i = currentInput.length - 1; i >= 0; i--) {
          if (operators.includes(currentInput[i])) {
            lastOpIndex = i;
            break;
          }
        }
        const lastNumber = currentInput.slice(lastOpIndex + 1);
        if (lastNumber.includes('.')) {
          return; // Already a decimal in current number
        }
      }

      currentInput += value;
      lastResult = null;
      updateDisplay();
    });
  });

  updateDisplay();
});
