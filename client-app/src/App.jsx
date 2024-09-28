import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleReset = () => {
    setFile(null);
    setUploadStatus('');
    setMessage('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/candidates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      setMessage('File successfully uploaded.');
      setUploadStatus('success');
    } catch (err) {
      setMessage('File upload failed');
      setUploadStatus('error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="relative w-[80%] h-[80%] bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 border-b pb-2 h-16 bg-blue-500 px-4 rounded-t-lg">
          <h2 className="text-2xl font-bold text-white">Add From Excel</h2>
          <button className="text-white text-xl" onClick={handleReset}>
            ✖
          </button>
        </div>

        <p className="text-center text-lg mb-4">Add Candidates to Database</p>

        <div className="flex justify-center items-center h-[60%] w-[80%] mx-auto my-4 border-2 border-gray-300 rounded-lg shadow-md p-4">
          {uploadStatus === '' && !file && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-black mb-4 flex justify-center items-center">
                <span className="text-white text-4xl">⬆️</span>
              </div>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer text-blue-500 underline text-lg"
              >
                Upload a .xlsx or .xls file.
              </label>
            </div>
          )}

          {file && uploadStatus === '' && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-black mb-4 flex justify-center items-center">
                <span className="text-white text-4xl">⬆️</span>
              </div>
              <div className="mb-4 text-gray-700 text-lg">{file.name}</div>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-lg"
              >
                Submit
              </button>
            </div>
          )}

          {uploadStatus === 'success' && (
            <div className="flex flex-col items-center">
              <div className="mb-4 text-green-500 text-lg">
                Thank You!
              </div>
              <span className=" mb-4 text-black-400 text-lg">✔️

                {message}
              </span>
              <div className="mb-4 text-black-400 text-lg">
                Your records will be processed shortly.
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-red-500 mb-4 flex justify-center items-center">
                <span className="text-white text-4xl">❌</span>
              </div>
              <div className="mb-4 text-red-500 text-lg">
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
