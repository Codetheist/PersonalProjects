// Members
import {
    addMember,
    listMembers,
    updateMember,
    deleteMember
} from '../api/membersApi.js';
import {
    showError,
    clearError,
    setSubmitState
} from '../shared/ui.js';
import { elements } from '../shared/dom.js';
import { state } from '../core/state.js';
import { PAGE_ROUTES } from '../core/routes.js';
import { encodeHTML } from '../shared/util.js';

export async function addProjectMember(event, projectId) {
    event.preventDefault();
    const form = event.target;
    const memberData = {
        username: form.username.value,
        role: form.role.value
    };
    try {
        setSubmitState(form, true);
        clearError(elements.addMemberError);
        const result = await addMember(projectId, memberData);

        if (!result.ok) {
            showError(elements.addMemberError, result.data?.message || 'An error occurred while adding the member. Please try again.');
            return;
        }
        
        elements.addMemberForm.reset();
        elements.addMemberForm.hidden = true;
        
        await loadProjectMembers(projectId);
    } catch (error) {
        showError(elements.addMemberError, 'An error occurred while adding the member. Please try again.');
    } finally {
        setSubmitState(form, false);
    }   
}

export async function loadProjectMembers(projectId) {
    try {
        const result = await listMembers(projectId);
        if (!result.ok) {
            showError(elements.addMemberError, 'An error occurred while loading members. Please try again.');
            return;
        }
        state.members = result.data.members || [];

        renderMembers();
        
        return state.members;
    } catch (error) {
        showError(elements.addMemberError, 'An error occurred while loading members. Please try again.');
    }
}

export async function editProjectMember(event, projectId, userId) {
    event.preventDefault();
    const form = event.target;
    const updates = {
        role: form.role.value
    };
    try {
        setSubmitState(form, true);
        clearError(elements.addMemberError);
        const result = await updateMember(projectId, userId, updates);
        if (!result.ok) {
            showError(elements.addMemberError, 'An error occurred while updating the member. Please try again.');
            return;
        }
        // Handle successful member update (e.g., update UI, redirect, etc.)
        const updatedMember = result.data.member;

        const memberIndex = state.members.findIndex(member => member.user_id === userId);
        
        if (memberIndex !== -1) {
            state.members[memberIndex] = updatedMember;
        }
        
        renderMembers();
    } catch (error) {
        showError(elements.addMemberError, 'An error occurred while updating the member. Please try again.');
    } finally {
        setSubmitState(form, false);
    }
}

export async function removeProjectMember(projectId, userId) {
    if (!confirm('Are you sure you want to remove this member from the project?')) {
        return;
    }
    try {
        const result = await deleteMember(projectId, userId);
        if (!result.ok) {
            showError(elements.addMemberError, 'An error occurred while removing the member. Please try again.');
            return;
        }

        const removeSlf = userId === state.user?.id;
        // Handle successful member removal (e.g., update UI, redirect, etc.)
        await loadProjectMembers(projectId);

        if (removeSlf) {
            window.location.replace(PAGE_ROUTES.dashboard);
            return;
        }
    } catch (error) {
        showError(elements.addMemberError, 'An error occurred while removing the member. Please try again.');
    }
}

export async function handleMemberClick(event, projectId) {
    const memberRow = event.target.closest('[data-member-id]');

    if (!memberRow) return;

    const memberId = memberRow.dataset.memberId;
    const action = event.target.dataset.memberAction;

    if (!memberId || !action) return;

    if (action === 'remove') {
        await removeProjectMember(projectId, memberId);
        return;
    }

    if (action === 'edit') {
        const inlineEdit = memberRow.querySelector('.member-inline-edit');
        const content = memberRow.querySelector('[data-member-content]');
        const actions = memberRow.querySelector('[data-member-actions]');
        if (!inlineEdit) return;
        content.hidden = true;
        actions.hidden = true;
        inlineEdit.hidden = false;
        return;
    }

    if (action === 'save-edit') {
        const inlineEdit = memberRow.querySelector('.member-inline-edit');
        const roleSelect = inlineEdit?.querySelector('[data-member-role]');
        const result = await updateMember(projectId, memberId, { role: roleSelect.value });
        if (!result.ok) {
            showError(elements.addMemberError, 'Failed to update member role.');
            return;
        }
        await loadProjectMembers(projectId);
        return;
    }

    if (action === 'cancel-edit') {
        const inlineEdit = memberRow.querySelector('.member-inline-edit');
        const content = memberRow.querySelector('[data-member-content]');
        const actions = memberRow.querySelector('[data-member-actions]');
        if (!inlineEdit) return;
        inlineEdit.hidden = true;
        content.hidden = false;
        actions.hidden = false;
        return;
    }
}

function renderMembers() {
    const members = Array.isArray(state.members) ? state.members : [];
    
    if (!elements.membersList) return;

    elements.membersList.innerHTML = '';
    
    if (!members.length) {
        elements.membersList.innerHTML = `
            <p class="empty-message">No members yet.</p>
        `;
        return;
    }

    const currentUser = state.user;
    const currentUserRole = members.find(m_user => m_user.username === currentUser?.username)?.role;
    
    const fragment = document.createDocumentFragment();
    
    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'data-list-item member-item';
        memberItem.dataset.memberId = member.user_id || member.id;
        memberItem.classList.add('member-item');
        
        const roleLabel = member.role === 'admin'
            ? 'Owner'
            : 'Member';
        
        const isOwner = currentUserRole === 'admin';
        const isSelf = member.username === currentUser?.username;
        
        const canRemove = isOwner || isSelf;
        const canEdit = isOwner;
        const showActions = isOwner || isSelf;
        
        memberItem.innerHTML = `
            <div class="item-content" data-member-content>
                <span class='item-title'>${encodeHTML(member.username)}</span>
                <span class="item-meta">${roleLabel}</span>
            </div>

            <div class="item-actions" data-member-actions aria-label="Member actions">
                ${showActions ? `
                    ${canEdit ? `
                        <button type="button" class="buttonLook btn btn-small" data-member-action="edit">
                            Edit
                        </button>
                    ` : ''}
                    ${canRemove ? `
                        <button type="button" class="buttonLook btn btn-small secondaryButton btn-danger" data-member-action="remove">
                            Remove
                        </button>
                    ` : ''}
                ` : ''}
            </div>

            ${canEdit ? `
            <div class="member-inline-edit" hidden>
                <select data-member-role>
                    <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="member" ${member.role === 'member' ? 'selected' : ''}>Member</option>
                </select>
                <button type="button" class="buttonLook btn btn-small primaryButton" data-member-action="save-edit">Save</button>
                <button type="button" class="buttonLook btn btn-small secondaryButton" data-member-action="cancel-edit">Cancel</button>
            </div>
            ` : ''}
        `
        fragment.appendChild(memberItem);
    });
    elements.membersList.appendChild(fragment);
}