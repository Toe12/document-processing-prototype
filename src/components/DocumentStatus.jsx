import React, { useState, useEffect } from "react";
import { Card, List, Tag, Button, Typography, Space, Modal } from "antd";
import {
  FileImageOutlined,
  FilePdfOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const DocumentStatus = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // TODO: Replace with API call to fetch documents
  // hardcoded: Sample documents with different statuses
  const sampleDocuments = [
    {
      id: 1,
      name: "contract_agreement.pdf",
      type: "pdf",
      size: 0.85,
      status: "processing",
      uploadedAt: "2024-01-15 10:30:00",
      documentUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: 2,
      name: "invoice_receipt.jpg",
      type: "image",
      size: 0.65,
      status: "need_approval",
      uploadedAt: "2024-01-15 10:25:00",
      documentUrl: "https://picsum.photos/800/600?random=1",
      extractedData: {
        name: "John Smith",
        policyNumber: "POL-2024-001234",
        vin: "1HGBH41JXMN109186",
        expirationDate: "2025-03-15",
      },
    },
    {
      id: 3,
      name: "identity_document.pdf",
      type: "pdf",
      size: 0.92,
      status: "approved",
      uploadedAt: "2024-01-15 10:20:00",
      documentUrl: "https://www.africau.edu/images/default/sample.pdf",
    },
    {
      id: 4,
      name: "bank_statement.png",
      type: "image",
      size: 0.78,
      status: "processing",
      uploadedAt: "2024-01-15 10:35:00",
      documentUrl: "https://picsum.photos/800/600?random=2",
    },
    {
      id: 5,
      name: "tax_document.pdf",
      type: "pdf",
      size: 0.43,
      status: "need_approval",
      uploadedAt: "2024-01-15 10:15:00",
      documentUrl: "https://www.clickdimensions.com/links/TestPDFfile.pdf",
      extractedData: {
        name: "Sarah Johnson",
        policyNumber: "POL-2024-005678",
        vin: "2T1BURHE0JC014567",
        expirationDate: "2024-12-20",
      },
    },
    {
      id: 6,
      name: "passport_scan.jpg",
      type: "image",
      size: 0.56,
      status: "rejected",
      uploadedAt: "2024-01-15 10:10:00",
      rejectionReason: "Image quality too low",
      documentUrl: "https://picsum.photos/800/600?random=3",
    },
  ];

  useEffect(() => {
    setDocuments(sampleDocuments);

    // Simulate processing documents completing
    const interval = setInterval(() => {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => {
          if (doc.status === "processing") {
            // Randomly convert some processing documents to need_approval
            if (Math.random() < 0.1) {
              // 10% chance every 2 seconds
              return {
                ...doc,
                status: "need_approval",
                documentUrl:
                  doc.type === "pdf"
                    ? "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                    : "https://picsum.photos/800/600?random=4",
                extractedData: {
                  name: "Michael Brown",
                  policyNumber: `POL-2024-${
                    Math.floor(Math.random() * 900000) + 100000
                  }`,
                  vin: `3VW2A7AU${
                    Math.floor(Math.random() * 90000000) + 10000000
                  }`,
                  expirationDate: "2025-06-30",
                },
              };
            }
          }
          return doc;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Status configurations
  const statusConfig = {
    processing: {
      text: "Processing",
      color: "orange",
      icon: <SyncOutlined spin />,
    },
    need_approval: {
      text: "Need Approval",
      color: "purple",
      icon: <ClockCircleOutlined />,
    },
    approved: {
      text: "Approved",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    rejected: {
      text: "Rejected",
      color: "red",
      icon: <ExclamationCircleOutlined />,
    },
  };

  // Handle view document
  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setIsModalVisible(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedDocument(null);
  };
  // Get file icon
  const getFileIcon = (type) => {
    return type === "pdf" ? (
      <FilePdfOutlined style={{ fontSize: "24px", color: "#f5222d" }} />
    ) : (
      <FileImageOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
    );
  };

  // Handle approval
  const handleApprove = (docId) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId ? { ...doc, status: "approved" } : doc
      )
    );
  };

  // Handle rejection
  const handleReject = (docId) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: "rejected",
              rejectionReason: "Document rejected by reviewer",
            }
          : doc
      )
    );
  };

  // Get status counts
  const getStatusCounts = () => {
    return documents.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, processing: 0, need_approval: 0, approved: 0, rejected: 0 }
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <Title level={3}>Document Processing Status</Title>
      <Text type="secondary">
        Monitor and manage document processing workflow
      </Text>

      {/* Status Summary */}
      <Card
        title="Processing Summary"
        style={{ marginTop: "24px", marginBottom: "24px" }}
      >
        <Space size="large" wrap>
          <div>
            <Text strong>Total Documents: </Text>
            <Tag color="blue">{statusCounts.total}</Tag>
          </div>
          <div>
            <Text strong>Processing: </Text>
            <Tag color="orange">{statusCounts.processing}</Tag>
          </div>
          <div>
            <Text strong>Need Approval: </Text>
            <Tag color="purple">{statusCounts.need_approval}</Tag>
          </div>
          <div>
            <Text strong>Approved: </Text>
            <Tag color="green">{statusCounts.approved}</Tag>
          </div>
          <div>
            <Text strong>Rejected: </Text>
            <Tag color="red">{statusCounts.rejected}</Tag>
          </div>
        </Space>
      </Card>

      {/* Document List */}
      <Card title="Document List">
        <List
          itemLayout="horizontal"
          dataSource={documents}
          renderItem={(doc) => (
            <List.Item
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  size="small"
                  style={{ backgroundColor: "#ffffff", color: "#000000" }}
                  onClick={() => handleViewDocument(doc)}
                >
                  View
                </Button>,
                ...(doc.status === "need_approval"
                  ? [
                      <Button
                        size="small"
                        onClick={() => handleApprove(doc.id)}
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#52c41a",
                          color: "#52c41a",
                        }}
                      >
                        Approve
                      </Button>,
                      <Button
                        size="small"
                        onClick={() => handleReject(doc.id)}
                        style={{
                          backgroundColor: "#ffffff",
                          borderColor: "#f5222d",
                          color: "#f5222d",
                        }}
                      >
                        Reject
                      </Button>,
                    ]
                  : []),
              ]}
            >
              <List.Item.Meta
                avatar={getFileIcon(doc.type)}
                title={
                  <Space>
                    <Text strong>{doc.name}</Text>
                    <Tag color={doc.type === "pdf" ? "red" : "green"}>
                      {doc.type.toUpperCase()}
                    </Tag>
                    <Tag
                      color={statusConfig[doc.status].color}
                      icon={statusConfig[doc.status].icon}
                    >
                      {statusConfig[doc.status].text}
                    </Tag>
                  </Space>
                }
                description={
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Text type="secondary">Size: {doc.size} MB</Text>
                      <Text type="secondary" style={{ marginLeft: "16px" }}>
                        Uploaded: {doc.uploadedAt}
                      </Text>
                    </div>

                    {/* Show extracted data for documents needing approval */}
                    {doc.status === "need_approval" && doc.extractedData && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "12px",
                          backgroundColor: "#f6f6f6",
                          borderRadius: "6px",
                          border: "1px solid #e8e8e8",
                        }}
                      >
                        <Text
                          strong
                          style={{ fontSize: "12px", color: "#666" }}
                        >
                          EXTRACTED INFORMATION:
                        </Text>
                        <div style={{ marginTop: "8px" }}>
                          <div style={{ marginBottom: "4px" }}>
                            <Text style={{ fontSize: "13px" }}>
                              <Text strong>Name: </Text>
                              {doc.extractedData.name}
                            </Text>
                          </div>
                          <div style={{ marginBottom: "4px" }}>
                            <Text style={{ fontSize: "13px" }}>
                              <Text strong>Policy Number: </Text>
                              {doc.extractedData.policyNumber}
                            </Text>
                          </div>
                          <div style={{ marginBottom: "4px" }}>
                            <Text style={{ fontSize: "13px" }}>
                              <Text strong>VIN: </Text>
                              {doc.extractedData.vin}
                            </Text>
                          </div>
                          <div>
                            <Text style={{ fontSize: "13px" }}>
                              <Text strong>Expiration Date: </Text>
                              {doc.extractedData.expirationDate}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}

                    {doc.status === "rejected" && doc.rejectionReason && (
                      <Text type="danger" style={{ fontSize: "12px" }}>
                        Reason: {doc.rejectionReason}
                      </Text>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Document Viewer Modal */}
      <Modal
        title={
          selectedDocument
            ? `View Document: ${selectedDocument.name}`
            : "View Document"
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button
            key="close"
            onClick={handleCloseModal}
            style={{
              backgroundColor: "#ffffff",
              borderColor: "#d9d9d9",
              color: "#000000",
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedDocument && (
          <div style={{ textAlign: "center" }}>
            {selectedDocument.type === "pdf" ? (
              <iframe
                src={selectedDocument.documentUrl}
                width="100%"
                height="600px"
                style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                title={`PDF Viewer - ${selectedDocument.name}`}
              />
            ) : (
              <img
                src={selectedDocument.documentUrl}
                alt={selectedDocument.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                }}
              />
            )}

            <div style={{ marginTop: "16px", textAlign: "left" }}>
              <Space direction="vertical" size="small">
                <div>
                  <Text strong>File: </Text>
                  <Text>{selectedDocument.name}</Text>
                </div>
                <div>
                  <Text strong>Type: </Text>
                  <Tag
                    color={selectedDocument.type === "pdf" ? "red" : "green"}
                  >
                    {selectedDocument.type.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <Text strong>Size: </Text>
                  <Text>{selectedDocument.size} MB</Text>
                </div>
                <div>
                  <Text strong>Status: </Text>
                  <Tag
                    color={statusConfig[selectedDocument.status].color}
                    icon={statusConfig[selectedDocument.status].icon}
                  >
                    {statusConfig[selectedDocument.status].text}
                  </Tag>
                </div>
                <div>
                  <Text strong>Uploaded: </Text>
                  <Text>{selectedDocument.uploadedAt}</Text>
                </div>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DocumentStatus;
