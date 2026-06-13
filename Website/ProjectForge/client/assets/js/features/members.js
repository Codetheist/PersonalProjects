// Members
import { addMember, listMembers, updateMember, deleteMember } from '../api/membersApi.js';
import { showError, clearError, setSubmitState } from '../shared/ui.js';
import { elements } from '../shared/dom.js';

export async function addProjectMember(event, projectId) {
    event.preventDefault();
    const form = event.target;
    const memberData = {
        user_id: form.user_id.value,
        role: form.role.value
    };
    try {
        setSubmitState(form, true);
        clearError(elements.addMemberError);
        const result = await addMember(projectId, memberData);

        if (!result.ok) {
            console.error('Member addition failed:', result.data?.message || 'Unknown error');
            showError(elements.addMemberError, result.data?.message || 'An error occurred while adding the member. Please try again.');
            return;
        }
        
        elements.addMemberForm.reset();
        elements.addMemberForm.hidden = true;
        
        await loadProjectMembers(projectId);
    } catch (error) {
        console.error('Error adding member:', error);
        showError(elements.addMemberError, 'An error occurred while adding the member. Please try again.');
    } finally {
        setSubmitState(form, false);
    }   
}

export async function loadProjectMembers(projectId) {
    try {
        const result = await listMembers(projectId);
        if (!result.ok) {
            console.error('Failed to load members:', result.data?.message || 'Unknown error');
            showError(elements.addMemberError, 'An error occurred while loading members. Please try again.');
            return;
        }
        const members = result.data.members || [];

        renderMembers(members);
        console.log('Members loaded:', members);
        
        return members;
    } catch (error) {
        console.error('Error loading members:', error);
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
            console.error('Member update failed:', result.data?.message || 'Unknown error');
            showError(elements.addMemberError, 'An error occurred while updating the member. Please try again.');
            return;
        }
        // Handle successful member update (e.g., update UI, redirect, etc.)
        await loadProjectMembers(projectId);
    } catch (error) {
        console.error('Error updating member:', error);
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
            console.error('Member removal failed:', result.data?.message || 'Unknown error');
            showError(elements.addMemberError, 'An error occurred while removing the member. Please try again.');
            return;
        }
        // Handle successful member removal (e.g., update UI, redirect, etc.)
        await loadProjectMembers(projectId);
    } catch (error) {
        console.error('Error removing member:', error);
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
        showError(elements.addMemberError, 'Member editing is not set up yet.');
    }
}

function renderMembers(members = []) {
    if (!elements.membersList) return;

    elements.membersList.innerHTML = '';
    
    if (!members.length) {
        elements.membersList.innerHTML = `
            <p class="empty-message">No members yet.</p>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();
    
    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'data-list-item member-item';
        memberItem.dataset.memberId = member.user_id || member.id;
        memberItem.classList.add('member-item');
        
        const roleLabel = member.role === 'admin'
            ? 'Owner'
            : 'Member';
        
        const canRemove = member.role !== 'admin';
        
        memberItem.innerHTML = `
            <div class="item-content">
                <span class='item-title'>${member.username}</span>
                <span class="item-meta">${roleLabel}</span>
            </div>

            <div class="item-actions" aria-label="Member actions">
                <button type="button" class="buttonLook btn btn-small" data-member-action="edit">
                    Edit
                </button>
                <button
                    type="button"
                    class="buttonLook btn btn-small secondaryButton btn-danger"
                    data-member-action="remove"
                    ${canRemove ? '' : 'disabled'}
                >   Remove
                </button>
            </div>
        `;
        fragment.appendChild(memberItem);
    });
    elements.membersList.appendChild(fragment);
}