// DEMO ALIEN CODE TRANSLATOR - NO API COSTS!
// This version uses pre-written responses instead of calling the API

const DEMO_RESPONSES = {
  // Async/Await questions
  'async': {
    insight: `Think of async/await like receiving transmissions from distant planets. You can't force the signal to arrive faster, but you can set up a receiver (await) to handle it when it comes. The async keyword tells your ship (function) that it's equipped to handle these long-distance communications.`,
    
    code: `// 🛸 Async function - our interstellar communication hub
async function receiveTransmission(planetId) {
  console.log('📡 Establishing connection to planet:', planetId);
  
  try {
    // ⏳ Await - patiently waiting for the signal
    const signal = await fetchFromDistantPlanet(planetId);
    
    // 🎉 Transmission received!
    console.log('✨ Decoded message:', signal.data);
    return signal;
    
  } catch (error) {
    // 🚨 Communication disrupted by space anomaly
    console.error('⚠️ Transmission failed:', error.message);
    throw new Error('Unable to reach planet - cosmic interference detected');
  }
}

// 🌌 Helper function - simulates space-time delay
function fetchFromDistantPlanet(planetId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        planetId,
        data: 'Greetings from the Andromeda sector! 👋'
      });
    }, 2000);
  });
}`,
    
    principles: `Async functions always return promises. The await keyword pauses execution until the promise resolves, but doesn't block the entire program - just like waiting for a transmission while your ship continues other operations.`,
    
    related: `Check out "LOG 005: Navigating the Async Cosmos" for more on promises and async patterns.`,
    
    nextMission: `Try implementing error handling with try/catch, or explore Promise.all() for handling multiple transmissions simultaneously!`
  },

  // React Hooks
  'hook': {
    insight: `Custom hooks are like alien technology modules you can plug into any spacecraft (component). Once you've engineered a solution, you can reuse it across your entire fleet without rebuilding from scratch each time.`,
    
    code: `// 🛸 Custom hook - reusable alien tech
import { useState, useEffect } from 'react';

function useSpaceData(planetId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 📡 Initiate transmission
    setLoading(true);
    
    fetch(\`https://space-api.com/planets/\${planetId}\`)
      .then(response => response.json())
      .then(data => {
        setData(data); // ✨ Data received!
        setLoading(false);
      })
      .catch(err => {
        setError(err); // ⚠️ Cosmic interference
        setLoading(false);
      });
  }, [planetId]); // 🔄 Retransmit when planet changes

  return { data, loading, error };
}

// 🚀 Use the hook in any component
function SpaceshipDashboard() {
  const { data, loading, error } = useSpaceData('mars');
  
  if (loading) return <div>📡 Receiving transmission...</div>;
  if (error) return <div>⚠️ Signal lost!</div>;
  
  return <div>✨ Planet data: {data.name}</div>;
}`,
    
    principles: `Custom hooks must start with "use" and can call other hooks. They extract reusable logic that multiple components need. Think of them as creating your own alien technology that any component can utilize.`,
    
    related: `Explore "LOG 008: The Hook Dimension" for advanced custom hook patterns.`,
    
    nextMission: `Try creating a useDebounce hook or useLocalStorage hook to expand your alien tech arsenal!`
  },

  // Debounce
  'debounce': {
    insight: `Debouncing is like setting up a buffer zone around your planet. If incoming ships arrive too quickly, you wait until the traffic calms down before processing them all at once. This prevents your systems from being overwhelmed by a meteor shower of requests.`,
    
    code: `// 🛸 Debounce function - traffic control for your starbase
function debounce(func, delay = 500) {
  let timeoutId;
  
  return function(...args) {
    // 🚨 New ship approaching! Cancel previous countdown
    clearTimeout(timeoutId);
    
    // ⏳ Start new countdown - if no ships arrive during this time, process
    timeoutId = setTimeout(() => {
      func.apply(this, args); // 🎯 All clear! Process the request
    }, delay);
  };
}

// 📡 Usage: Search as user types
const handleSearch = debounce((searchTerm) => {
  console.log('🔍 Searching galaxy for:', searchTerm);
  // Actual search logic here
}, 300);

// 🎮 In your React component
function SearchBar() {
  return (
    <input
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search the cosmos..."
    />
  );
}`,
    
    principles: `Debouncing delays execution until a pause in activity. It's essential for search inputs, resize handlers, and scroll events. Without it, you'd make hundreds of unnecessary calls - like launching a probe for every keystroke!`,
    
    related: `See "LOG 012: Optimizing Warp Speed" for more performance patterns.`,
    
    nextMission: `Implement throttling next - it's similar but allows periodic execution during continuous activity. Perfect for scroll events!`
  },

  // Array methods
  'map': {
    insight: `Think of .map() as a teleportation array - it takes every item from one dimension (array) and transforms it into a parallel dimension with the same number of items, but each one has been modified by passing through your transformation portal.`,
    
    code: `// 🛸 Map - transform every item in the fleet
const spaceCrafts = ['Apollo', 'Voyager', 'Enterprise'];

// ✨ Transform each ship name to uppercase
const transformed = spaceCrafts.map(ship => {
  return ship.toUpperCase() + ' 🚀';
});
// Result: ['APOLLO 🚀', 'VOYAGER 🚀', 'ENTERPRISE 🚀']

// 🌌 Map with objects - upgrade each ship
const fleet = [
  { name: 'Scout', level: 1 },
  { name: 'Cruiser', level: 2 }
];

const upgradedFleet = fleet.map(ship => ({
  ...ship,
  level: ship.level + 1,
  upgraded: true
}));`,
    
    principles: `.map() creates a NEW array with the same length. It doesn't modify the original array. Use it whenever you need to transform every element. Unlike forEach, map returns a value.`,
    
    related: `Learn about filter() and reduce() in "LOG 009: Array Manipulation Mastery"`,
    
    nextMission: `Try chaining map() with filter() to transform and select specific items!`
  },

  // State management
  'state': {
    insight: `React state is like your spaceship's control panel - it holds current values that determine how your ship behaves. When state changes, React re-renders your component to reflect the new reality, just like your dashboard updates when you adjust the controls.`,
    
    code: `// 🛸 useState - your ship's control panel
import { useState } from 'react';

function SpaceshipControl() {
  // 🎮 State declarations
  const [fuel, setFuel] = useState(100);
  const [speed, setSpeed] = useState(0);
  const [shields, setShields] = useState(true);

  // ⚡ Update functions
  const accelerate = () => {
    if (fuel > 0) {
      setSpeed(prev => prev + 10);
      setFuel(prev => prev - 5);
    }
  };

  const toggleShields = () => {
    setShields(prev => !prev);
  };

  return (
    <div className="control-panel">
      <div>Fuel: {fuel}%</div>
      <div>Speed: {speed} km/s</div>
      <div>Shields: {shields ? '🛡️ ON' : '❌ OFF'}</div>
      
      <button onClick={accelerate}>
        ⚡ Accelerate
      </button>
      <button onClick={toggleShields}>
        🛡️ Toggle Shields
      </button>
    </div>
  );
}`,
    
    principles: `Never mutate state directly. Always use the setter function. Use the callback form (prev => newValue) when new state depends on old state to avoid stale closure issues.`,
    
    related: `Check "LOG 007: State Management Galaxies" for useReducer and Context patterns`,
    
    nextMission: `Learn useReducer for complex state logic, or explore state management libraries like Zustand!`
  },

  // CSS/Styling
  'css': {
    insight: `CSS is like configuring your ship's holographic display - you're defining how everything looks and behaves in space. Modern CSS is powerful enough to create entire universes of visual effects!`,
    
    code: `/* 🛸 Flexbox - aligning your cosmic UI */
.spaceship-dashboard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
}

/* 🌌 Grid - organizing mission panels */
.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

/* ✨ Animations - warp speed effects */
@keyframes warpSpeed {
  0% { transform: translateZ(0); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateZ(100px); opacity: 0; }
}

.star {
  animation: warpSpeed 2s infinite;
}`,
    
    principles: `Use Flexbox for 1D layouts, Grid for 2D. CSS Custom Properties (variables) make theming easier. Modern CSS has powerful features - no need for heavy frameworks for basic styling.`,
    
    related: `Explore "LOG 013: Styling the Cosmos" for advanced CSS techniques`,
    
    nextMission: `Learn CSS Grid for complex layouts, or explore CSS animations for interactive effects!`
  },

  // API calls
  'fetch': {
    insight: `Making API calls is like sending probe ships to gather data from distant star systems. You launch the request (fetch), wait for it to travel there and back (await), then process the data it brings home.`,
    
    code: `// 🛸 Fetch data from alien API
async function scanPlanet(planetId) {
  try {
    // 📡 Launch the probe
    const response = await fetch(\`https://api.space.com/planets/\${planetId}\`);
    
    // 🔍 Check if mission succeeded
    if (!response.ok) {
      throw new Error(\`Mission failed: \${response.status}\`);
    }
    
    // 📦 Extract the data payload
    const planetData = await response.json();
    
    return planetData;
    
  } catch (error) {
    // ⚠️ Handle cosmic anomalies
    console.error('🚨 Probe lost:', error);
    throw error;
  }
}

// 🚀 POST request - sending data
async function registerSpacecraft(shipData) {
  const response = await fetch('https://api.space.com/ships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipData)
  });
  
  return response.json();
}`,
    
    principles: `Always handle errors with try/catch. Check response.ok before parsing. POST requests need headers and stringified body. Modern fetch API is built into browsers - no library needed!`,
    
    related: `See "LOG 011: Galactic Data Fetching" for advanced patterns with React Query`,
    
    nextMission: `Learn about React Query or SWR for caching and optimistic updates!`
  },

  // useEffect
  'effect': {
    insight: `useEffect is your ship's auto-pilot system - it runs side effects when your component mounts, updates, or unmounts. Think of it as programming what happens during different phases of your ship's flight.`,
    
    code: `// 🛸 useEffect - lifecycle automation
import { useState, useEffect } from 'react';

function SpaceRadar() {
  const [contacts, setContacts] = useState([]);
  const [scanning, setScanning] = useState(false);

  // 📡 Run when component mounts
  useEffect(() => {
    console.log('🚀 Radar online!');
    
    // 🔄 Cleanup when component unmounts
    return () => {
      console.log('📴 Radar offline');
    };
  }, []); // Empty array = run once on mount

  // 🎯 Run when scanning changes
  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        scanForShips();
      }, 2000);
      
      // ⚡ Cleanup interval
      return () => clearInterval(interval);
    }
  }, [scanning]); // Re-run when scanning changes

  const scanForShips = async () => {
    const ships = await fetch('/api/scan').then(r => r.json());
    setContacts(ships);
  };

  return (
    <div>
      <button onClick={() => setScanning(!scanning)}>
        {scanning ? '⏸️ Pause' : '▶️ Start'} Scan
      </button>
      <ul>
        {contacts.map(ship => <li key={ship.id}>{ship.name}</li>)}
      </ul>
    </div>
  );
}`,
    
    principles: `Dependencies array controls when effect runs. Empty [] = once on mount. Return cleanup function to prevent memory leaks. Don't forget dependencies or you'll get stale data!`,
    
    related: `Master "LOG 014: The useEffect Galaxy" for advanced patterns`,
    
    nextMission: `Learn about useEffect dependencies, custom hooks, and React Query for data fetching!`
  },

  // closures
  'closure': {
    insight: `A closure is like a personal storage locker that a function carries with it wherever it goes. Even after the outer function finishes, the inner function remembers variables from its parent scope.`,
    
    code: `// 🛸 Closure - function with memory
function createSpaceship(name) {
  let fuel = 100; // 🔒 Private variable
  
  // ✨ Inner function has access to 'name' and 'fuel'
  return {
    launch: function() {
      if (fuel > 0) {
        fuel -= 10;
        console.log(\`🚀 \${name} launching! Fuel: \${fuel}%\`);
      } else {
        console.log('⚠️ Out of fuel!');
      }
    },
    refuel: function() {
      fuel = 100;
      console.log(\`⛽ \${name} refueled!\`);
    },
    status: function() {
      return \`\${name}: \${fuel}% fuel\`;
    }
  };
}

// 🎮 Each ship has its own private fuel
const apollo = createSpaceship('Apollo');
const voyager = createSpaceship('Voyager');

apollo.launch(); // Apollo: 90% fuel
voyager.launch(); // Voyager: 90% fuel
// They don't share fuel - each has its own closure!`,
    
    principles: `Closures enable data privacy and factory functions. Inner functions maintain access to outer scope even after outer function returns. Powerful for creating private variables and methods.`,
    
    related: `Dive deeper in "LOG 016: Closure Cosmos"`,
    
    nextMission: `Use closures to create module patterns, memoization, or currying functions!`
  },

  // filter/reduce
  'filter': {
    insight: `Filter is like a security checkpoint - only items that pass your test get through to the new array. Reduce is like a cargo processor - it takes all items and combines them into a single result.`,
    
    code: `// 🛸 Filter - select specific items
const fleet = [
  { name: 'Scout', speed: 100, armed: false },
  { name: 'Fighter', speed: 150, armed: true },
  { name: 'Cruiser', speed: 80, armed: true },
  { name: 'Cargo', speed: 50, armed: false }
];

// ⚔️ Get only armed ships
const combatShips = fleet.filter(ship => ship.armed);
// Result: Fighter, Cruiser

// 🚀 Get fast ships (speed > 100)
const fastShips = fleet.filter(ship => ship.speed > 100);

// 🌌 Reduce - combine all values
const totalSpeed = fleet.reduce((sum, ship) => {
  return sum + ship.speed;
}, 0); // Start with 0
// Result: 380

// 📊 Complex reduce - group by type
const shipsByType = fleet.reduce((groups, ship) => {
  const type = ship.armed ? 'combat' : 'civilian';
  if (!groups[type]) groups[type] = [];
  groups[type].push(ship);
  return groups;
}, {});`,
    
    principles: `Filter creates new array with items that pass the test. Reduce transforms array into single value (number, object, etc). Chain them: arr.filter().map().reduce() for complex transformations.`,
    
    related: `Master "LOG 009: Array Methods Mastery"`,
    
    nextMission: `Learn find(), some(), every() and other powerful array methods!`
  },

  // destructuring
  'destructure': {
    insight: `Destructuring is like unpacking cargo from a container - instead of accessing container.item1, container.item2, you unpack everything at once into separate variables.`,
    
    code: `// 🛸 Object destructuring
const spaceship = {
  name: 'Enterprise',
  speed: 150,
  crew: 400,
  captain: { name: 'Kirk', rank: 'Captain' }
};

// ✨ Unpack specific properties
const { name, speed } = spaceship;
console.log(name); // 'Enterprise'

// 🎯 Rename while destructuring
const { name: shipName, crew: crewSize } = spaceship;

// 🌌 Nested destructuring
const { captain: { name: captainName } } = spaceship;

// 📦 Array destructuring
const coordinates = [42, -73, 100];
const [x, y, z] = coordinates;

// 🚀 Swap variables (cool trick!)
let a = 1, b = 2;
[a, b] = [b, a]; // Now a=2, b=1

// ⚡ Function parameters
function launchShip({ name, speed, crew = 0 }) {
  console.log(\`Launching \${name} at \${speed}km/s with \${crew} crew\`);
}
launchShip(spaceship);`,
    
    principles: `Destructuring makes code cleaner and more readable. Works with objects and arrays. Set default values with =. Use in function parameters for clean APIs.`,
    
    related: `Learn more in "LOG 018: Modern JavaScript Patterns"`,
    
    nextMission: `Explore spread operator (...), rest parameters, and object shorthand!`
  },

  // spread operator
  'spread': {
    insight: `The spread operator (...) is like a teleporter that breaks objects or arrays into individual pieces, letting you merge, copy, or manipulate them easily.`,
    
    code: `// 🛸 Array spreading
const crew1 = ['Kirk', 'Spock'];
const crew2 = ['McCoy', 'Uhura'];

// ✨ Merge arrays
const fullCrew = [...crew1, ...crew2];
// ['Kirk', 'Spock', 'McCoy', 'Uhura']

// 📦 Copy array (not reference!)
const crewBackup = [...crew1];

// 🌌 Object spreading
const ship = {
  name: 'Enterprise',
  speed: 150
};

// ⚡ Add/override properties
const upgradedShip = {
  ...ship,
  speed: 200, // Override
  shields: true // Add new
};

// 🚀 Merge objects
const baseShip = { hull: 'titanium', size: 'large' };
const weapons = { lasers: 4, torpedoes: 12 };
const warship = { ...baseShip, ...weapons };

// 🎯 Function arguments
function calculateDistance(x, y, z) {
  return Math.sqrt(x*x + y*y + z*z);
}
const coords = [3, 4, 5];
calculateDistance(...coords); // Same as (3, 4, 5)`,
    
    principles: `Spread creates shallow copies. Great for immutable updates in React. Use to merge arrays/objects without mutation. Works in function calls to expand arrays into arguments.`,
    
    related: `Check "LOG 019: Spread & Rest Operators"`,
    
    nextMission: `Learn rest parameters (...args) to collect function arguments into arrays!`
  },

  // event handling
  'event': {
    insight: `Events are like sensor alerts on your ship - something happened (click, keypress, etc.) and your ship needs to respond. Event handlers are your programmed responses to these alerts.`,
    
    code: `// 🛸 Event handling in React
import { useState } from 'react';

function SpaceshipControl() {
  const [power, setPower] = useState(0);
  const [logs, setLogs] = useState([]);

  // 🎯 Click event
  const handleLaunch = (event) => {
    event.preventDefault(); // Stop default behavior
    console.log('🚀 Launch initiated!');
    setPower(100);
  };

  // ⌨️ Keyboard event
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      addLog('Command entered');
    }
    if (event.key === 'Escape') {
      setPower(0);
    }
  };

  // 🖱️ Input change event
  const handlePowerChange = (event) => {
    const value = event.target.value;
    setPower(Number(value));
  };

  // 📝 Form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    console.log('Form data:', data);
  };

  const addLog = (message) => {
    setLogs([...logs, \`[\${new Date().toISOString()}] \${message}\`]);
  };

  return (
    <div>
      <button onClick={handleLaunch}>🚀 Launch</button>
      <input 
        type="range" 
        value={power} 
        onChange={handlePowerChange}
        min="0" 
        max="100" 
      />
      <input 
        type="text" 
        onKeyDown={handleKeyPress}
        placeholder="Enter command..."
      />
    </div>
  );
}`,
    
    principles: `Always use event.preventDefault() for forms. Event handlers get event object as first parameter. In React, events are synthetic (cross-browser compatible). Don't call handlers directly in JSX - pass function reference.`,
    
    related: `Deep dive in "LOG 020: Event Systems"`,
    
    nextMission: `Learn event bubbling, delegation, and custom events!`
  },

  // local storage
  'storage': {
    insight: `localStorage is like your ship's permanent memory banks - data persists even after your engines shut down (browser closes). Unlike state, it survives between sessions.`,
    
    code: `// 🛸 localStorage - persistent storage
// 💾 Save data
function saveShipConfig(config) {
  localStorage.setItem('shipConfig', JSON.stringify(config));
  console.log('✅ Configuration saved!');
}

// 📖 Read data
function loadShipConfig() {
  const saved = localStorage.getItem('shipConfig');
  if (saved) {
    return JSON.parse(saved);
  }
  return null; // No saved config
}

// 🗑️ Delete data
function resetConfig() {
  localStorage.removeItem('shipConfig');
}

// 🚀 React hook for localStorage
import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 🎮 Usage in component
function SpaceshipSettings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [volume, setVolume] = useLocalStorage('volume', 50);

  return (
    <div>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme: {theme}
      </button>
      <input 
        type="range" 
        value={volume} 
        onChange={(e) => setVolume(e.target.value)}
      />
    </div>
  );
}`,
    
    principles: `localStorage stores strings only - use JSON.stringify/parse for objects. Synchronous API - don't store large amounts. Max 5-10MB per domain. Use try/catch - can fail in private browsing.`,
    
    related: `Explore "LOG 021: Browser Storage APIs"`,
    
    nextMission: `Learn sessionStorage, IndexedDB for larger data, and cookies for server communication!`
  },

  // ternary operator
  'ternary': {
    insight: `The ternary operator is like a quick decision gate - if condition is true, take the left path, otherwise take the right. It's a shorthand for simple if/else statements.`,
    
    code: `// 🛸 Ternary operator - inline conditionals
const fuel = 45;

// ✨ Basic ternary
const status = fuel > 50 ? 'Ready' : 'Low Fuel';
console.log(status); // 'Low Fuel'

// 🚀 In JSX (React)
function FuelGauge({ fuel }) {
  return (
    <div className={fuel > 50 ? 'safe' : 'warning'}>
      {fuel > 75 ? '🟢' : fuel > 25 ? '🟡' : '🔴'}
      Fuel: {fuel}%
    </div>
  );
}

// 🎯 Nested ternary (use sparingly!)
const alert = 
  fuel > 75 ? 'Excellent' :
  fuel > 50 ? 'Good' :
  fuel > 25 ? 'Warning' :
  'Critical';

// ⚡ Assignment
const message = isPowered ? 'Online' : 'Offline';

// 🌌 Function call
const speed = isWarpDrive ? calculateWarp() : calculateImpulse();

// 📦 In objects
const ship = {
  name: 'Enterprise',
  status: isOperational ? 'Active' : 'Docked',
  crew: isFullStaff ? 400 : 50
};`,
    
    principles: `Use for simple conditions. For complex logic, use if/else for readability. Avoid deep nesting. Great for JSX and inline assignments. Remember: condition ? ifTrue : ifFalse`,
    
    related: `Learn more in "LOG 022: Conditional Patterns"`,
    
    nextMission: `Master optional chaining (?.) and nullish coalescing (??) operators!`
  },

  // template literals
  'template': {
    insight: `Template literals are like advanced message screens - they let you embed variables and expressions directly into strings, plus create multi-line text without weird concatenation.`,
    
    code: `// 🛸 Template literals - modern strings
const shipName = 'Enterprise';
const speed = 150;
const captain = 'Kirk';

// ✨ Variable interpolation
const message = \`\${shipName} traveling at \${speed} km/s\`;
console.log(message);

// 🚀 Expressions inside template literals
const status = \`Speed: \${speed > 100 ? 'Fast' : 'Slow'}\`;
const power = \`Power: \${speed * 2}kW\`;

// 🌌 Multi-line strings
const report = \`
  Ship: \${shipName}
  Captain: \${captain}
  Status: Operational
  Speed: \${speed} km/s
\`;

// 🎯 Function calls in templates
function formatCoords(x, y, z) {
  return \`(\${x}, \${y}, \${z})\`;
}
const location = \`Current position: \${formatCoords(10, 20, 30)}\`;

// ⚡ String concatenation vs template literals
// Old way: 'Ship ' + shipName + ' at ' + speed + 'km/s'
// New way: \`Ship \${shipName} at \${speed}km/s\``,
    
    principles: `Use backticks instead of quotes. Embed variables with dollar-braces. Preserves whitespace and newlines. More readable than string concatenation. Can contain expressions, not just variables.`,
    
    related: `Deep dive in "LOG 023: String Manipulation"`,
    
    nextMission: `Learn string methods like .split(), .trim(), .replace(), and regex!`
  },

  // Default fallback
  'default': {
    insight: `Great question, cosmic explorer! This demo translator has 15+ pre-loaded wisdom modules covering fundamental and advanced JavaScript/React concepts. Each response is carefully crafted with production-ready code you can actually use!`,
    
    code: `// 🛸 Demo Mode - 15+ Topics with Full Code Examples!
const availableTopics = [
  '⏳ async/await',      // Promises & async code
  '🪝 hooks',            // React useState, custom hooks
  '🌀 useEffect',        // Lifecycle & side effects
  '🎯 debounce',         // Performance optimization
  '🗺️ map/filter',       // Array transformation methods
  '📦 reduce',           // Array aggregation
  '🎮 state',            // React state management  
  '🎨 css/flexbox',      // Styling & layout
  '📡 fetch/api',        // Data fetching & HTTP
  '🔒 closures',         // Function scope & privacy
  '📤 destructuring',    // Object/array unpacking
  '✨ spread',           // Spread/rest operators
  '🖱️ events',          // Event handling
  '💾 localStorage',     // Browser storage
  '❓ ternary',          // Conditional operators
  '📝 template',         // Template literals
];

// ✨ Just ask about any topic - keywords are matched automatically!
console.log('Try: "explain closures" or "how do I use map"');`,
    
    principles: `Demo Mode provides production-ready code examples for common patterns. These aren't toy examples - they're real snippets you can use in your projects. No API limits, works offline, instant responses!`,
    
    related: `Browse alien-signal-blog for more coding tutorials and deep dives into these concepts!`,
    
    nextMission: `Ask about any JavaScript or React concept - from basics like "variables" to advanced like "closures"!`
  }
};

