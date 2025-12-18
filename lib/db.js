import { createClient } from 'redis';

const POSTS_KEY = 'blog:posts';

let redisClient = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    await redisClient.connect();
  }
  return redisClient;
}

// Get all posts
export async function getAllPosts() {
  try {
    const client = await getRedisClient();
    const postsJson = await client.get(POSTS_KEY);
    if (!postsJson) {
      return [];
    }
    const posts = JSON.parse(postsJson);
    if (!Array.isArray(posts)) {
      return [];
    }
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(slug) {
  try {
    const client = await getRedisClient();
    const postsJson = await client.get(POSTS_KEY);
    if (!postsJson) {
      return null;
    }
    const posts = JSON.parse(postsJson);
    if (!Array.isArray(posts)) {
      return null;
    }
    return posts.find((p) => p.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
}

// Create a new post
export async function createPost(postData) {
  try {
    const client = await getRedisClient();
    const postsJson = await client.get(POSTS_KEY);
    const posts = postsJson ? JSON.parse(postsJson) : [];
    
    // Check if slug already exists
    if (posts.find(p => p.slug === postData.slug)) {
      throw new Error('A post with this slug already exists');
    }

    // Add new post
    posts.push(postData);
    
    // Save back to Redis
    await client.set(POSTS_KEY, JSON.stringify(posts));
    
    return { success: true, post: postData };
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Update an existing post
export async function updatePost(slug, postData) {
  try {
    const client = await getRedisClient();
    const postsJson = await client.get(POSTS_KEY);
    const posts = postsJson ? JSON.parse(postsJson) : [];
    
    // Find the post index
    const postIndex = posts.findIndex(p => p.slug === slug);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    // Update the post (keep the original slug)
    posts[postIndex] = { ...postData, slug };
    
    // Save back to Redis
    await client.set(POSTS_KEY, JSON.stringify(posts));
    
    return { success: true, post: posts[postIndex] };
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete a post
export async function deletePost(slug) {
  try {
    const client = await getRedisClient();
    const postsJson = await client.get(POSTS_KEY);
    const posts = postsJson ? JSON.parse(postsJson) : [];
    
    // Filter out the post
    const filteredPosts = posts.filter(p => p.slug !== slug);
    
    if (filteredPosts.length === posts.length) {
      throw new Error('Post not found');
    }
    
    // Save back to Redis
    await client.set(POSTS_KEY, JSON.stringify(filteredPosts));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Initialize posts (for migration)
export async function initializePosts(posts) {
  try {
    const client = await getRedisClient();
    await client.set(POSTS_KEY, JSON.stringify(posts));
    return { success: true };
  } catch (error) {
    console.error('Error initializing posts:', error);
    throw error;
  }
}
