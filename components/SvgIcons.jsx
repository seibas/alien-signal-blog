// SVG Icons for Alien Signal Blog

export function UfoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Beam of light */}
      <defs>
        <linearGradient id="beam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#00FF41', stopOpacity: 0.6 }} />
          <stop offset="100%" style={{ stopColor: '#00FF41', stopOpacity: 0 }} />
        </linearGradient>
        <radialGradient id="metalGradient">
          <stop offset="0%" style={{ stopColor: '#5A6173' }} />
          <stop offset="100%" style={{ stopColor: '#2A2F3E' }} />
        </radialGradient>
        <radialGradient id="glassGradient">
          <stop offset="0%" style={{ stopColor: '#00FFFF', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#00CCFF', stopOpacity: 0.5 }} />
        </radialGradient>
      </defs>
      
      {/* Light beam */}
      <path d="M 35 55 L 25 95 L 75 95 L 65 55 Z" fill="url(#beam)" />
      
      {/* UFO bottom dome */}
      <ellipse cx="50" cy="55" rx="30" ry="8" fill="#1A1F2E" />
      <ellipse cx="50" cy="55" rx="30" ry="8" fill="#00FF41" opacity="0.3" />
      
      {/* UFO main body */}
      <ellipse cx="50" cy="45" rx="35" ry="12" fill="url(#metalGradient)" />
      
      {/* UFO top dome */}
      <circle cx="50" cy="35" r="15" fill="url(#glassGradient)" />
      
      {/* Lights around UFO */}
      <circle cx="30" cy="48" r="2" fill="#FF6B35" />
      <circle cx="40" cy="50" r="2" fill="#00FF41" />
      <circle cx="50" cy="51" r="2" fill="#FF6B35" />
      <circle cx="60" cy="50" r="2" fill="#00FF41" />
      <circle cx="70" cy="48" r="2" fill="#FF6B35" />
    </svg>
  );
}

export function AlienFriendly({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="alienGradient">
          <stop offset="0%" style={{ stopColor: '#9AFF9A' }} />
          <stop offset="100%" style={{ stopColor: '#7CFC00' }} />
        </radialGradient>
      </defs>
      
      {/* Head */}
      <ellipse cx="50" cy="50" rx="30" ry="35" fill="url(#alienGradient)" />
      
      {/* Big eyes */}
      <ellipse cx="38" cy="45" rx="8" ry="12" fill="#000000" />
      <ellipse cx="62" cy="45" rx="8" ry="12" fill="#000000" />
      
      {/* Eye shine */}
      <circle cx="40" cy="42" r="3" fill="#FFFFFF" />
      <circle cx="64" cy="42" r="3" fill="#FFFFFF" />
      
      {/* Small mouth (smile) */}
      <path d="M 42 62 Q 50 66 58 62" fill="none" stroke="#000000" strokeWidth="1.5" />
      
      {/* Antennas */}
      <line x1="38" y1="20" x2="35" y2="10" stroke="#7CFC00" strokeWidth="2" />
      <line x1="62" y1="20" x2="65" y2="10" stroke="#7CFC00" strokeWidth="2" />
      <circle cx="35" cy="10" r="3" fill="#00FF41" />
      <circle cx="65" cy="10" r="3" fill="#00FF41" />
    </svg>
  );
}

export function AlienCoding({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="50" cy="50" rx="30" ry="34" fill="#00FF41" />
      
      {/* Eyes focused (horizontal lines) */}
      <line x1="32" y1="45" x2="44" y2="45" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="45" x2="68" y2="45" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      
      {/* Concentrated mouth */}
      <line x1="45" y1="63" x2="55" y2="63" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      
      {/* Code symbols floating around */}
      <text x="15" y="30" fontSize="8" fill="#FF6B35" opacity="0.7" fontFamily="monospace">{'<>'}</text>
      <text x="75" y="35" fontSize="8" fill="#FF6B35" opacity="0.7" fontFamily="monospace">{'{}'}</text>
      <text x="20" y="70" fontSize="8" fill="#00CCFF" opacity="0.7" fontFamily="monospace">[]</text>
    </svg>
  );
}

