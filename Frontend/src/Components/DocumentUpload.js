import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Send, Loader, Eye, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DocumentUpload.css';

function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [text, setText] = useState('');
  const [lastInput, setLastInput] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = async () => {
    if (!text) {
      setUploadStatus('error');
      return;
    }

    setUploading(true);
    setProcessedData(null);
    setLastInput(text);  // Store the current input

    const formData = new FormData();
    formData.append('text', text);

    try {
      const response = await fetch('http://0.0.0.0:8000/detect/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Detection failed');
      }

      const result = await response.json();
      console.log('Detection result:', result);
      setProcessedData(result);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error detecting:', error);
      setUploadStatus('error');
    } finally {
      setUploading(false);
      setText('');  // Clear the input box
    }
  };

  const graphData = processedData ? [
    { name: 'Suicidal', probability: processedData.probabilities[0] },
    { name: 'Non-Suicidal', probability: processedData.probabilities[1] },
  ] : [];

  return (
    <div className="document-upload">
      <h2 className="main-title">
        <FileText className="icon" />
        Suicidal Content Detection
      </h2>

      <div className="textarea-container">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          rows={8}
          className="text-input"
        />
      </div>

      <div className="button-container">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className={`submit-button ${uploading ? 'uploading' : ''}`}
        >
          {uploading ? (
            <>
              <Loader className="icon animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <Send className="icon" />
              Detect
            </>
          )}
        </button>

        <button onClick={() => setShowInput(true)} className="submit-button">
          <Eye className="icon" />
          Show Input
        </button>
      </div>

      {uploadStatus === 'success' && (
        <div className="status-message success">
          <CheckCircle className="icon" />
          Detection successful!
        </div>
      )}
      {uploadStatus === 'error' && (
        <div className="status-message error">
          <AlertCircle className="icon" />
          Error detecting. Please try again.
        </div>
      )}

      {processedData && (
        <div className="results-section">
          <h3 className="section-title">
            <FileText className="icon" />
            Detection Results
          </h3>
          <div className="result-grid">
            <div className="result-item">
              <strong>Predicted Class:</strong> {processedData.predicted_class}
            </div>
          </div>

          <div className="graph-container">
            <h4 className="subsection-title">Probability Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Bar dataKey="probability" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {showInput && (
        <div className="modal-overlay" onClick={() => setShowInput(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="dialog-title">User Input</h2>
            <div className="user-input-display">
              {lastInput || "No input provided"}
            </div>
            <button onClick={() => setShowInput(false)} className="close-button">
              <X className="icon" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;