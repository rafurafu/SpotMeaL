import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * 投稿データの型定義
 */
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  title: string;
  description: string;
  imageUrl: string; // Cloudinaryの画像URL
  imagePublicId: string; // Cloudinaryのpublic ID
  location?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  tags?: string[];
  likes: number;
  likedBy: string[]; // いいねしたユーザーIDの配列
  comments: number;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  updatedAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

/**
 * 新規投稿を作成
 */
export const createPost = async (
  postData: Omit<Post, 'id' | 'likes' | 'likedBy' | 'comments' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const postsRef = collection(db, 'posts');
    const newPostRef = doc(postsRef);

    const post: Omit<Post, 'id'> = {
      ...postData,
      likes: 0,
      likedBy: [],
      comments: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newPostRef, post);
    console.log('Post created successfully:', newPostRef.id);
    return newPostRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('投稿の作成に失敗しました');
  }
};

/**
 * 投稿を取得
 */
export const getPost = async (postId: string): Promise<Post | null> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() } as Post;
    } else {
      console.log('No post found');
      return null;
    }
  } catch (error) {
    console.error('Error getting post:', error);
    throw new Error('投稿の取得に失敗しました');
  }
};

/**
 * 全投稿を取得（最新順）
 */
export const getAllPosts = async (limitCount: number = 20): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });

    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw new Error('投稿一覧の取得に失敗しました');
  }
};

/**
 * ユーザーの投稿を取得
 */
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });

    return posts;
  } catch (error) {
    console.error('Error getting user posts:', error);
    throw new Error('ユーザーの投稿取得に失敗しました');
  }
};

/**
 * 投稿を更新
 */
export const updatePost = async (
  postId: string,
  data: Partial<Omit<Post, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('投稿の更新に失敗しました');
  }
};

/**
 * 投稿を削除
 */
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    console.log('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('投稿の削除に失敗しました');
  }
};

/**
 * 投稿に「いいね」を追加
 */
export const likePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const post = await getPost(postId);

    if (!post) throw new Error('投稿が見つかりません');

    // 既にいいね済みの場合は何もしない
    if (post.likedBy.includes(userId)) {
      console.log('Already liked');
      return;
    }

    await updateDoc(postRef, {
      likes: post.likes + 1,
      likedBy: [...post.likedBy, userId],
      updatedAt: serverTimestamp(),
    });

    console.log('Post liked successfully');
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('いいねに失敗しました');
  }
};

/**
 * 投稿の「いいね」を解除
 */
export const unlikePost = async (postId: string, userId: string): Promise<void> => {
  try {
    const postRef = doc(db, 'posts', postId);
    const post = await getPost(postId);

    if (!post) throw new Error('投稿が見つかりません');

    // いいねしていない場合は何もしない
    if (!post.likedBy.includes(userId)) {
      console.log('Not liked yet');
      return;
    }

    await updateDoc(postRef, {
      likes: post.likes - 1,
      likedBy: post.likedBy.filter((id) => id !== userId),
      updatedAt: serverTimestamp(),
    });

    console.log('Post unliked successfully');
  } catch (error) {
    console.error('Error unliking post:', error);
    throw new Error('いいね解除に失敗しました');
  }
};
