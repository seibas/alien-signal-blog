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

  // Default fallback
  'default': {
    insight: `Great question, fellow space traveler! While I have pre-loaded knowledge about common coding patterns, this demo version shows you example responses. The full Alien Code Translator can answer ANY coding question with custom-generated responses tailored to your specific needs.`,
    
    code: `// 🛸 This is a demo response
// The real translator generates custom code for your exact question!

function exampleCode() {
  console.log('👽 Demo mode active!');
  console.log('✨ Ask about: async/await, hooks, or debounce');
  console.log('🚀 Or try the real translator with API access!');
}`,
    
    principles: `This demo showcases the Alien Code Translator's style and format. The real version uses AI to generate responses for any coding question you have - from beginner concepts to advanced patterns.`,
    
    related: `Try asking about "async", "hooks", or "debounce" to see more demo responses!`,
    
    nextMission: `Want to try the real AI-powered translator? Enable API mode in settings to unlock unlimited cosmic wisdom!`
  }
};

// Function to find the best matching response
function getDemoResponse(question) {
  const lowerQuestion = question.toLowerCase();
  
  // Check for keywords
  if (lowerQuestion.includes('async') || lowerQuestion.includes('await') || lowerQuestion.includes('promise')) {
    return DEMO_RESPONSES.async;
  }
  
  if (lowerQuestion.includes('hook') || lowerQuestion.includes('usestate') || lowerQuestion.includes('useeffect')) {
    return DEMO_RESPONSES.hook;
  }
  
  if (lowerQuestion.includes('debounce') || lowerQuestion.includes('throttle')) {
    return DEMO_RESPONSES.debounce;
  }
  
  // Default response
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
