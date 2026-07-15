// Comments
import {
    createComment,
    createProjectComment,
    listComments,
    updateComment,
    deleteComment
} from '../api/commentsApi.js';
import {
    showError,
    clearError,
    setSubmitState
} from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { state } from '../core/state.js';
import { encodeHTML } from '../shared/util.js';

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
        showError(elements.addCommentError, 'An error occurred while adding the comment. Please try again.');
        return null;
    } finally {
        setSubmitState(elements.addCommentForm, false);
    }
}

export async function editComment(commentId, commentData, taskId = activeCommentTaskId) {
    if (!commentId) return null;

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
        showError(elements.addCommentError, 'An error occurred while updating the comment. Please try again.');
        return null;
    }
}

export async function removeComment(commentId, taskId = activeCommentTaskId) {
    if (!commentId) return null;

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

    if (type === 'task') {
        const task = state.tasks.find(t => t.id === id);
        elements.commentHeader.innerHTML = `Task Comments: ${encodeHTML(task?.title || 'Task')}`;
    } else {
        const project = state.selectedProject;
        elements.commentHeader.innerHTML = `Project Comments: ${encodeHTML(project?.name || 'Project')}`;
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
        const isEditing = state.editingCommentId === comment.id;
        const isAuthor = state.user?.id === comment.created_by_user_id;

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

        const isEdited = comment.updated_at && comment.updated_at !== comment.created_at;
        const stamp = formatCommentTime(isEdited ? comment.updated_at : comment.created_at, true);
        time.textContent = isEdited ? `Edited: ${stamp.text}` : stamp.text;
        time.dateTime = stamp.dateTime;

        let body;
        
        const commentEditContainer = document.createElement('span');
        commentEditContainer.className = 'comment-actions';

        if (isEditing) {
            const save = document.createElement('button');
            save.textContent = 'Save';
            save.dataset.commentAction = 'save';
            save.className = 'action-link';

            const bulletChar = document.createElement('span');
            bulletChar.textContent = '•';
            bulletChar.className = 'dot';

            const cancel = document.createElement('button');
            cancel.textContent = 'Cancel';
            cancel.dataset.commentAction = 'cancel';
            cancel.className = 'action-link';

            commentEditContainer.append(save, bulletChar, cancel);
            header.append(author, commentEditContainer, time);
        } else {
            if (isAuthor) {
                const edit = document.createElement('button');
                edit.textContent = 'Edit';
                edit.dataset.commentAction = 'edit';
                edit.className = 'action-link';

                const bulletChar = document.createElement('span');
                bulletChar.textContent = '•';
                bulletChar.className = 'dot';

                const del = document.createElement('button');
                del.textContent = 'Delete';
                del.dataset.commentAction = 'delete';
                del.className = 'action-link';

                commentEditContainer.append(edit, bulletChar, del);
                header.append(author, commentEditContainer, time);
            } else {
                header.append(author, time);
            }
        }

        if (isEditing) {
            const textarea = document.createElement('textarea');
            textarea.value = comment.body || '';
            textarea.className = 'comment-edit-textarea';
            body = textarea;
        } else {
            const paragraph = document.createElement('p');
            paragraph.className = 'comment-body';
            paragraph.textContent = comment.body || '';
            body = paragraph;
        }
        
        if (isEdited) {
            time.classList.add('comment-time-edited');
        }
        
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

function formatCommentTime(createdAt, short = false) {
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
    
    const text = short
        ? date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
        : date.toLocaleString();
    
    return {
        text: text,
        dateTime: date.toISOString()
    };
}

export function handleCommentActions(event) {
    const actionButton = event.target.closest('button[data-comment-action]');
    if (!actionButton) return;
    const commentElement = actionButton.closest('.comment-item');
    if (!commentElement) return;
    const commentId = commentElement.dataset.commentId;
    if (!commentId) return;
    const action = actionButton.dataset.commentAction;

    if (action === 'edit') {
        state.editingCommentId = commentId;
        renderComments();
    } else if (action === 'delete') {
        removeComment(commentId);
    } else if (action === 'save') {
        const textarea = commentElement.querySelector('.comment-edit-textarea');
        if (textarea) {
            const updatedContent = textarea.value.trim();
            if (updatedContent) {
                editComment(commentId, { body: updatedContent });
                state.editingCommentId = null;
            } else {
                showError(elements.addCommentError, 'Comment content cannot be empty.');
            }
        }
    } else if (action === 'cancel') {
        state.editingCommentId = null;
        renderComments();
    }   
}