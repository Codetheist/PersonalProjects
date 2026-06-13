// Comments
import { createComment, listComments, updateComment, deleteComment } from '../api/commentsApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { elements } from '../shared/dom.js';

let activeCommentTaskId = null;

export async function addComment(event, taskId = activeCommentTaskId) {
    event?.preventDefault?.();
    clearError(elements.addCommentError);

    if (!taskId) {
        showError(elements.addCommentError, 'No task selected for adding comment');
        return null;
    }

    if (!elements.commentContent || !elements.addCommentForm) {
        showError(elements.addCommentError, 'Comment form is missing required fields');
        return null;
    }

    const body = elements.commentContent.value.trim();
    
    if (!body) {
        showError(elements.addCommentError, 'Comment cannot be empty');
        return null;
    }
    
    setSubmitState(elements.addCommentForm, true);
    
    try {
        const result = await createComment(taskId, { body });
        
        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to add comment');
            return null;
        }
        
        elements.commentContent.value = '';
        
        await loadComments(taskId);

        return result.data.comment;
    } catch (error) {
        console.error('Error adding comment:', error);
        showError(elements.addCommentError, 'An error occurred while adding the comment. Please try again.');
        return null;
    } finally {
        setSubmitState(elements.addCommentForm, false);
    }
}

export async function editComment(commentId, commentData, taskId = activeCommentTaskId) {
    if (!commentId || !taskId) return null;

    clearError(elements.addCommentError);

    try {
        const result = await updateComment(commentId, commentData);
        
        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to update comment');
            return null;
        }
        
        await loadComments(taskId);

        return result.data.comment;
    } catch (error) {
        console.error('Error updating comment:', error);
        showError(elements.addCommentError, 'An error occurred while updating the comment. Please try again.');
        return null;
    }
}

export async function removeComment(commentId, taskId = activeCommentTaskId) {
    if (!commentId || !taskId) return null;

    if (!confirm('Are you sure you want to delete this comment?')) {
        return null;
    }

    clearError(elements.addCommentError);

    try {
        const result = await deleteComment(commentId);
        
        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to delete comment');
            return;
        }
        
        await loadComments(taskId);
    } catch (error) {
        console.error('Error deleting comment:', error);
        showError(elements.addCommentError, 'An error occurred while deleting the comment. Please try again.');
    }
}

export function resetCommentsPanel() {
    activeCommentTaskId = null;
    
    if (elements.commentsList) {
        elements.commentsList.innerHTML = '';
        renderEmptyCommentMessage('Select a task to view comments.');
    }

    if (elements.addCommentForm) {
        elements.addCommentForm.hidden = true;
    }

    if (elements.commentContent) {
        elements.commentContent.value = '';
    }

    clearError(elements.addCommentError);
}

export async function loadComments(taskId) {
    if (!taskId) {
        resetCommentsPanel();
        return [];
    }

    activeCommentTaskId = taskId;
    clearError(elements.addCommentError);

    if (elements.addCommentForm) {
        elements.addCommentForm.hidden = false;
    }

    try {
        const result = await listComments(taskId);

        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to load comments');
            
            if (elements.commentsList) {
                elements.commentsList.innerHTML = '';
                renderEmptyCommentMessage('Failed to load comments.');
            }
            
            return [];
        }

        const comments = result.data?.comments || [];
        renderComments(comments);
        return comments;
    } catch (error) {
        console.error('Error loading comments:', error);
        showError(elements.addCommentError, 'An error occurred while loading comments. Please try again.');
        return [];
    }
}

function renderComments(comments = []) {
    if (!elements.commentsList) return;

    elements.commentsList.innerHTML = '';
    if (!comments.length) {
        renderEmptyCommentMessage('No comments yet.');
        return;
    }

    const fragment = document.createDocumentFragment();

    comments.forEach((comment) => {
        const commentElement = document.createElement('article');
        commentElement.className = 'comment-item';
        commentElement.dataset.commentId = comment.id;

        const header = document.createElement('header');
        header.className = 'comment-header';

        const author = document.createElement('strong');
        author.className = 'comment-author';
        author.textContent = comment.created_by_username || 'Unknown User';

        const time = document.createElement('time');
        time.className = 'comment-time';

        const formattedTime = formatCommentTime(comment.created_at);
        time.textContent = formattedTime.text;
        time.dateTime = formattedTime.dateTime;

        const body = document.createElement('p');
        body.className = 'comment-body';
        body.textContent = comment.body || '';
        
        header.append(author, time);
        commentElement.append(header, body);
        fragment.appendChild(commentElement);
    });
    
    elements.commentsList.appendChild(fragment);
    elements.commentsList.scrollTop = elements.commentsList.scrollHeight;
}

function renderEmptyCommentMessage(message) {
    if (!elements.commentsList) return;

    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-state';
    emptyMessage.textContent = message;

    elements.commentsList.appendChild(emptyMessage);
}

function formatCommentTime(createdAt) {
    if (!createdAt) {
        const now = new Date();
        
        return {
            text: 'Just now',
            dateTime: now.toISOString()
        };
    }

    const timeStamp = Number(createdAt);

    const date = Number.isFinite(timeStamp)
        ? new Date(timeStamp * 1000)
        : new Date(createdAt);
    
    return {
        text: date.toLocaleString(),
        dateTime: date.toISOString()
    };
}