export function Rocket({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="windowGradient">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#00CCFF', stopOpacity: 0.4 }} />
        </radialGradient>
      </defs>
      
      {/* Flames */}
      <path d="M 45 75 L 40 90 L 50 85 L 60 90 L 55 75 Z" fill="#FF6B35">
        <animate attributeName="opacity" values="1;0.6;1" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M 48 78 L 45 88 L 50 84 L 55 88 L 52 78 Z" fill="#FFD700">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="0.3s" repeatCount="indefinite" />
      </path>
      
      {/* Body */}
      <rect x="42" y="40" width="16" height="35" fill="#5A6173" rx="2" />
      
      {/* Nose cone */}
      <path d="M 42 40 L 50 20 L 58 40 Z" fill="#7A8193" />
      
      {/* Window */}
      <circle cx="50" cy="50" r="6" fill="url(#windowGradient)" />
      
      {/* Fins */}
      <path d="M 42 65 L 35 75 L 42 75 Z" fill="#FF6B35" />
      <path d="M 58 65 L 65 75 L 58 75 Z" fill="#FF6B35" />
      
      {/* Details */}
      <line x1="42" y1="55" x2="58" y2="55" stroke="#3A4153" strokeWidth="1" />
      <line x1="42" y1="60" x2="58" y2="60" stroke="#3A4153" strokeWidth="1" />
    </svg>
  );
}

export function Saturn({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="saturnGradient">
          <stop offset="0%" style={{ stopColor: '#F4E4C1' }} />
          <stop offset="50%" style={{ stopColor: '#E6C897' }} />
          <stop offset="100%" style={{ stopColor: '#C4A57B' }} />
        </radialGradient>
      </defs>
      
      {/* Ring (back) */}
      <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.6" />
      <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="#FFA500" strokeWidth="2" opacity="0.8" />
      
      {/* Planet */}
      <circle cx="50" cy="50" r="25" fill="url(#saturnGradient)" />
      
      {/* Bands on planet */}
      <ellipse cx="50" cy="45" rx="24" ry="3" fill="#D4A574" opacity="0.4" />
      <ellipse cx="50" cy="52" rx="24" ry="3" fill="#B8956A" opacity="0.4" />
      <ellipse cx="50" cy="58" rx="22" ry="2" fill="#9C7F5A" opacity="0.3" />
      
      {/* Ring (front) */}
      <path d="M 25 50 Q 35 42 50 40 Q 65 42 75 50" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.4" />
      
      {/* Shadow on planet from ring */}
      <ellipse cx="50" cy="48" rx="25" ry="6" fill="#000000" opacity="0.2" />
    </svg>
  );
}

export function PlanetAlien({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="alienPlanetGradient">
          <stop offset="0%" style={{ stopColor: '#9B59B6' }} />
          <stop offset="50%" style={{ stopColor: '#8E44AD' }} />
          <stop offset="100%" style={{ stopColor: '#5B21B6' }} />
        </radialGradient>
      </defs>
      
      {/* Planet base */}
      <circle cx="50" cy="50" r="30" fill="url(#alienPlanetGradient)" />
      
      {/* Strange surface features */}
      <path d="M 30 45 Q 35 40 40 45 T 50 45" fill="none" stroke="#00FF41" strokeWidth="2" opacity="0.5" />
      <path d="M 55 58 Q 60 54 65 58 T 72 58" fill="none" stroke="#00FF41" strokeWidth="2" opacity="0.5" />
      
      {/* Glowing spots */}
      <circle cx="42" cy="52" r="3" fill="#00FF41" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="58" cy="48" r="4" fill="#FF6B35" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
      </circle>
      
      {/* Ring system */}
      <ellipse cx="50" cy="50" rx="42" ry="8" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

export function AlienThinking({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <ellipse cx="50" cy="52" rx="30" ry="35" fill="#00CC33" />
      
      {/* Eyes looking up (thinking) */}
      <ellipse cx="38" cy="42" rx="7" ry="10" fill="#000000" />
      <ellipse cx="62" cy="42" rx="7" ry="10" fill="#000000" />
      
      {/* Pupils looking up-left */}
      <circle cx="37" cy="38" r="3" fill="#FFFFFF" />
      <circle cx="61" cy="38" r="3" fill="#FFFFFF" />
      
      {/* Thoughtful mouth */}
      <line x1="42" y1="65" x2="58" y2="65" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
      
      {/* Thought bubble */}
      <circle cx="75" cy="25" r="8" fill="#FFFFFF" stroke="#00FF41" strokeWidth="1" />
      <circle cx="68" cy="35" r="4" fill="#FFFFFF" stroke="#00FF41" strokeWidth="1" />
      <circle cx="64" cy="40" r="2" fill="#FFFFFF" stroke="#00FF41" strokeWidth="1" />
      
      {/* Question mark in bubble */}
      <text x="72" y="30" fontSize="10" fill="#00FF41" fontWeight="bold">?</text>
    </svg>
  );
}

export function UfoSimple({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* UFO body */}
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="#00FF41" opacity="0.2" />
      <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="#00FF41" strokeWidth="2" />
      
      {/* Dome */}
      <path d="M 20 50 Q 50 30 80 50" fill="none" stroke="#00FF41" strokeWidth="2" />
      
      {/* Lights */}
      <circle cx="30" cy="52" r="3" fill="#FF6B35">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="54" r="3" fill="#00FF41">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="70" cy="52" r="3" fill="#FF6B35">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
