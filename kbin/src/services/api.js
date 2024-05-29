// src/services/api.js
import axios from 'axios'

const BASE_URL = 'http://127.0.0.1:8000/api';
const API_KEY = '2dab9c15f41ab219cc435c4d2f95162aa39c4841';

// Function to fetch comments for a thread
export const getComments = async (threadId, orderBy = 'newest') => {
  try {
    const response = await fetch(`${BASE_URL}/comments/?thread_id=${threadId}&order_by=${orderBy}`, {
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Function to create a comment for a thread
export const createComment = async (commentData) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const voteComment = async (commentId, voteType) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/${commentId}/${voteType}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to vote on comment');
    }
  } catch (error) {
    console.error('Error voting on comment:', error);
    throw error;
  }
};


// Function to fetch magazines
export const getMagazines = async (orderBy = 'subscriptions_count') => {
  try {
    const response = await fetch(`${BASE_URL}/magazines/?orderby=${orderBy}`, {
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch magazines');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching magazines:', error);
    throw error;
  }
};

// Function to create a magazine
export const createMagazine = async (magazineData) => {
  try {
    const response = await fetch(`${BASE_URL}/magazines/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
      body: JSON.stringify(magazineData),
    });
    if (!response.ok) {
      throw new Error('Failed to create magazine');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating magazine:', error);
    throw error;
  }
};

// Function to subscribe a user to a magazine
export const subscribeToMagazine = async (magazineId) => {
  try {
    const response = await fetch(`${BASE_URL}/magazines/${magazineId}/subscriptions/`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to subscribe to magazine');
    }
  } catch (error) {
    console.error('Error subscribing to magazine:', error);
    throw error;
  }
};

// Function to unsubscribe a user from a magazine
export const unsubscribeFromMagazine = async (magazineId) => {
  try {
    const response = await fetch(`${BASE_URL}/magazines/${magazineId}/subscriptions/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to unsubscribe from magazine');
    }
  } catch (error) {
    console.error('Error unsubscribing from magazine:', error);
    throw error;
  }
};

// Function to fetch threads
export const getThreads = async (filter = 'all', orderBy = 'created_at', token = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Token ${API_KEY}`;
    }

    const response = await fetch(`${BASE_URL}/threads/?filter=${filter}&order_by=${orderBy}`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch threads');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
};

// Function to get a thread
export const getThread = async (threadId, token = false) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Token ${API_KEY}`;
    }

    const response = await fetch(`${BASE_URL}/threads/${threadId}/`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch thread');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    throw error;
  }
};

// Function to create a thread
export const createThread = async (threadData) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
      body: JSON.stringify(threadData),
    });

    if (!response.ok) {
      throw new Error('Failed to create thread');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw error;
  }
};


// Function boost a thread
export const boostThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/boosts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("The user has already boosted this thread");
      }
      throw new Error('Failed to boost thread');
    }

  } catch (error) {
    console.error('Error boosting thread:', error);
    throw error;
  }
};

// Function to unboost a thread
export const unboostThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/boosts/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to unboost thread');
    }

  } catch (error) {
    console.error('Error unboosting thread:', error);
    throw error;
  }
};


// Function to like a thread
export const likeThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/likes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to like thread');
    }

  } catch (error) {
    console.error('Error liking thread:', error);
    throw error;
  }
};


// Function to delete like
export const unlikeThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/likes/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to like thread');
    }

  } catch (error) {
    console.error('Error liking thread:', error);
    throw error;
  }
};


// Function to dislike a thread
export const dislikeThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/dislikes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to dislike thread');
    }

  } catch (error) {
    console.error('Error disliking thread:', error);
    throw error;
  }
};


// Function to delete dislike
export const undislikeThread = async (threadId) => {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}/dislikes/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to dislike thread');
    }

  } catch (error) {
    console.error('Error disliking thread:', error);
    throw error;
  }
};


// Function to fetch profile details for logged in user
export const getMyProfile = async () => {
  try {
    const response = await fetch(`${BASE_URL}/profile/myprofile/`, {
      headers: {
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch profile details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile details:', error);
    throw error;
  }
};

// Function to fetch profile details for a user
export const getProfile = async (userId) => {
  try {
    console.log(userId)
    const response = await axios.get(`${BASE_URL}/profile/${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
};

// Function to update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    const response = await fetch(`${BASE_URL}/profile/${userId}/edit/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`, // Replace YOUR_API_KEY with actual API key
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const search = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search/?query=${query}`, {
      params: {
        q: query
      },
    });
    if (!response.ok) {
      throw new Error('Failed to search');
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
}


// Function to update
