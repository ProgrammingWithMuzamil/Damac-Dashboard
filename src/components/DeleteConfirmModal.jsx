// DeleteConfirmModal.jsx
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, itemName, itemType }) => {
  useEffect(() => {
    if (!isOpen) return;

    Swal.fire({
      title: `Delete ${itemType || 'item'}?`,
      text: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      allowOutsideClick: false,
      allowEscapeKey: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else {
        onCancel();
      }
    });

    return () => {
      Swal.close();
    };
  }, [isOpen, onConfirm, onCancel, itemName, itemType]);

  return null;
};

export default DeleteConfirmModal;
