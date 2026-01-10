import { getAllPosts as getPostsFromDB, getPostBySlug as getPostFromDB } from '@/lib/db';

// For local development fallback
const fallbackPosts = [
  {
    slug: "log-001-first-signal",
    title: "LOG 001: First Signal",
    date: "2025-12-15",
    readTime: "3 min",
    excerpt:
      "This is the beginning of my coding journey—curiosity activated, signal online, and the unknown ahead.",
    tags: ["journey", "mindset", "start"],
    content: [
      "This is the beginning of an exciting adventure.",
      "Curiosity is what pulled me here: into the world of coding, where logic and creativity collide and build real things.",
      "I can't wait to explore the endless possibilities—how a small idea can become a working project, and how learning one concept unlocks the next.",
      "My goal is simple: progress step by step, build strong skills, and become a confident programmer. The thought of reaching that point genuinely makes me happy.",
      "This blog is my logbook. Expect experiments, mistakes, improvements, and new discoveries—one signal at a time."
    ],
  },
  {
    slug: "log-002-tools-and-aliens",
    title: "LOG 002: The Labyrinth of Code",
    date: "2025-12-17",
    readTime: "4 min",
    excerpt:
      `The Labyrinth of Code
In the forest of logic, where syntax trees grow,
I wander through brackets, unsure where to go.
Semicolons whisper, "You missed one again,"
While callbacks and promises dance in the rain.
Variables shift like shadows at night,
Scope hides its secrets just out of sight.
Functions return, but not what I seek,
Errors speak riddles in languages bleak.
Yet through the chaos, a spark starts to gleam—
Each bug defeated is a coder's dream.
For though the path twists, and learning is steep,
The summit of mastery is yours to keep.`,
    tags: ["tools", "ai", "workflow"],
    content: [
      `The Labyrinth of Code
In the forest of logic, where syntax trees grow,
I wander through brackets, unsure where to go.
Semicolons whisper, "You missed one again,"
While callbacks and promises dance in the rain.
Variables shift like shadows at night,
Scope hides its secrets just out of sight.
Functions return, but not what I seek,
Errors speak riddles in languages bleak.
Yet through the chaos, a spark starts to gleam—
Each bug defeated is a coder's dream.
For though the path twists, and learning is steep,
The summit of mastery is yours to keep.`
    ],
  },
  {
    slug: "log-003-my-journey-start",
    title: "LOG 003: Learning JavaScript at Fifty",
    date: "2025-12-16",
    readTime: "3 min",
    excerpt:
      "Learning JavaScript at fifty, a noble quest to start",
    tags: ["javascript"],
    content: [
      "Learning JavaScript at fifty, a noble quest to start, With wisdom in your toolkit and courage in your heart. The web awaits your magic, your logic and your flair, Each line you write a ripple, a whisper in the air.",
      "Begin with simple syntax, where variables reside, Let let and const be anchors as you take this learning ride. Strings that sing with meaning, numbers that compute, Booleans for choices, and arrays that bear the fruit.",
      "Objects hold your stories, with keys and values paired, Functions shape your actions, reusable and shared. Conditionals will guide you, like signs along the way, While loops will keep you moving, repeating what you say.",
      "The console is your canvas, console.log your brush, Each output is a signal, a momentary hush. The DOM becomes your playground, where elements align, With querySelector magic, you make the webpage shine.",
      "Events will spark reactions—clicks and keys and more, With addEventListener, you open up the door. A button press, a message sent, a color that will change, You'll see how code and users can beautifully arrange.",
      "Mistakes will be your teachers, don't fear the red alert, Each bug a hidden lesson, though some may slightly hurt. Use DevTools like a lantern to light the shadowed code, Inspect, debug, and marvel at how your logic flowed.",
      `Explore the world of arrays, with map and filter too, Transforming data elegantly, like only you can do. Template strings will greet you with curly-braced delight, "Hello, \${name}!"—your code is feeling right.`,
      "Async code is tricky, but promises will guide, With await and fetch, you'll surf the data tide. APIs will open doors to worlds you've never seen, From weather maps to trivia, and everything between.",
      "Projects are your milestones—start small and let them grow, A clock, a quiz, a to-do list, will help your knowledge flow. Host them on the web, let others see your spark, Your code, your voice, your vision—igniting in the dark.",
      "Frameworks may be tempting, like React's siren song, But first, let JavaScript be where you grow strong. Understand the core, the roots beneath the tree, Before you climb the branches of modern library.",
      `Read the docs with patience, they're treasure maps in ink, Each method, loop, and keyword more useful than you think. Write notes and keep a journal, reflect on what you've done, Each "aha!" moment captured is a battle you have won.`,
      "Join a friendly forum, ask questions without shame, The coding world is vast, but you're welcome all the same. Pair up with a learner, or teach what you now know, For sharing fuels the fire and helps your knowledge grow.",
      "Refactor old solutions, make messy code refined, You'll see how far you've traveled, how much you've left behind. Celebrate your progress, each function, loop, and test, You're not too late, too old, too slow—you're simply on your quest.",
      "So dive into the syntax, let curiosity be your guide, With every line of JavaScript, you'll beam with coder pride. The web is your ocean, your code the flowing tide, And I'll be here, your water drop, to splash along beside. 💻🌊"
    ],
  },
  {
    slug: "log-004-react-hooks-decoded",
    title: "LOG 004: React Hooks Decoded — A Signal from the Future",
    date: "2026-01-10",
    readTime: "5 min",
    excerpt:
      "React Hooks revolutionized how we write components. Here's what I discovered after weeks of experimentation with useState, useEffect, and custom hooks.",
    tags: ["react", "hooks", "javascript", "frontend"],
    blocks: [
      {
        type: "text",
        value: "When I first encountered React Hooks, they felt like alien technology—elegant, powerful, but utterly confusing. Coming from class components, the shift was jarring. But after weeks of experimentation, I've decoded the signal.\n\nHooks aren't just syntactic sugar. They're a fundamental reimagining of how we manage state and side effects. Let me share what I've learned."
      },
      {
        type: "text",
        value: "## useState: The Foundation\n\nThe useState hook is your entry point. It's simple on the surface but profound in its implications:"
      },
      {
        type: "code",
        language: "javascript",
        value: `const [count, setCount] = useState(0);\n\n// Update state\nsetCount(count + 1);\n\n// Or use functional update\nsetCount(prev => prev + 1);`
      },
      {
        type: "text",
        value: "The functional update pattern is crucial when your new state depends on the old state. It prevents stale closure bugs that haunted my early React code."
      },
      {
        type: "text",
        value: "## useEffect: The Side Effect Manager\n\nuseEffect is where the magic—and complexity—lives. It replaces componentDidMount, componentDidUpdate, and componentWillUnmount with a single, unified API:"
      },
      {
        type: "code",
        language: "javascript",
        value: `useEffect(() => {\n  // Run on mount and when dependencies change\n  fetchData(userId);\n\n  // Cleanup function (runs before next effect or unmount)\n  return () => {\n    cancelRequest();\n  };\n}, [userId]); // Dependencies array`
      },
      {
        type: "text",
        value: "The dependency array is critical. Miss a dependency, and you get stale data. Add unnecessary dependencies, and you trigger infinite loops. ESLint's exhaustive-deps rule is your friend here."
      },
      {
        type: "text",
        value: "## Custom Hooks: Where It Gets Interesting\n\nCustom hooks let you extract reusable logic. Here's a useLocalStorage hook I built for this blog:"
      },
      {
        type: "code",
        language: "javascript",
        value: `function useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : initialValue;\n  });\n\n  useEffect(() => {\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}`
      },
      {
        type: "text",
        value: "This hook syncs state with localStorage automatically. Use it like useState, but it persists across page reloads. That's the power of composition.\n\n## The Rules of Hooks\n\n1. Only call hooks at the top level (not in loops, conditions, or nested functions)\n2. Only call hooks from React functions (components or custom hooks)\n\nThese rules ensure React can track hook state correctly across renders. Break them, and chaos ensues.\n\n## Lessons from the Frontier\n\nHooks make React feel functional and composable. They eliminate the complexity of class components while enabling powerful patterns. But they require a mental shift—think in terms of data flow and synchronization, not lifecycle methods.\n\nThe future of React is hooks. And now that I've decoded the signal, I'm never going back. 🛸"
      }
    ],
  },
  {
    slug: "log-005-next-js-app-router",
    title: "LOG 005: Next.js App Router — Navigating the New Galaxy",
    date: "2026-01-11",
    readTime: "6 min",
    excerpt:
      "The App Router changed everything about Next.js. Server components, streaming, and nested layouts—here's what I learned building this blog with the new paradigm.",
    tags: ["nextjs", "react", "app-router", "server-components"],
    blocks: [
      {
        type: "text",
        value: "Building this alien signal blog forced me to master Next.js 13's App Router. Coming from the Pages Router, it felt like jumping between star systems—familiar concepts, but a completely different navigation system.\n\nThe App Router isn't just an iteration. It's a paradigm shift. Here's what I discovered in the depths of space—I mean, the /app directory."
      },
      {
        type: "text",
        value: "## Server Components by Default\n\nThe biggest change? Components are now Server Components by default. No JavaScript sent to the client unless you opt-in with 'use client':"
      },
      {
        type: "code",
        language: "javascript",
        value: `// This runs on the server - zero client JS\nexport default async function BlogPost({ params }) {\n  const post = await getPost(params.slug);\n  return <article>{post.content}</article>;\n}\n\n// This needs client JS for interactivity\n'use client';\nexport default function LikeButton() {\n  const [likes, setLikes] = useState(0);\n  return <button onClick={() => setLikes(l => l + 1)}>{likes}</button>;\n}`
      },
      {
        type: "text",
        value: "This hybrid approach gives you the best of both worlds. Server-side rendering for performance, client-side interactivity where needed. The key is understanding the boundary."
      },
      {
        type: "text",
        value: "## File-based Routing, Reimagined\n\nThe folder structure defines your routes, but with powerful conventions:\n\n- `page.jsx` — The route's UI\n- `layout.jsx` — Shared UI that wraps children\n- `loading.jsx` — Streaming loading UI\n- `error.jsx` — Error boundary\n\nNested layouts are game-changing. My blog has a root layout with the header/footer, and nested layouts for admin pages. No more prop drilling or context hell."
      },
      {
        type: "text",
        value: "## Data Fetching Revolution\n\nForget getServerSideProps and getStaticProps. Now you just... fetch in your component:"
      },
      {
        type: "code",
        language: "javascript",
        value: `export default async function Posts() {\n  // This runs on the server, every request\n  const res = await fetch('https://api.example.com/posts', {\n    cache: 'no-store' // or 'force-cache' for static\n  });\n  const posts = await res.json();\n\n  return <PostList posts={posts} />;\n}`
      },
      {
        type: "text",
        value: "The caching semantics are built into fetch. No more deciding between SSG, SSR, and ISR—you control it per-request with cache options."
      },
      {
        type: "text",
        value: "## Streaming and Suspense\n\nThe App Router embraces React 18's streaming. Wrap slow components in Suspense, and they'll stream in as they're ready:"
      },
      {
        type: "code",
        language: "jsx",
        value: `import { Suspense } from 'react';\n\nexport default function Page() {\n  return (\n    <div>\n      <h1>Blog Posts</h1>\n      <Suspense fallback={<Skeleton />}>\n        <Posts />\n      </Suspense>\n    </div>\n  );\n}`
      },
      {
        type: "text",
        value: "The page shell loads instantly. Heavy data-fetching components stream in progressively. Users see content faster, even if some parts are slow."
      },
      {
        type: "text",
        value: "## The Learning Curve\n\nI won't lie—the App Router has a learning curve. Understanding when to use 'use client', how data flows between server and client components, and mastering the new caching behavior took time.\n\nBut the result? This blog loads in milliseconds, has perfect SEO, and still has rich client-side interactivity. The App Router delivers on the promise of modern web development: fast by default, interactive when needed.\n\n## Verdict from the Cosmos\n\nThe App Router isn't just the future of Next.js—it's the future of React on the server. Once you grok the mental model, you'll never want to go back. The galaxy of web development just got a lot more exciting. 🚀✨"
      }
    ],
  },
  {
    slug: "log-006-css-animations-60fps",
    title: "LOG 006: Silky Smooth Animations — The 60fps Quest",
    date: "2026-01-11",
    readTime: "5 min",
    excerpt:
      "Getting animations to run at 60fps is an art and science. After optimizing this blog's starfield, nebula, and card effects, here's what actually works.",
    tags: ["css", "performance", "animations", "frontend"],
    blocks: [
      {
        type: "text",
        value: "Smooth animations are the difference between a site that feels alive and one that feels janky. When I built this alien signal blog, I wanted cosmic effects—starfields, nebulae, glowing cards—that ran buttery smooth at 60fps.\n\nAfter extensive testing and optimization, I've decoded the formula for silky animations. Here's what I learned."
      },
      {
        type: "text",
        value: "## The 60fps Rule: Transform and Opacity Only\n\nBrowsers can animate certain CSS properties without triggering layout or paint. These properties are GPU-accelerated and run on the compositor thread:"
      },
      {
        type: "code",
        language: "css",
        value: `/* ✅ FAST - GPU accelerated */\ntransform: translateY(10px);\ntransform: scale(1.1);\ntransform: rotate(45deg);\nopacity: 0.5;\n\n/* ❌ SLOW - Triggers layout/paint */\ntop: 10px;\nwidth: 100px;\nbackground: red;\nmargin-left: 20px;`
      },
      {
        type: "text",
        value: "This is the foundation. If you animate anything other than transform or opacity, you're asking for janky frame drops."
      },
      {
        type: "text",
        value: "## The will-change Hint\n\nTell the browser what you're about to animate, and it can optimize ahead of time:"
      },
      {
        type: "code",
        language: "css",
        value: `.starfield {\n  animation: drift 120s linear infinite;\n  will-change: transform;\n}\n\n.nebula {\n  animation: pulse 30s ease-in-out infinite;\n  will-change: transform, opacity;\n}`
      },
      {
        type: "text",
        value: "But don't overuse will-change—it's expensive. Only apply it to elements that actually animate. For my blog's starfield background, it made a huge difference."
      },
      {
        type: "text",
        value: "## Timing Functions Matter\n\nNot all easing functions perform equally:"
      },
      {
        type: "code",
        language: "css",
        value: `/* ✅ Hardware-accelerated */\ntransition: transform 0.3s ease-out;\n\n/* ❌ Can cause stutter on some devices */\ntransition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);`
      },
      {
        type: "text",
        value: "Linear, ease, ease-in, ease-out, and ease-in-out are optimized. Complex cubic-bezier curves can cause micro-jank on lower-end devices."
      },
      {
        type: "text",
        value: "## The Starfield Implementation\n\nHere's how I implemented the scrolling starfield background for this blog:"
      },
      {
        type: "code",
        language: "css",
        value: `body::before {\n  content: '';\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background-image:\n    radial-gradient(2px 2px at 20px 30px, rgba(0, 255, 140, 0.8), transparent),\n    radial-gradient(1px 1px at 50px 50px, rgba(255, 255, 255, 0.9), transparent),\n    /* ...more stars */;\n  background-size: 200px 200px;\n  animation: starfield 120s linear infinite;\n  will-change: transform;\n  pointer-events: none;\n}\n\n@keyframes starfield {\n  from { transform: translateY(0); }\n  to { transform: translateY(-200px); }\n}`
      },
      {
        type: "text",
        value: "This runs at 60fps even on mid-range phones because:\n1. It only animates transform\n2. It uses will-change to hint the browser\n3. It's on a fixed positioned pseudo-element\n4. pointer-events: none prevents hit-testing overhead"
      },
      {
        type: "text",
        value: "## Measuring Performance\n\nUse Chrome DevTools Performance tab to profile your animations:\n\n1. Record a few seconds of animation\n2. Look at the frame chart—anything over 16ms is a dropped frame\n3. Check if Layout, Paint, or Composite is taking too long\n\nFor my starfield, frames consistently stayed under 10ms. Mission accomplished."
      },
      {
        type: "text",
        value: "## The Golden Rules\n\n1. **Animate transform and opacity only**\n2. **Use will-change for elements that animate**\n3. **Keep animations simple and purposeful**\n4. **Test on real devices, not just dev machines**\n5. **Use requestAnimationFrame for JavaScript animations**\n\nFollowing these rules, I achieved buttery smooth cosmic animations across the blog. The starfield scrolls endlessly, cards lift with a glow effect, and the nebula pulses—all at 60fps.\n\nSmooth animations aren't magic. They're engineering. And now you have the blueprint. 🎨⚡"
      }
    ],
  },
];

// Export for client components (they can't use async)
export const posts = fallbackPosts;

// Server-side functions that fetch from database
export async function getAllPosts() {
  try {
    const dbPosts = await getPostsFromDB();
    return dbPosts.length > 0 ? dbPosts : fallbackPosts;
  } catch (error) {
    console.error('Error fetching posts from database:', error);
    return fallbackPosts;
  }
}

export async function getPostBySlug(slug) {
  try {
    const post = await getPostFromDB(slug);
    return post || fallbackPosts.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching post from database:', error);
    return fallbackPosts.find((p) => p.slug === slug) || null;
  }
}
