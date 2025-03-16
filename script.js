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

  // Flag to track if welcome message has been shown
  let welcomeMessageShown = false;
  
  // Default typing speed
  let typingSpeed = 25; // milliseconds between characters
  
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
        if (args.length > 0 && args[0] === 'search') {
          searchProjects(args.slice(1).join(' '));
        } else {
          showContent('projects-content');
        }
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
      case 'certs':
      case 'certifications':
        showCertifications();
        break;
      case 'interests':
      case 'hobbies':
        showInterests();
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
      case 'speed':
        if (args.length > 0 && ['slow', 'medium', 'fast', 'instant'].includes(args[0])) {
          setTypingSpeed(args[0]);
        } else {
          addToTerminal('<span class="error">Usage: speed [slow|medium|fast|instant]</span>');
        }
        break;
      case 'weather':
        if (args.length > 0) {
          showWeather(args.join(' '));
        } else {
          addToTerminal('<span class="error">Usage: weather [city name]</span>');
        }
        break;
      case 'download':
        if (args.length > 0 && args[0] === 'resume') {
          downloadResume();
        } else {
          addToTerminal('<span class="error">Usage: download resume</span>');
        }
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

  // Function to search projects
  function searchProjects(query) {
    if (!query) {
      addToTerminal('<span class="error">Please provide a search term. Example: projects search python</span>');
      return;
    }

    const projectsContent = hiddenContent.querySelector('#projects-content');
    const projects = projectsContent.querySelectorAll('.project');
    const results = [];

    projects.forEach(project => {
      if (project.textContent.toLowerCase().includes(query.toLowerCase())) {
        const title = project.querySelector('h3').textContent;
        const description = project.querySelector('p').textContent;
        results.push({ title, description });
      }
    });

    if (results.length > 0) {
      addToTerminal(`<span class="success">Found ${results.length} projects matching "${query}":</span>`);
      results.forEach(project => {
        addToTerminal(`<div class="project-result">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>`);
      });
    } else {
      addToTerminal(`<span class="error">No projects found matching "${query}"</span>`);
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
    addToTerminal('<span class="command">download resume</span> - Download my resume');
    addToTerminal('<span class="command">certs</span> - View my certifications and credentials');
    addToTerminal('<span class="command">interests</span> - Show my personal interests and hobbies');
    addToTerminal('<span class="command">projects search</span> - Search for specific projects (e.g., projects search python)');
    addToTerminal('<span class="command">speed</span> - Change typing speed (slow, medium, fast, instant)');
    addToTerminal('<span class="command">weather</span> - Show weather for a city (e.g., weather New York)');
    
    // Add keyboard shortcuts
    addToTerminal('<br><strong>Keyboard Shortcuts:</strong>');
    addToTerminal('<span class="command">Ctrl+L</span> - Clear terminal');
    addToTerminal('<span class="command">Tab</span> - Autocomplete commands');
    addToTerminal('<span class="command">↑/↓</span> - Navigate command history');
    addToTerminal('<span class="command">Escape</span> - Exit adventure mode');
  }

  // Function to clear terminal
  function clearTerminal() {
    // Clear all content
    while (terminal.firstChild) {
      terminal.removeChild(terminal.firstChild);
    }
    
    // Set flag - welcome message will be shown after clearing
    welcomeMessageShown = true;
    
    // Add welcome message
    addToTerminal(`<div class="welcome-message">
      <pre class="ascii-art">
 _____       _                         ______                               _        
| ___ \\     | |                        | ___ \\                             | |       
| |_/ /\_   _| |__   ___  ___ _ __ ___ | |_/ / ___  _ __   __ _ _ __   __ _| |_ ___  
|    /| | | | '_ \\ / _ \\/ _ \\ '_ \` _ \\| ___ \\/ _ \\| '_ \\ / _\` | '_ \\ / _\` | __/ _ \\ 
| |\\ \\| |_| | | | |  __/  __/ | | | | | |_/ / (_) | | | | (_| | |_) | (_| | ||  __/ 
\\_| \\_|\\__, |_| |_|\\___|\\___| |_| |_|_\\____/ \\___/|_| |_|\\__,_| .__/ \\__,_|\\__\\___| 
        __/ |                                                  | |                   
       |___/                                                   |_|                   
              </pre>
              <p></p>
            </div>`);
    
    // Apply typewriter effect only once and with a guaranteed clean target
    const welcomeP = document.querySelector('.welcome-message p');
    if (welcomeP) {
      // Make sure we reset the innerHTML before starting to type
      welcomeP.innerHTML = '';
      
      // Use a short delay to ensure any previous typewriter effects have been cancelled
      setTimeout(() => {
        typeWriter(welcomeP, 'Welcome to my interactive terminal portfolio! Type help to see available commands.', 15);
      }, 50);
    }
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
        'adventure', 'download', 'certs', 'certifications',
        'interests', 'hobbies', 'weather'
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
  function typeWriter(element, text, speed = null) {
    // Use provided speed or global typingSpeed
    const typeDelay = speed || typingSpeed;
    
    // Create a static counter for instances
    typeWriter.counter = (typeWriter.counter || 0) + 1;
    const myInstance = typeWriter.counter;
    
    // Cancel any existing typewriter effect
    if (element._typewriterTimer) {
      clearInterval(element._typewriterTimer);
    }
    
    // Reset content
    element.innerHTML = '';
    let i = 0;
    
    // For instant typing
    if (typeDelay <= 1) {
      element.innerHTML = text;
      return;
    }
    
    const timer = setInterval(() => {
      // If a newer typewriter has started, cancel this one
      if (myInstance !== typeWriter.counter) {
        clearInterval(timer);
        return;
      }
      
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        element._typewriterTimer = null;
      }
    }, typeDelay);
    
    // Store the timer so it can be cancelled if needed
    element._typewriterTimer = timer;
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
    // If welcome message has already been shown, don't show it again
    if (welcomeMessageShown) {
      return;
    }
    
    // Clear any existing content immediately
    while (terminal.firstChild) {
      terminal.removeChild(terminal.firstChild);
    }
    
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
            // Clear the terminal again before showing welcome message
            while (terminal.firstChild) {
              terminal.removeChild(terminal.firstChild);
            }
            
            // Add welcome message with ASCII art
            addToTerminal(`<div class="welcome-message">
              <pre class="ascii-art">
 _____       _                         ______                               _        
| ___ \\     | |                        | ___ \\                             | |       
| |_/ /\_   _| |__   ___  ___ _ __ ___ | |_/ / ___  _ __   __ _ _ __   __ _| |_ ___  
|    /| | | | '_ \\ / _ \\/ _ \\ '_ \` _ \\| ___ \\/ _ \\| '_ \\ / _\` | '_ \\ / _\` | __/ _ \\ 
| |\\ \\| |_| | | | |  __/  __/ | | | | | |_/ / (_) | | | | (_| | |_) | (_| | ||  __/ 
\\_| \\_|\\__, |_| |_|\\___|\\___| |_| |_|_\\____/ \\___/|_| |_|\\__,_| .__/ \\__,_|\\__\\___| 
        __/ |                                                  | |                   
       |___/                                                   |_|                   
              </pre>
              <p></p>
            </div>`);
            
            // Apply typewriter effect to welcome message once
            const welcomeP = document.querySelector('.welcome-message p');
            if (welcomeP) {
              welcomeP.innerHTML = ''; // Ensure it's empty before typing
              typeWriter(welcomeP, 'Welcome to my interactive terminal portfolio! Type help to see available commands.');
            }
            
            // Set flag indicating welcome message has been shown
            welcomeMessageShown = true;
          }, 1000);
        }
      }, index * 800);
    });
  }

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Skip if inside input field or if modifiers other than Ctrl are pressed
    if (e.target.tagName === 'INPUT' && e.target.id !== 'terminal-input') return;
    if (e.altKey || e.metaKey) return;
    
    // Ctrl+L: Clear terminal (like in real terminals)
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      clearTerminal();
      return;
    }
    
    // Escape: Exit adventure mode
    if (e.key === 'Escape' && adventureState.inProgress) {
      e.preventDefault();
      addToTerminal('<span class="success">Exiting the adventure. Come back anytime!</span>');
      adventureState.inProgress = false;
      return;
    }
    
    // Focus terminal input when typing starts
    if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
      if (document.activeElement !== input) {
        input.focus();
        // If it's a character key, add it to the input
        input.value += e.key;
        e.preventDefault();
      }
    }
  });

  // Function to download resume
  function downloadResume() {
    // Create a dummy resume file (you would replace this with a link to your actual resume)
    const resumeContent = `
Name: Ryheem Bonaparte
Title: Developer & Designer
Contact: your-email@example.com

SUMMARY
=======
Innovative developer with skills in frontend, backend, and design.

SKILLS
======
- JavaScript, HTML, CSS
- UI/UX Design
- Terminal Applications
- Interactive Web Development

EXPERIENCE
==========
- Interactive Portfolio Creation
- Web Development Projects
- UI/UX Design Implementation
`;

    // Create a blob from the text
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    
    // Create a URL from the blob
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ryheem_bonaparte_resume.txt';
    
    // Append to the body temporarily
    document.body.appendChild(a);
    
    // Programmatically click the link
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToTerminal('<span class="success">Resume download started...</span>');
    addToTerminal('For a proper resume, update the downloadResume function with your actual resume file.');
  }

  // Add mobile touch enhancements
  function addMobileTouchSupport() {
    // Only add mobile-specific enhancements if on a touch device
    if ('ontouchstart' in window) {
      // Create mobile command buttons
      const mobileCommandsContainer = document.createElement('div');
      mobileCommandsContainer.className = 'mobile-commands';
      mobileCommandsContainer.innerHTML = `
        <div class="mobile-commands-container">
          <button class="mobile-cmd-btn" data-cmd="help">help</button>
          <button class="mobile-cmd-btn" data-cmd="clear">clear</button>
          <button class="mobile-cmd-btn" data-cmd="about">about</button>
          <button class="mobile-cmd-btn" data-cmd="skills">skills</button>
          <button class="mobile-cmd-btn" data-cmd="projects">projects</button>
          <button class="mobile-cmd-btn" data-cmd="theme">theme</button>
          <button class="mobile-cmd-btn" data-cmd="more">more...</button>
        </div>
      `;
      
      document.querySelector('.terminal-window').appendChild(mobileCommandsContainer);
      
      // Handle mobile command button clicks
      document.querySelectorAll('.mobile-cmd-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cmd = btn.getAttribute('data-cmd');
          
          if (cmd === 'more') {
            // Show expanded command set
            mobileCommandsContainer.innerHTML = `
              <div class="mobile-commands-container">
                <button class="mobile-cmd-btn" data-cmd="contact">contact</button>
                <button class="mobile-cmd-btn" data-cmd="adventure">adventure</button>
                <button class="mobile-cmd-btn" data-cmd="quote">quote</button>
                <button class="mobile-cmd-btn" data-cmd="matrix">matrix</button>
                <button class="mobile-cmd-btn" data-cmd="download resume">resume</button>
                <button class="mobile-cmd-btn" data-cmd="certs">certs</button>
                <button class="mobile-cmd-btn" data-cmd="hack">hack</button>
                <button class="mobile-cmd-btn" data-cmd="back">back</button>
              </div>
            `;
          } else if (cmd === 'back') {
            // Return to main command set
            mobileCommandsContainer.innerHTML = `
              <div class="mobile-commands-container">
                <button class="mobile-cmd-btn" data-cmd="help">help</button>
                <button class="mobile-cmd-btn" data-cmd="clear">clear</button>
                <button class="mobile-cmd-btn" data-cmd="about">about</button>
                <button class="mobile-cmd-btn" data-cmd="skills">skills</button>
                <button class="mobile-cmd-btn" data-cmd="projects">projects</button>
                <button class="mobile-cmd-btn" data-cmd="theme">theme</button>
                <button class="mobile-cmd-btn" data-cmd="more">more...</button>
              </div>
            `;
          } else {
            // Execute the command
            input.value = cmd;
            input.focus();
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            input.dispatchEvent(event);
          }
        });
      });
    }
  }
  
  // Call mobile enhancements function
  addMobileTouchSupport();

  // Function to display certifications
  function showCertifications() {
    addToTerminal(`<h2>My Certifications</h2>`);
    
    const certifications = [
      {
        name: "Meta Front-End Developer",
        issuer: "Meta",
        date: "Feb 2025",
        id: "2WVGJMWQLS41",
        skills: "React, JavaScript, UI/UX Design, Responsive Web Design"
      },
      {
        name: "Python for Data Science, AI & Development",
        issuer: "IBM",
        date: "Feb 2025",
        id: "PLKJMXLEP0AY",
        skills: "Python, Pandas, NumPy, Matplotlib, Machine Learning"
      },
      {
        name: "Azure-900 Azure Fundamentals",
        issuer: "Microsoft",
        date: "Jun 2022",
        id: "993323586",
        skills: "Active Directory, Cloud Applications, Azure Services"
      },
      {
        name: "Linux Essentials",
        issuer: "Linux Professional Institute (LPI)",
        date: "Jun 2022",
        id: "LPI00527013",
        skills: "Linux Administration, Command Line, Shell Scripting"
      },
      {
        name: "Google IT Support Specialization",
        issuer: "Coursera",
        date: "Jan 2022",
        id: "JAHSRRGECC89",
        skills: "IT Support, Networking, Troubleshooting, Customer Service"
      },
      {
        name: "MTA: Networking Fundamentals",
        issuer: "Microsoft",
        date: "Oct 2021",
        id: "Ryheem Bonaparte",
        skills: "Networking, IT Infrastructure, Customer Service, Cloud"
      }
    ];
    
    certifications.forEach(cert => {
      // Create a visually distinct box for each certification
      addToTerminal(`
        <div style="margin: 10px 0; padding: 10px; border-left: 3px solid var(--terminal-green); background-color: rgba(0, 255, 0, 0.05);">
          <strong style="color: var(--terminal-blue);">${cert.name}</strong> - ${cert.issuer} <span style="color: var(--terminal-gray);">(${cert.date})</span>
          <br>
          <span style="color: var(--terminal-gray);">ID: ${cert.id}</span>
          <br>
          <span style="color: var(--terminal-green);">Skills: ${cert.skills}</span>
        </div>
      `);
    });
    
    // Add information about in-progress certifications
    addToTerminal(`<div style="margin-top: 15px;"><strong>In Progress:</strong> Network+ certification</div>`);
    
    // Add a tip about viewing full resume
    addToTerminal(`<div style="margin-top: 20px; font-style: italic; color: var(--terminal-gray);">Type <span class="command">resume</span> to see my full resume or <span class="command">download resume</span> to download a copy.</div>`);
  }

  // Function to show personal interests and hobbies
  function showInterests() {
    addToTerminal(`<h2>Personal Interests & Hobbies</h2>`);
    
    const interests = [
      {
        category: "Technology",
        items: ["Cloud Computing", "Cybersecurity", "Networking", "Open Source Projects", "Linux"]
      },
      {
        category: "Learning",
        items: ["Technical Certifications", "Online Courses", "Technology Books", "Industry Podcasts"]
      },
      {
        category: "Creative",
        items: ["Web Design", "UI/UX Exploration", "Technical Writing", "Digital Art"]
      },
      {
        category: "Others",
        items: ["Fitness", "Travel", "Photography", "Gaming"]
      }
    ];
    
    interests.forEach(category => {
      // Display each category and its interests
      addToTerminal(`
        <div style="margin: 15px 0;">
          <h3 style="color: var(--terminal-blue); margin-bottom: 10px;">${category.category}</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-left: 15px;">
            ${category.items.map(item => 
              `<span style="background: rgba(0, 255, 0, 0.1); padding: 5px 10px; border-radius: 4px; color: var(--terminal-green);">${item}</span>`
            ).join('')}
          </div>
        </div>
      `);
    });
    
    // Add a personal note
    addToTerminal(`
      <div style="margin-top: 20px; font-style: italic; border-left: 3px solid var(--terminal-blue); padding-left: 15px;">
        "I'm passionate about exploring new technologies and continuously enhancing my skills. When I'm not coding or learning, you'll find me enjoying these interests."
      </div>
    `);
  }

  // Function to set typing speed
  function setTypingSpeed(speed) {
    typingSpeed = speed === 'slow' ? 50 : speed === 'medium' ? 25 : speed === 'fast' ? 15 : 10;
    addToTerminal(`<span class="success">Typing speed set to ${speed}</span>`);
  }

  // Function to show weather for a city
  function showWeather(city) {
    addToTerminal(`<span>Fetching weather data for "${city}"...</span>`);
    
    // Using OpenWeatherMap API (free tier)
    const apiKey = ''; // You'll need to get your own API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=imperial&appid=${apiKey}`;
    
    if (!apiKey) {
      // Fallback to a demo response if no API key is provided
      setTimeout(() => {
        const mockWeather = {
          name: city,
          main: {
            temp: Math.floor(Math.random() * 30) + 60,
            feels_like: Math.floor(Math.random() * 30) + 60,
            humidity: Math.floor(Math.random() * 50) + 30
          },
          weather: [{ description: ['sunny', 'partly cloudy', 'overcast', 'light rain', 'clear'][Math.floor(Math.random() * 5)] }],
          wind: { speed: Math.floor(Math.random() * 15) + 5 }
        };
        displayWeatherData(mockWeather);
      }, 1000);
      return;
    }
    
    // Fetch weather data
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('City not found or API error');
        }
        return response.json();
      })
      .then(data => {
        displayWeatherData(data);
      })
      .catch(error => {
        addToTerminal(`<span class="error">Error: ${error.message}</span>`);
      });
  }
  
  // Helper function to display weather data
  function displayWeatherData(data) {
    const weatherHTML = `
      <div style="margin: 15px 0; padding: 15px; border-radius: 8px; background: rgba(0, 100, 255, 0.1); color: var(--terminal-text);">
        <h3 style="margin-top: 0; color: var(--terminal-blue);">Weather for ${data.name}</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="font-size: 2em; margin-bottom: 10px;">${Math.round(data.main.temp)}°F</div>
            <div>Feels like: ${Math.round(data.main.feels_like)}°F</div>
            <div style="text-transform: capitalize;">${data.weather[0].description}</div>
          </div>
          <div>
            <div>Humidity: ${data.main.humidity}%</div>
            <div>Wind: ${Math.round(data.wind.speed)} mph</div>
          </div>
        </div>
      </div>
    `;
    addToTerminal(weatherHTML);
  }
});
  