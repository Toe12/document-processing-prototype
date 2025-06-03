import { useState, useEffect } from "react";
import {
  Card,
  List,
  Tag,
  Button,
  Typography,
  Space,
  Modal,
  Collapse,
} from "antd";
import {
  FileImageOutlined,
  FilePdfOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./DocumentStatus.css"; // Import the CSS file

const { Title, Text } = Typography;
const { Panel } = Collapse;

const DocumentStatus = () => {
  const [documents, setDocuments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Sample documents with different statuses
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

  // Group documents by status
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.status]) {
      acc[doc.status] = [];
    }
    acc[doc.status].push(doc);
    return acc;
  }, {});

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
      <FilePdfOutlined className="file-icon-pdf" />
    ) : (
      <FileImageOutlined className="file-icon-image" />
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

  // Define the order of statuses
  const statusOrder = ["need_approval", "processing", "approved", "rejected"];

  return (
    <div className="document-status-container">
      <div className="document-status-header">
        <Title level={3} className="document-status-title">
          Document Processing Status
        </Title>
        <Text type="secondary" className="document-status-subtitle">
          Monitor and manage document processing workflow
        </Text>
      </div>

      {/* Status Summary */}
      <Card title="Processing Summary" className="status-summary-card">
        <Space size="large" wrap>
          <div className="status-summary-item">
            <Text strong className="status-summary-label">
              Total Documents:{" "}
            </Text>
            <Tag color="blue">{statusCounts.total}</Tag>
          </div>
          <div className="status-summary-item">
            <Text strong className="status-summary-label">
              Processing:{" "}
            </Text>
            <Tag color="orange">{statusCounts.processing}</Tag>
          </div>
          <div className="status-summary-item">
            <Text strong className="status-summary-label">
              Need Approval:{" "}
            </Text>
            <Tag color="purple">{statusCounts.need_approval}</Tag>
          </div>
          <div className="status-summary-item">
            <Text strong className="status-summary-label">
              Approved:{" "}
            </Text>
            <Tag color="green">{statusCounts.approved}</Tag>
          </div>
          <div className="status-summary-item">
            <Text strong className="status-summary-label">
              Rejected:{" "}
            </Text>
            <Tag color="red">{statusCounts.rejected}</Tag>
          </div>
        </Space>
      </Card>

      {/* Grouped Document Lists */}
      <Card title="Documents by Status" className="documents-grouped-card">
        <Collapse
          defaultActiveKey={["need_approval", "processing"]}
          size="large"
          className="status-collapse"
        >
          {statusOrder.map((status) => {
            const docsInStatus = groupedDocuments[status] || [];
            if (docsInStatus.length === 0) return null;

            return (
              <Panel
                header={
                  <div className="status-panel-header">
                    {statusConfig[status].icon}
                    <Text strong>{statusConfig[status].text}</Text>
                    <Tag color={statusConfig[status].color}>
                      {docsInStatus.length}
                    </Tag>
                  </div>
                }
                key={status}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={docsInStatus}
                  renderItem={(doc) => (
                    <List.Item
                      className="document-list-item"
                      actions={[
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          size="small"
                          className="action-button action-button-view"
                          onClick={() => handleViewDocument(doc)}
                        >
                          View
                        </Button>,
                        ...(doc.status === "need_approval"
                          ? [
                              <Button
                                size="small"
                                onClick={() => handleApprove(doc.id)}
                                className="action-button action-button-approve"
                              >
                                Approve
                              </Button>,
                              <Button
                                size="small"
                                onClick={() => handleReject(doc.id)}
                                className="action-button action-button-reject"
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
                            <Tag
                              color={doc.type === "pdf" ? "red" : "green"}
                              className={`file-type-tag-${doc.type}`}
                            >
                              {doc.type.toUpperCase()}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div className="document-metadata">
                              <Text
                                type="secondary"
                                className="document-metadata-item"
                              >
                                Size: {doc.size} MB
                              </Text>
                              <Text
                                type="secondary"
                                className="document-metadata-item"
                              >
                                Uploaded: {doc.uploadedAt}
                              </Text>
                            </div>

                            {/* Show extracted data for documents needing approval */}
                            {doc.status === "need_approval" &&
                              doc.extractedData && (
                                <div className="extracted-data-section">
                                  <Text
                                    strong
                                    className="extracted-data-header"
                                  >
                                    EXTRACTED INFORMATION:
                                  </Text>
                                  <div className="extracted-data-content">
                                    <div className="extracted-data-item">
                                      <span className="extracted-data-label">
                                        Name:{" "}
                                      </span>
                                      {doc.extractedData.name}
                                    </div>
                                    <div className="extracted-data-item">
                                      <span className="extracted-data-label">
                                        Policy Number:{" "}
                                      </span>
                                      {doc.extractedData.policyNumber}
                                    </div>
                                    <div className="extracted-data-item">
                                      <span className="extracted-data-label">
                                        VIN:{" "}
                                      </span>
                                      {doc.extractedData.vin}
                                    </div>
                                    <div className="extracted-data-item">
                                      <span className="extracted-data-label">
                                        Expiration Date:{" "}
                                      </span>
                                      {doc.extractedData.expirationDate}
                                    </div>
                                  </div>
                                </div>
                              )}

                            {doc.status === "rejected" &&
                              doc.rejectionReason && (
                                <Text
                                  type="danger"
                                  className="rejection-reason"
                                >
                                  Reason: {doc.rejectionReason}
                                </Text>
                              )}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Panel>
            );
          })}
        </Collapse>
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
            className="action-button"
          >
            Close
          </Button>,
        ]}
        width={800}
        className="document-modal"
      >
        {selectedDocument && (
          <div className="document-viewer">
            {selectedDocument.type === "pdf" ? (
              <iframe
                src={selectedDocument.documentUrl}
                width="100%"
                height="600px"
                title={`PDF Viewer - ${selectedDocument.name}`}
              />
            ) : (
              <img
                src={selectedDocument.documentUrl}
                alt={selectedDocument.name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "600px",
                }}
              />
            )}

            <div className="document-viewer-info">
              <Space direction="vertical" size="small">
                <div className="document-viewer-info-item">
                  <Text strong className="document-viewer-info-label">
                    File:{" "}
                  </Text>
                  <Text>{selectedDocument.name}</Text>
                </div>
                <div className="document-viewer-info-item">
                  <Text strong className="document-viewer-info-label">
                    Type:{" "}
                  </Text>
                  <Tag
                    color={selectedDocument.type === "pdf" ? "red" : "green"}
                  >
                    {selectedDocument.type.toUpperCase()}
                  </Tag>
                </div>
                <div className="document-viewer-info-item">
                  <Text strong className="document-viewer-info-label">
                    Size:{" "}
                  </Text>
                  <Text>{selectedDocument.size} MB</Text>
                </div>
                <div className="document-viewer-info-item">
                  <Text strong className="document-viewer-info-label">
                    Status:{" "}
                  </Text>
                  <Tag
                    color={statusConfig[selectedDocument.status].color}
                    icon={statusConfig[selectedDocument.status].icon}
                  >
                    {statusConfig[selectedDocument.status].text}
                  </Tag>
                </div>
                <div className="document-viewer-info-item">
                  <Text strong className="document-viewer-info-label">
                    Uploaded:{" "}
                  </Text>
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
