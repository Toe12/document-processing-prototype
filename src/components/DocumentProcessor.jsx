import { useState } from "react";
import { Upload, Button, message, Card, Typography, Tag, Alert } from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const DocumentProcessor = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // File type detection
  const getFileType = (file) => {
    const imageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    const pdfTypes = ["application/pdf"];

    if (imageTypes.includes(file.type)) {
      return "image";
    } else if (pdfTypes.includes(file.type)) {
      return "pdf";
    }
    return "other";
  };

  // Get file icon
  const getFileIcon = (file) => {
    const type = getFileType(file);
    switch (type) {
      case "image":
        return <FileImageOutlined style={{ color: "#52c41a" }} />;
      case "pdf":
        return <FilePdfOutlined style={{ color: "#f5222d" }} />;
      default:
        return <InboxOutlined style={{ color: "#d9d9d9" }} />;
    }
  };

  // Upload files
  const handleSubmit = async () => {
    if (fileList.length === 0) return;

    setUploading(true);

    try {
      // TODO: Implement backend API call
      // const formData = new FormData();
      // fileList.forEach((file) => {
      //   formData.append('files[]', file);
      // });
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData
      // });

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success status
      setSubmitted(true);
      setFileList([]);
      message.success("Files submitted successfully");
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Failed to submit files");
    } finally {
      setUploading(false);
    }
  };

  // Reset to upload new files
  const handleNewUpload = () => {
    setSubmitted(false);
    setFileList([]);
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // File type validation
      const type = getFileType(file);
      if (type === "other") {
        message.error("Only images and PDF files are allowed");
        return false;
      }

      // File size validation (1MB limit)
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
        message.error("File must be smaller than 1MB");
        return false;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    multiple: true,
    accept: ".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp",
  };

  // Show submitted status
  if (submitted) {
    return (
      <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
        <Card style={{ textAlign: "center", padding: "40px 20px" }}>
          <CheckCircleOutlined
            style={{ fontSize: "64px", color: "#52c41a", marginBottom: "24px" }}
          />
          <Title level={3} style={{ color: "#52c41a", marginBottom: "16px" }}>
            Files Submitted Successfully!
          </Title>
          <Text
            type="secondary"
            style={{ fontSize: "16px", marginBottom: "32px", display: "block" }}
          >
            Your documents have been submitted and are being processed.
          </Text>
          <Button
            onClick={handleNewUpload}
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#d9d9d9",
              color: "#000000",
            }}
          >
            Upload More Files
          </Button>
        </Card>
      </div>
    );
  }

  // Show upload interface
  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={3}>Document Upload</Title>
      <Text type="secondary">
        Upload images and PDF documents for processing
      </Text>

      <Card style={{ marginTop: "24px" }}>
        <Dragger {...uploadProps} style={{ marginBottom: "16px" }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for images (JPG, PNG, GIF, BMP, WebP) and PDF files. Maximum
            1MB per file.
          </p>
        </Dragger>

        {fileList.length > 0 && (
          <div>
            <Text strong style={{ marginBottom: "12px", display: "block" }}>
              Selected Files ({fileList.length})
            </Text>

            <div style={{ marginBottom: "16px" }}>
              {fileList.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "6px",
                    marginBottom: "8px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <span style={{ marginRight: "12px" }}>
                    {getFileIcon(file)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div>{file.name}</div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Text>
                  </div>
                  <Tag color={getFileType(file) === "image" ? "green" : "red"}>
                    {getFileType(file).toUpperCase()}
                  </Tag>
                  <Button
                    type="text"
                    size="small"
                    onClick={() => uploadProps.onRemove(file)}
                    style={{ marginLeft: "8px" }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                onClick={handleSubmit}
                disabled={fileList.length === 0}
                loading={uploading}
                icon={<UploadOutlined />}
              >
                {uploading
                  ? "Submitting..."
                  : `Submit ${fileList.length} file${
                      fileList.length > 1 ? "s" : ""
                    }`}
              </Button>
              <Button onClick={() => setFileList([])}>Clear All</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DocumentProcessor;