// Function to find the best matching response
function getDemoResponse(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Check for keywords - comprehensive matching for all 15+ topics
  if (lowerQuestion.includes('async') || lowerQuestion.includes('await') || lowerQuestion.includes('promise')) {
    return DEMO_RESPONSES.async;
  }
  
  if (lowerQuestion.includes('hook') && !lowerQuestion.includes('useeffect')) {
    return DEMO_RESPONSES.hook;
  }
  
  if (lowerQuestion.includes('useeffect') || lowerQuestion.includes('effect') || lowerQuestion.includes('lifecycle')) {
    return DEMO_RESPONSES.effect;
  }
  
  if (lowerQuestion.includes('debounce') || lowerQuestion.includes('throttle')) {
    return DEMO_RESPONSES.debounce;
  }
  
  if (lowerQuestion.includes('map') || lowerQuestion.includes('foreach')) {
    return DEMO_RESPONSES.map;
  }
  
  if (lowerQuestion.includes('filter') || lowerQuestion.includes('reduce') || (lowerQuestion.includes('array') && !lowerQuestion.includes('map'))) {
    return DEMO_RESPONSES.filter;
  }
  
  if (lowerQuestion.includes('state') || lowerQuestion.includes('setstate') || lowerQuestion.includes('usestate')) {
    return DEMO_RESPONSES.state;
  }
  
  if (lowerQuestion.includes('css') || lowerQuestion.includes('style') || lowerQuestion.includes('flex') || lowerQuestion.includes('grid')) {
    return DEMO_RESPONSES.css;
  }
  
  if (lowerQuestion.includes('fetch') || lowerQuestion.includes('api') || lowerQuestion.includes('request') || lowerQuestion.includes('http')) {
    return DEMO_RESPONSES.fetch;
  }
  
  if (lowerQuestion.includes('closure') || lowerQuestion.includes('scope')) {
    return DEMO_RESPONSES.closure;
  }
  
  if (lowerQuestion.includes('destructur') || lowerQuestion.includes('unpack')) {
    return DEMO_RESPONSES.destructure;
  }
  
  if (lowerQuestion.includes('spread') || lowerQuestion.includes('rest') || lowerQuestion.includes('...')) {
    return DEMO_RESPONSES.spread;
  }
  
  if (lowerQuestion.includes('event') || lowerQuestion.includes('click') || lowerQuestion.includes('handler')) {
    return DEMO_RESPONSES.event;
  }
  
  if (lowerQuestion.includes('localstorage') || lowerQuestion.includes('storage') || lowerQuestion.includes('persist')) {
    return DEMO_RESPONSES.storage;
  }
  
  if (lowerQuestion.includes('ternary') || lowerQuestion.includes('conditional') || lowerQuestion.includes('? :')) {
    return DEMO_RESPONSES.ternary;
  }
  
  if (lowerQuestion.includes('template') || lowerQuestion.includes('literal') || lowerQuestion.includes('backtick') || lowerQuestion.includes('${')) {
    return DEMO_RESPONSES.template;
  }
  
  // Default response shows all available topics
  return DEMO_RESPONSES.default;
}

// Simulate API call with delay (to feel real)
export async function translateQuestionDemo(question, language = 'javascript') {
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const response = getDemoResponse(question);
  
  return {
    success: true,
    insight: response.insight,
    code: response.code,
    principles: response.principles,
    related: response.related,
    nextMission: response.nextMission,
    language: language,
    isDemoMode: true // Flag to show this is demo
  };
}

export { DEMO_RESPONSES };
