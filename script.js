document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('output');
  const input = document.getElementById('terminal-input');
  const prompt = document.querySelector('.prompt');
  const hiddenContent = document.getElementById('hidden-content');

  // Terminal history
  const commandHistory = [];
  let historyIndex = -1;

  // Username changes when unlocked
  let username = 'visitor';
  let isAdmin = false;
  
  // Simulate terminal loading
  simulateLoading();
  
  // Load saved command history
  loadCommandHistory();
  
  // Add accessibility improvements
  addAccessibilityFeatures();

  // Function to update the prompt
  function updatePrompt() {
    prompt.textContent = `${username}@portfolio:~$`;
  }

  // Function to add text to the terminal
  function addToTerminal(text, className = '') {
    const line = document.createElement('div');
    line.className = className;
    line.innerHTML = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Function to process commands
  function processCommand(command) {
    const cmd = command.trim().toLowerCase();
    const parts = cmd.split(' ');
    const mainCommand = parts[0];
    const args = parts.slice(1);

    // Add the command to history
    if (cmd && commandHistory[commandHistory.length - 1] !== cmd) {
      commandHistory.push(cmd);
      historyIndex = commandHistory.length;
      // Save command history
      saveCommandHistory();
    }

    // Add command to terminal with prompt
    addToTerminal(`<span class="prompt">${prompt.textContent}</span> ${command}`);

    // Process commands
    switch (mainCommand) {
      case 'help':
        showHelp();
        break;
      case 'clear':
        clearTerminal();
        break;
      case 'about':
        showContent('about-content');
        break;
      case 'skills':
        if (args.length > 0 && args[0] === 'search') {
          searchSkills(args.slice(1).join(' '));
        } else {
          showContent('skills-content');
        }
        break;
      case 'projects':
        showContent('projects-content');
        break;
      case 'contact':
        showContent('contact-content');
        break;
      case 'game':
        showContent('game-content');
        break;
      case 'adventure':
        startAdventure();
        break;
      case 'resume':
        showContent('resume-content');
        break;
      case 'social':
        showContent('social-content');
        break;
      case 'echo':
        addToTerminal(args.join(' '));
        break;
      case 'date':
        addToTerminal(new Date().toLocaleString());
        break;
      case 'whoami':
        addToTerminal(`You are currently logged in as: ${username}`);
        break;
      case 'sudo':
        handleSudo(args);
        break;
      case 'matrix':
        startMatrixEffect();
        break;
      case 'coffee':
        addToTerminal('<pre class="ascii-art">      ( (\n       ) )\n    .____.\n    |    |\n    |    |\n    |____|\n    |    |\n    \\____/\n\nHave a cup of coffee ☕</pre>');
        break;
      case 'secret':
        if (isAdmin) {
          addToTerminal('<span class="success">You found a secret! 🎉</span><br>Here\'s a hint for another command: Try "matrix"');
        } else {
          addToTerminal('<span class="error">Access denied. You need admin privileges.</span>');
        }
        break;
      case 'unlock':
        if (args.length > 0 && args[0] === 'portfolio123') {
          isAdmin = true;
          username = 'admin';
          updatePrompt();
          addToTerminal('<span class="success">Admin access granted! Try some secret commands now.</span>');
        } else {
          addToTerminal('<span class="error">Invalid password.</span>');
        }
        break;
      case 'theme':
        if (args[0] === 'dark') {
          document.documentElement.style.setProperty('--terminal-bg', '#1e1e1e');
          addToTerminal('<span class="success">Theme set to dark</span>');
        } else if (args[0] === 'light') {
          document.documentElement.style.setProperty('--terminal-bg', '#f0f0f0');
          document.documentElement.style.setProperty('--terminal-text', '#333333');
          addToTerminal('<span class="success">Theme set to light</span>');
        } else if (args[0] === 'hacker') {
          document.documentElement.style.setProperty('--terminal-bg', '#000000');
          document.documentElement.style.setProperty('--terminal-text', '#00ff00');
          document.documentElement.style.setProperty('--terminal-prompt', '#00ff00');
          addToTerminal('<span class="success">Theme set to hacker</span>');
        } else {
          addToTerminal('<span class="error">Available themes: dark, light, hacker</span>');
        }
        break;
      case 'level':
        if (args.length > 0) {
          showSkillLevel(args.join(' '));
        } else {
          addToTerminal('<span class="error">Usage: level [skill name]</span>');
        }
        break;
      case 'quote':
        showRandomQuote();
        break;
      case 'hack':
        startHackingSimulation();
        break;
      case '':
        // Do nothing for empty command
        break;
      default:
        addToTerminal(`<span class="error">Command not found: ${mainCommand}</span><br>Type <span class="command">help</span> to see available commands.`);
    }
  }

  // Function to handle sudo commands
  function handleSudo(args) {
    if (args.length === 0) {
      addToTerminal('<span class="error">Usage: sudo [command]</span>');
      return;
    }

    if (isAdmin) {
      // Process the sudo command
      addToTerminal(`<span class="success">Executing with admin privileges: ${args.join(' ')}</span>`);
      // You can add special sudo commands here
    } else {
      addToTerminal('<span class="error">Permission denied: You need admin privileges.</span>');
      addToTerminal('Hint: Try to <span class="command">unlock</span> the terminal first.');
    }
  }

  // Function to show content from hidden sections
  function showContent(contentId) {
    const content = hiddenContent.querySelector(`#${contentId}`);
    if (content) {
      addToTerminal(content.innerHTML);
    } else {
      addToTerminal(`<span class="error">Content not found: ${contentId}</span>`);
    }
  }

  // Function to search skills
  function searchSkills(query) {
    if (!query) {
      addToTerminal('<span class="error">Please provide a search term. Example: skills search networking</span>');
      return;
    }

    const skillsContent = hiddenContent.querySelector('#skills-content');
    const skills = skillsContent.querySelectorAll('.skill');
    const results = [];

    skills.forEach(skill => {
      if (skill.textContent.toLowerCase().includes(query.toLowerCase())) {
        results.push(skill.textContent);
      }
    });

    if (results.length > 0) {
      addToTerminal(`<span class="success">Found ${results.length} skills matching "${query}":</span>`);
      addToTerminal(`<div class="skill-list">${results.map(skill => `<div class="skill">${skill}</div>`).join('')}</div>`);
    } else {
      addToTerminal(`<span class="error">No skills found matching "${query}"</span>`);
    }
  }

  // Function to show help
  function showHelp() {
    showContent('help-content');
    // Add additional commands that might not be in help-content
    addToTerminal('<br><span class="command">adventure</span> - Play an interactive text adventure game');
    addToTerminal('<span class="command">theme</span> - Change terminal theme (dark, light, hacker)');
    addToTerminal('<span class="command">level</span> - View skill level (e.g., level javascript)');
    addToTerminal('<span class="command">quote</span> - Display a random inspirational quote');
    addToTerminal('<span class="command">hack</span> - Start a hacking simulation');
  }

  // Function to clear terminal
  function clearTerminal() {
    while (terminal.firstChild) {
      terminal.removeChild(terminal.firstChild);
    }
    // Re-add welcome message
    addToTerminal(`<div class="welcome-message">
      <pre class="ascii-art">
 _____       _                          ______                                _       
|  __ \\     | |                         | ___ \\                              | |      
| |  \\/_   _| |__   ___  ___ _ __ ___   | |_/ /___  _ __   __ _ _ __   __ _ | |_ ___ 
| | __| | | | '_ \\ / _ \\/ _ \\ '_ \` _ \\  |    // _ \\| '_ \\ / _\` | '_ \\ / _\` || __/ _ \\
| |_\\ \\ |_| | | | |  __/  __/ | | | | | | |\\ \\ (_) | | | | (_| | |_) | (_| || ||  __/
 \\____/\\__, |_| |_|\\___|\___|_| |_| |_| \\_| \\_\\___/|_| |_|\\__,_| .__/ \\__,_| \\_\\___|
        __/ |                                                  | |                   
       |___/                                                   |_|                   
      </pre>
      <p>Welcome to my interactive terminal portfolio! Type <span class="command">help</span> to see available commands.</p>
    </div>`);
    
    // Apply typewriter effect to the welcome message
    const welcomeP = document.querySelector('.welcome-message p');
    typeWriter(welcomeP, 'Welcome to my interactive terminal portfolio! Type help to see available commands.');
  }

  // Matrix effect
  function startMatrixEffect() {
    const matrixRain = document.createElement('div');
    matrixRain.className = 'matrix-rain';
    document.body.appendChild(matrixRain);

    // Create matrix columns
    for (let i = 0; i < 30; i++) {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      const columnHeight = Math.floor(Math.random() * 20) + 15;
      
      for (let j = 0; j < columnHeight; j++) {
        const char = document.createElement('span');
        char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
        char.style.opacity = j === 0 ? 1 : Math.random();
        char.style.animationDelay = `${Math.random() * 5}s`;
        column.appendChild(char);
      }
      
      matrixRain.appendChild(column);
    }

    // Allow user to escape matrix effect by clicking
    matrixRain.addEventListener('click', () => {
      document.body.removeChild(matrixRain);
      addToTerminal('<span class="success">Matrix shutdown complete.</span>');
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(matrixRain)) {
        document.body.removeChild(matrixRain);
        addToTerminal('<span class="success">Matrix effect timeout. Click anywhere to exit sooner next time.</span>');
      }
    }, 10000);
  }

  // Text adventure game
  let adventureState = {
    inProgress: false,
    currentRoom: 'start',
    inventory: [],
    visitedRooms: []
  };

  function startAdventure() {
    adventureState = {
      inProgress: true,
      currentRoom: 'start',
      inventory: [],
      visitedRooms: []
    };

    addToTerminal('<div class="welcome-message"><h3>The Portfolio Quest</h3><p>Welcome to a mini text adventure! Type <span class="command">look</span> to examine your surroundings, <span class="command">go [direction]</span> to move, <span class="command">take [item]</span> to collect items, and <span class="command">inventory</span> to see collected items. Type <span class="command">quit</span> to exit the game.</p></div>');
    
    // Show the first room
    showRoom(adventureState.currentRoom);
  }

  function showRoom(roomId) {
    const rooms = {
      'start': {
        description: 'You find yourself in a terminal-like interface. There are paths leading to different sections of a portfolio. You see a glowing <span class="command">skills</span> door to the north, a <span class="command">projects</span> hallway to the east, and a mysterious <span class="command">secret</span> passage to the west.',
        exits: { north: 'skills', east: 'projects', west: 'secret' },
        items: ['map']
      },
      'skills': {
        description: 'You\'ve entered the Skills Chamber. The walls are lined with glowing technologies and programming languages. There\'s a <span class="command">networking</span> certificate on a pedestal.',
        exits: { south: 'start', east: 'cloud' },
        items: ['networking']
      },
      'cloud': {
        description: 'This room is filled with floating cloud symbols representing various cloud platforms. You can see Azure and AWS logos hovering in the air.',
        exits: { west: 'skills', south: 'projects' },
        items: ['cloud_token']
      },
      'projects': {
        description: 'The Projects Gallery stretches before you. Interactive displays showcase various coding projects. There\'s a small <span class="command">usb</span> drive on a table.',
        exits: { west: 'start', north: 'cloud', south: 'contact' },
        items: ['usb']
      },
      'secret': {
        description: 'You\'ve discovered a hidden room! This seems to be where secret commands are stored. There\'s a piece of paper with the text "<span class="command">portfolio123</span>" written on it.',
        exits: { east: 'start' },
        items: ['password_note']
      },
      'contact': {
        description: 'You\'ve reached the Contact Portal. There are screens showing various social media platforms and contact methods.',
        exits: { north: 'projects' },
        items: []
      }
    };

    const room = rooms[roomId];
    
    if (!room) {
      addToTerminal('<span class="error">Error: Room not found!</span>');
      return;
    }

    // Mark room as visited
    if (!adventureState.visitedRooms.includes(roomId)) {
      adventureState.visitedRooms.push(roomId);
    }

    // Display room description
    addToTerminal(`<div class="adventure-room"><p>${room.description}</p></div>`);

    // Check for victory condition
    if (adventureState.visitedRooms.length >= 5 && adventureState.inventory.length >= 3) {
      addToTerminal('<span class="success">Congratulations! You\'ve explored most of my portfolio and collected several items. You\'ve completed the Portfolio Quest!</span>');
      addToTerminal('<span class="success">As a reward, here\'s a hint: Try using the "<span class="command">unlock portfolio123</span>" command in the main terminal!</span>');
      adventureState.inProgress = false;
    }
  }

  function processAdventureCommand(command) {
    const parts = command.toLowerCase().split(' ');
    const action = parts[0];
    const target = parts.slice(1).join(' ');

    const rooms = {
      'start': {
        description: 'You find yourself in a terminal-like interface. There are paths leading to different sections of a portfolio. You see a glowing <span class="command">skills</span> door to the north, a <span class="command">projects</span> hallway to the east, and a mysterious <span class="command">secret</span> passage to the west.',
        exits: { north: 'skills', east: 'projects', west: 'secret' },
        items: ['map']
      },
      'skills': {
        description: 'You\'ve entered the Skills Chamber. The walls are lined with glowing technologies and programming languages. There\'s a <span class="command">networking</span> certificate on a pedestal.',
        exits: { south: 'start', east: 'cloud' },
        items: ['networking']
      },
      'cloud': {
        description: 'This room is filled with floating cloud symbols representing various cloud platforms. You can see Azure and AWS logos hovering in the air.',
        exits: { west: 'skills', south: 'projects' },
        items: ['cloud_token']
      },
      'projects': {
        description: 'The Projects Gallery stretches before you. Interactive displays showcase various coding projects. There\'s a small <span class="command">usb</span> drive on a table.',
        exits: { west: 'start', north: 'cloud', south: 'contact' },
        items: ['usb']
      },
      'secret': {
        description: 'You\'ve discovered a hidden room! This seems to be where secret commands are stored. There\'s a piece of paper with the text "<span class="command">portfolio123</span>" written on it.',
        exits: { east: 'start' },
        items: ['password_note']
      },
      'contact': {
        description: 'You\'ve reached the Contact Portal. There are screens showing various social media platforms and contact methods.',
        exits: { north: 'projects' },
        items: []
      }
    };

    const currentRoom = rooms[adventureState.currentRoom];

    switch (action) {
      case 'look':
        showRoom(adventureState.currentRoom);
        break;
      case 'go':
        if (!target) {
          addToTerminal('<span class="error">Go where? Try: go north, go east, go south, go west</span>');
          return;
        }
        
        if (currentRoom.exits[target]) {
          adventureState.currentRoom = currentRoom.exits[target];
          showRoom(adventureState.currentRoom);
        } else {
          addToTerminal(`<span class="error">You can't go ${target} from here.</span>`);
        }
        break;
      case 'take':
        if (!target) {
          addToTerminal('<span class="error">Take what? Specify an item to take.</span>');
          return;
        }
        
        const roomItems = rooms[adventureState.currentRoom].items;
        const itemIndex = roomItems.findIndex(item => 
          item.toLowerCase() === target || 
          item.toLowerCase().includes(target)
        );
        
        if (itemIndex !== -1) {
          const item = roomItems[itemIndex];
          roomItems.splice(itemIndex, 1);
          adventureState.inventory.push(item);
          addToTerminal(`<span class="success">You took the ${item}.</span>`);
        } else {
          addToTerminal(`<span class="error">There's no ${target} here to take.</span>`);
        }
        break;
      case 'inventory':
        if (adventureState.inventory.length === 0) {
          addToTerminal('<span class="error">Your inventory is empty.</span>');
        } else {
          addToTerminal('<span class="success">Inventory:</span>');
          adventureState.inventory.forEach(item => {
            addToTerminal(`- ${item}`);
          });
        }
        break;
      case 'quit':
        addToTerminal('<span class="success">Exiting the adventure. Come back anytime!</span>');
        adventureState.inProgress = false;
        break;
      default:
        addToTerminal(`<span class="error">Unknown adventure command: ${action}</span>`);
        addToTerminal('Try: <span class="command">look</span>, <span class="command">go [direction]</span>, <span class="command">take [item]</span>, <span class="command">inventory</span>, or <span class="command">quit</span>');
    }
  }

  // Event listener for input
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value;
      input.value = '';
      
      if (adventureState.inProgress) {
        addToTerminal(`<span class="prompt">adventure></span> ${command}`);
        processAdventureCommand(command);
      } else {
        processCommand(command);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const command = input.value.toLowerCase();
      const commands = [
        'help', 'clear', 'about', 'skills', 'projects', 
        'contact', 'game', 'resume', 'social', 'echo', 
        'date', 'whoami', 'sudo', 'matrix', 'coffee', 
        'secret', 'unlock', 'theme', 'level', 'quote', 'hack',
        'adventure'
      ];
      
      const matches = commands.filter(cmd => cmd.startsWith(command));
      if (matches.length === 1) {
        input.value = matches[0];
      } else if (matches.length > 1) {
        addToTerminal(`<span class="prompt">${prompt.textContent}</span> ${command}`);
        addToTerminal(matches.join('  '));
      }
    }
  });

  // Auto-focus input when clicking anywhere in the terminal window
  document.querySelector('.terminal-window').addEventListener('click', () => {
    input.focus();
  });

  // Initialize with welcome message (it's already in the HTML)

  // NEW FUNCTIONS
  
  // Typewriter effect
  function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.innerHTML = '';
    
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
  
  // Command history persistence
  function saveCommandHistory() {
    localStorage.setItem('terminal_history', JSON.stringify(commandHistory.slice(-20)));
  }

  function loadCommandHistory() {
    const savedHistory = localStorage.getItem('terminal_history');
    if (savedHistory) {
      commandHistory.push(...JSON.parse(savedHistory));
      historyIndex = commandHistory.length;
    }
  }
  
  // Add accessibility features
  function addAccessibilityFeatures() {
    document.querySelector('.terminal-container').setAttribute('role', 'application');
    document.querySelector('.terminal-container').setAttribute('aria-label', 'Terminal Portfolio');
    document.querySelector('.terminal-output').setAttribute('role', 'log');
    document.querySelector('.terminal-output').setAttribute('aria-live', 'polite');
    
    // Add skip to command input link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#terminal-input';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to command input';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  // Skill level visualization
  function showSkillLevel(skill) {
    const skills = {
      'javascript': 85,
      'html': 95,
      'css': 90,
      'python': 80,
      'networking': 75,
      'linux': 70,
      // Add your skills and proficiency levels
    };
    
    const level = skills[skill.toLowerCase()];
    if (level) {
      const bars = Math.floor(level / 10);
      let progressBar = '[';
      for (let i = 0; i < 10; i++) {
        progressBar += i < bars ? '█' : '░';
      }
      progressBar += `] ${level}%`;
      addToTerminal(`<span>${skill}: ${progressBar}</span>`);
    } else {
      addToTerminal(`<span class="error">Skill '${skill}' not found. Try: javascript, html, css, python, networking, linux</span>`);
    }
  }
  
  // Random quote function
  function showRandomQuote() {
    const quotes = [
      "The best way to predict the future is to invent it. - Alan Kay",
      "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it. - Patrick McKenzie",
      "Code is like humor. When you have to explain it, it's bad. - Cory House",
      "First, solve the problem. Then, write the code. - John Johnson",
      "It's not at all important to get it right the first time. It's vitally important to get it right the last time. - Andrew Hunt",
      "Programming isn't about what you know; it's about what you can figure out. - Chris Pine"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    addToTerminal(`<span style="color: #f4d03f;">"${randomQuote}"</span>`);
  }
  
  // Hacking simulation
  function startHackingSimulation() {
    addToTerminal('<span style="color: #ff5f56;">Initiating hack sequence...</span>');
    
    const steps = [
      "Scanning network...",
      "Bypassing firewall...",
      "Obtaining access...",
      "Decrypting files...",
      "Extracting data...",
      "Covering tracks..."
    ];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        const percent = Math.floor(Math.random() * 31) + 70; // 70-100%
        addToTerminal(`<span style="color: #ff5f56;">${step} ${percent}% complete</span>`);
        
        if (index === steps.length - 1) {
          setTimeout(() => {
            addToTerminal('<span style="color: #ff5f56; font-weight: bold;">HACK COMPLETE: You found another easter egg!</span>');
            addToTerminal('<span style="color: #ff5f56;">Try typing <span class="command">quote</span> for inspirational developer quotes.</span>');
          }, 1000);
        }
      }, index * 1500);
    });
  }
  
  // Loading animation
  function simulateLoading() {
    clearTerminal(); // Clear any existing content
    
    const bootSequence = [
      "Initializing system...",
      "Loading kernel modules...",
      "Mounting filesystem...",
      "Starting network services...",
      "Launching portfolio interface..."
    ];
    
    bootSequence.forEach((line, index) => {
      setTimeout(() => {
        addToTerminal(`<span style="color: #88c0d0;">${line}</span>`);
        
        // After all boot messages, show the welcome screen
        if (index === bootSequence.length - 1) {
          setTimeout(() => {
            clearTerminal();
            addToTerminal(`<div class="welcome-message">
              <pre class="ascii-art">
 _____       _                          ______                                _       
|  __ \\     | |                         | ___ \\                              | |      
| |  \\/_   _| |__   ___  ___ _ __ ___   | |_/ /___  _ __   __ _ _ __   __ _ | |_ ___ 
| | __| | | | '_ \\ / _ \\/ _ \\ '_ \` _ \\  |    // _ \\| '_ \\ / _\` | '_ \\ / _\` || __/ _ \\
| |_\\ \\ |_| | | | |  __/  __/ | | | | | | |\\ \\ (_) | | | | (_| | |_) | (_| || ||  __/
 \\____/\\__, |_| |_|\\___|\___|_| |_| |_| \\_| \\_\\___/|_| |_|\\__,_| .__/ \\__,_| \\_\\___|
        __/ |                                                  | |                   
       |___/                                                   |_|                   
              </pre>
              <p></p>
            </div>`);
            
            // Apply typewriter effect to welcome message
            const welcomeP = document.querySelector('.welcome-message p');
            typeWriter(welcomeP, 'Welcome to my interactive terminal portfolio! Type help to see available commands.');
          }, 1000);
        }
      }, index * 800);
    });
  }
});
  