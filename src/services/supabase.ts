import { createClient } from '@supabase/supabase-js';
import type { User } from '@/types';

// Initialize Supabase client
// These values would typically be stored in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication services
export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string, username: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          reputation: 0,
          token_balance: 0,
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in an existing user
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get the current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Get the user profile data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    return {
      ...data,
      id: user.id,
      email: user.email,
    } as User;
  },

  // Update user profile
  async updateProfile(profile: Partial<User>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // Set up auth state change listener
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          callback({
            ...data,
            id: session.user.id,
            email: session.user.email || '',
          } as User);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },
};

// Discussion services
export const discussionService = {
  // Get discussions with pagination and filtering
  async getDiscussions(options: {
    page?: number;
    limit?: number;
    field?: string;
    searchQuery?: string;
    tags?: string[];
  }) {
    const { page = 1, limit = 10, field, searchQuery, tags } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let query = supabase
      .from('discussions')
      .select(`
        *,
        author:profiles(*),
        comments:comments(count)
      `, { count: 'exact' });
    
    if (field) {
      query = query.eq('research_field', field);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }
    
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    
    return {
      discussions: data || [],
      count: count || 0,
    };
  },
  
  // Create a new discussion
  async createDiscussion(discussion: {
    title: string;
    content: string;
    researchField: string;
    subFields?: string[];
    tags?: string[];
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('discussions')
      .insert({
        title: discussion.title,
        content: discussion.content,
        author_id: user.id,
        research_field: discussion.researchField,
        sub_fields: discussion.subFields || [],
        tags: discussion.tags || [],
        likes: 0,
        comment_count: 0,
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get a single discussion with its comments
  async getDiscussion(id: string) {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        author:profiles(*),
        comments:comments(
          *,
          author:profiles(*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Like a discussion
  async likeDiscussion(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // First check if the user has already liked this discussion
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('discussion_id', id)
      .maybeSingle();
      
    if (likeCheckError) throw likeCheckError;
    
    if (existingLike) {
      // User already liked this discussion, so remove the like
      const { error: deleteLikeError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteLikeError) throw deleteLikeError;
      
      // Decrement the likes count
      const { error: updateError } = await supabase.rpc('decrement_discussion_likes', { discussion_id: id });
      if (updateError) throw updateError;
      
      return { action: 'unliked' };
    } else {
      // User hasn't liked this discussion yet, so add a like
      const { error: insertLikeError } = await supabase
        .from('likes')
        .insert({
          user_id: user.id,
          discussion_id: id,
        });
        
      if (insertLikeError) throw insertLikeError;
      
      // Increment the likes count
      const { error: updateError } = await supabase.rpc('increment_discussion_likes', { discussion_id: id });
      if (updateError) throw updateError;
      
      return { action: 'liked' };
    }
  },
};

// Comment services
export const commentService = {
  // Add a comment to a discussion
  async addComment(discussionId: string, content: string, parentCommentId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('comments')
      .insert({
        content,
        author_id: user.id,
        discussion_id: discussionId,
        parent_comment_id: parentCommentId || null,
        likes: 0,
      })
      .select(`
        *,
        author:profiles(*)
      `)
      .single();
      
    if (error) throw error;
    
    // Increment the comment count on the discussion
    await supabase.rpc('increment_discussion_comments', { discussion_id: discussionId });
    
    return data;
  },
  
  // Like a comment
  async likeComment(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    // First check if the user has already liked this comment
    const { data: existingLike, error: likeCheckError } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('user_id', user.id)
      .eq('comment_id', id)
      .maybeSingle();
      
    if (likeCheckError) throw likeCheckError;
    
    if (existingLike) {
      // User already liked this comment, so remove the like
      const { error: deleteLikeError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('id', existingLike.id);
        
      if (deleteLikeError) throw deleteLikeError;
      
      // Decrement the likes count
      const { error: updateError } = await supabase.rpc('decrement_comment_likes', { comment_id: id });
      if (updateError) throw updateError;
      
      return { action: 'unliked' };
    } else {
      // User hasn't liked this comment yet, so add a like
      const { error: insertLikeError } = await supabase
        .from('comment_likes')
        .insert({
          user_id: user.id,
          comment_id: id,
        });
        
      if (insertLikeError) throw insertLikeError;
      
      // Increment the likes count
      const { error: updateError } = await supabase.rpc('increment_comment_likes', { comment_id: id });
      if (updateError) throw updateError;
      
      return { action: 'liked' };
    }
  },
}; 