
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
      <span class="flex-grow"><span class="text-hacker-cyan">$</span> ${message}</span>
    `;
  } else if (type === 'error') {
    logItem.innerHTML = `
      <span class="log-timestamp mr-2">${timestamp}</span>
      <span class="flex-grow text-hacker-red">${message}</span>
    `;
  } else if (type === 'success') {
    logItem.innerHTML = `
      <span class="log-timestamp mr-2">${timestamp}</span>
      <span class="flex-grow text-green-400">${message}</span>
    `;
  } else {
    const lines = message.split('\n');
    logItem.innerHTML = lines.map(line => `
      <div class="flex items-start">
        <span class="log-timestamp mr-2">${timestamp}</span>
        <span class="flex-grow">${line}</span>
      </div>
    `).join('');
  }
  
  logRef.appendChild(logItem);
  logRef.scrollTop = logRef.scrollHeight;
};
