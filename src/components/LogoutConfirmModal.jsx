// LogoutConfirmModal.jsx
import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const LogoutConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!isOpen) return;

    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout? You will need to login again to access your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
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
  }, [isOpen, onConfirm, onCancel]);

  return null;
};

export default LogoutConfirmModal;