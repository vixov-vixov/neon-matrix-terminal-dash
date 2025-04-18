
/**
 * Terminal text effects utilities
 */

// Type text with a typewriter effect
export const typeText = (
  text: string,
  element: HTMLElement,
  speed: number = 30,
  initialDelay: number = 0
): Promise<void> => {
  return new Promise(resolve => {
    let i = 0;
    element.textContent = '';
    
    setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    }, initialDelay);
  });
};

// Generate a random string of characters (for matrix effect)
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create a timestamp for the terminal
export const getTimestamp = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
  
  return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
};

// Scramble text effect (matrix-style)
export const scrambleText = (
  finalText: string,
  element: HTMLElement,
  duration: number = 1000,
  speed: number = 50
): Promise<void> => {
  return new Promise(resolve => {
    const finalLength = finalText.length;
    let iterations = 0;
    const maxIterations = Math.ceil(duration / speed);
    
    const interval = setInterval(() => {
      iterations++;
      
      // Gradually replace random chars with the final text
      const progress = iterations / maxIterations;
      let displayText = '';
      
      for (let i = 0; i < finalLength; i++) {
        // The further along we are, the more likely we use the final character
        if (Math.random() < progress || iterations === maxIterations) {
          displayText += finalText[i];
        } else {
          // Use a random character
          displayText += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'.charAt(
            Math.floor(Math.random() * 72)
          );
        }
      }
      
      element.textContent = displayText;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        element.textContent = finalText;
        resolve();
      }
    }, speed);
  });
};

// Simulate command output with delays
export const simulateCommandOutput = async (
  logElement: HTMLElement,
  commands: { text: string; type?: 'input' | 'output' | 'error' | 'success' }[],
  baseDelay: number = 50
): Promise<void> => {
  for (const command of commands) {
    const type = command.type || 'output';
    const logItem = document.createElement('div');
    
    // Set appropriate styling
    if (type === 'input') {
      logItem.classList.add('text-hacker-neon');
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> <span class="text-hacker-cyan">$</span> ${command.text}`;
    } else if (type === 'error') {
      logItem.classList.add('text-hacker-red');
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> [ERROR] ${command.text}`;
    } else if (type === 'success') {
      logItem.classList.add('text-green-400');
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> [SUCCESS] ${command.text}`;
    } else {
      logItem.innerHTML = `<span class="log-timestamp">${getTimestamp()}</span> ${command.text}`;
    }
    
    logElement.appendChild(logItem);
    logElement.scrollTop = logElement.scrollHeight;
    
    // Random delay between commands to simulate realistic typing/processing
    const delay = baseDelay + Math.random() * baseDelay * 2;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Add glitchy text effect
export const glitchText = (
  element: HTMLElement,
  finalText: string,
  duration: number = 1000
): Promise<void> => {
  return new Promise(resolve => {
    element.setAttribute('data-text', finalText);
    element.classList.add('glitch');
    element.textContent = finalText;
    
    setTimeout(() => {
      element.classList.remove('glitch');
      resolve();
    }, duration);
  });
};
