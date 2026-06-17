// Comments
import { createComment, createProjectComment, listComments, updateComment, deleteComment } from '../api/commentsApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { state } from '../core/state.js';

let activeCommentTaskId = null;

export async function addComment(event, id = activeCommentTaskId) {
    event?.preventDefault?.();
    clearError(elements.addCommentError);

    if (!id) {
        showError(elements.addCommentError, 'No target selected for comment');
        return null;
    }
    
    const body = elements.commentContent.value.trim();
    
    setSubmitState(elements.addCommentForm, true);
    
    try {
        const isTask = activeCommentTaskId !== null;

        const result = isTask
            ? await createComment(id, { body })
            : await createProjectComment(id, { body });
        
        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to add comment');
            return null;
        }
        
        elements.commentContent.value = '';
        
        if (!Array.isArray(state.comments)) {
            state.comments = [];
        }

        state.comments.push(result.data.comment);
        renderComments();

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
        
        const updatedComment = result.data.comment;

        const commentIndex = state.comments.findIndex(comment => comment.id === commentId);
        if (commentIndex !== -1) {
            state.comments[commentIndex] = updatedComment;
        }

        renderComments();
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
        
        state.comments = state.comments.filter(comment => comment.id !== commentId);
        renderComments();
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

export async function loadComments(id, type = 'task') {
    clearError(elements.addCommentError);
    
    if (!id) {
        resetCommentsPanel();
        return [];
    }

    activeCommentTaskId = type === 'task' ? id : null;
    

    if (elements.addCommentForm) {
        elements.addCommentForm.hidden = false;
    }

    if (!state.tasks) {
        console.warn('No tasks loaded in state while loading comments for task ID:', id);
    }

    if (type === 'task') {
        const task = state.tasks.find(t => t.id === id);
        elements.commentHeader.innerHTML = `Task Comments: ${task?.title || 'Task'}`;
    } else {
        const project = state.selectedProject;
        elements.commentHeader.innerHTML = `Project Comments: ${project?.name || 'Project'}`;
    }

    try {
        const result = await listComments(id, type);
        
        if (!result.ok) {
            showError(elements.addCommentError, result.data?.message || 'Failed to load comments.');
            
            if (elements.commentsList) {
                elements.commentsList.innerHTML = '';
                renderEmptyCommentMessage('Failed to load comments.');
            }
            
            return [];
        }

        state.comments = result.data?.comments || [];

        renderComments();
        
        return state.comments;
    } catch (error) {
        console.error('Error loading comments:', error);
        showError(elements.addCommentError, 'An error occurred while loading comments. Please try again.');
        return [];
    }
}

function renderComments() {
    if (!elements.commentsList) return;

    const comments = Array.isArray(state.comments) ? state.comments : [];

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

function modifyComment(comment, newContent) {
    /*
    Edit and delete your own comments
    renderComments, inside forEach:
        build comment element
        if comment.created_by_user_id === state.user?.id:
            add Edit button (data-comment-action="edit")
            add Delete button (data-comment-action="delete")

    handleCommentClick(event):
        find closest [data-comment-id]; if none, return
        commentId = element.dataset.commentId
        action = event.target.dataset.commentAction

        if delete: confirm, call removeComment(commentId)
        if edit: swap body for textarea, swap buttons for Save/Cancel
        if save: read textarea, call editComment(commentId, newBody)
        if cancel: renderComments() to discard
    */

}