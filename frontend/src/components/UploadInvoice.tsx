// src/components/UploadInvoice.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import '../styles/UploadInvoice.css';
import { useTranslation } from 'react-i18next';


const UploadInvoice: React.FC = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage(t('file_required'));
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await fetch('http://localhost:8000/api/documents/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error(t('error_upload'));
      }
      setMessage(t('file_uploaded'));
    } catch (error: any) {
      setMessage(error.message || t('error_upload'));
    }
  };

  return (
    <div className="upload-container animate-page">
      <h2>{t('upload_invoice')}</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.png" />
        <button type="submit" className="btn">{t('send')}</button>
      </form>
      {message && <p className="upload-message">{message}</p>}
    </div>
  );
};

export default UploadInvoice;