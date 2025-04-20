
export const appendLogMessage = (
  logRef: HTMLDivElement,
  message: string,
  type: 'input' | 'output' | 'error' | 'success' = 'output',
  timestamp: string
) => {
  const logItem = document.createElement('div');
  logItem.className = 'mb-1 flex items-start';
  
  if (type === 'input') {
    logItem.innerHTML = `
      <span class="log-timestamp mr-2">${timestamp}</span>
      <div class="flex-grow"><span class="text-hacker-cyan">$</span> ${message}</div>
    `;
  } else if (type === 'error') {
    logItem.innerHTML = `
      <span class="log-timestamp mr-2">${timestamp}</span>
      <div class="flex-grow text-hacker-red">${message}</div>
    `;
  } else if (type === 'success') {
    logItem.innerHTML = `
      <span class="log-timestamp mr-2">${timestamp}</span>
      <div class="flex-grow text-green-400">${message}</div>
    `;
  } else {
    // For regular output, handle multi-line messages properly
    if (message.includes('\n')) {
      const lines = message.split('\n');
      const formattedLines = lines.map((line, index) => {
        if (index === 0) {
          return `
            <div class="flex items-start">
              <span class="log-timestamp mr-2">${timestamp}</span>
              <div class="flex-grow">${line}</div>
            </div>
          `;
        } else {
          return `
            <div class="flex items-start">
              <span class="log-timestamp mr-2 opacity-0">${timestamp}</span>
              <div class="flex-grow">${line}</div>
            </div>
          `;
        }
      }).join('');
      logItem.innerHTML = formattedLines;
    } else {
      logItem.innerHTML = `
        <div class="flex items-start">
          <span class="log-timestamp mr-2">${timestamp}</span>
          <div class="flex-grow">${message}</div>
        </div>
      `;
    }
  }
  
  logRef.appendChild(logItem);
  logRef.scrollTop = logRef.scrollHeight;
};
