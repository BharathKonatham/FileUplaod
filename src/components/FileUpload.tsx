import { ChangeEvent, useState } from "react";
import axios from "axios";
type UploadStatus = "idle" | "uploading" | "success" | "error";
export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleFileUplaod = async () => {
    if (!file) return;
    setProgress(0);
    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("https://httpbin.org/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round(progressEvent.loaded * 100) / progressEvent.total
            : 0;
            setProgress(progress);
        },
      });
      setStatus("success");
      setProgress(100);
    } catch (e) {
      setStatus("error");
      setProgress(0);
    }
  };
  return (
    <div className="space-y-2">
      <input type="file" onChange={handleFileChange}></input>

      {file && (
        <div className="mb-4 text-sm">
          <p>File name:{file.name}</p>
          <p>Size:{(file.size / 1024).toFixed(2)}KB</p>
          <p>Type:{file.type}</p>
        </div>
      )}

      {file && status !== "uploading" && (
        <button onClick={handleFileUplaod}> Upload</button>
      )}
      {status === "uploading" && (
        <div classNam= 'space-y-2'>
            <div classNam='h-2.5 w-full rounded-full bg-gray-200'>
                <div className = 'h-2.5 rounded-full bg-blue-600 transition-all  
                duration-300'
                    style={{width:'${progress}%'}}>
                </div>
            </div>
            <p className='text-sm text-gray-600'>{progress}% uploaded </p>
        </div>
               
      )}
      {status === "success" && (
        <p className="text-sm text-green-600">File uploaded successfully </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">upload failed. please try again</p>
      )}
    </div>
  );
}
