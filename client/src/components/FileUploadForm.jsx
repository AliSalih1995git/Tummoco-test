import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const FileUploadForm = () => {
  const userId = useSelector((state) => state.user.id);

  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);

        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/files/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("File uploaded successfully!");
        setFile(null);
      } catch (error) {
        console.error(error);
        alert("File upload failed.");
      }
    } else {
      alert("Please select a file.");
    }
  };

  useEffect(() => {
    const fetchImageFiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/files`
        );
        const { files } = response.data;
        setFileData(files);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImageFiles();
  }, [file]);

  return (
    <div className="m-8">
      <form className="m-8 w-1/2 " onSubmit={handleSubmit}>
        <label
          class="block mb-2 text-lg font-semibold text-gray-900 dark:text-white"
          for="file_input"
        >
          Upload file
        </label>

        <input
          class="block w-full -md text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          class="w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
        >
          Upload
        </button>
      </form>
      <div className="mt-8">
        <div>
          <h1>Image Files</h1>
          {fileData.map((file, index) => {
            const decodedFileName = decodeURIComponent(file);
            const imageURL = `http://localhost:7010/uploads/${decodedFileName}`;

            return (
              <div key={index}>
                <img src={imageURL} alt={decodedFileName} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileUploadForm;
