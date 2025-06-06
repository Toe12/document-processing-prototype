import { Table, Tag, Space, Modal, Button } from "antd";
import { useState } from "react";
import DocumentStatus from "./DocumentStatus";
import DocumentProcessor from "./DocumentProcessor";

const Dashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [uploadModalKey, setUploadModalKey] = useState(0);

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
    setModalKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
    setUploadModalKey((prev) => prev + 1);
  };

  const handleUploadModalClose = () => {
    setIsUploadModalVisible(false);
  };

  // Sample data for the main table
  const mainData = [
    {
      key: "1",
      date: "2024-06-01",
      status: "completed",
      processerId: "PROC001",
      documents: [
        {
          key: "1-1",
          documentName: "Invoice_2024_001.pdf",
          status: "approved",
        },
        {
          key: "1-2",
          documentName: "Receipt_2024_001.pdf",
          status: "approved",
        },
        {
          key: "1-3",
          documentName: "Contract_2024_001.pdf",
          status: "rejected",
        },
      ],
    },
    {
      key: "2",
      date: "2024-06-02",
      status: "processing",
      processerId: "PROC002",
      documents: [
        {
          key: "2-1",
          documentName: "Report_Q2_2024.pdf",
          status: "processing",
        },
        {
          key: "2-2",
          documentName: "Analysis_June.xlsx",
          status: "processing",
        },
      ],
    },
    {
      key: "3",
      date: "2024-06-03",
      status: "processing",
      processerId: "PROC003",
      documents: [
        {
          key: "3-1",
          documentName: "Proposal_2024.docx",
          status: "processing",
        },
        {
          key: "3-2",
          documentName: "Budget_2024.xlsx",
          status: "need approval",
        },
        {
          key: "3-3",
          documentName: "Timeline_2024.pdf",
          status: "approved",
        },
        {
          key: "3-4",
          documentName: "Resources_2024.pdf",
          status: "rejected",
        },
      ],
    },
  ];

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "processing":
        return "blue";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      case "processed":
        return "green";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "need approval":
        return "orange";
      default:
        return "default";
    }
  };

  // Nested table columns (for documents)
  const nestedColumns = [
    {
      title: "Document Name",
      dataIndex: "documentName",
      key: "documentName",
      width: "70%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "30%",
      render: (status) => (
        <Tag color={getStatusColor(status)} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  // Main table columns
  const mainColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Processor ID",
      dataIndex: "processerId",
      key: "processerId",
      width: "20%",
    },
    {
      title: "Documents",
      key: "documentCount",
      width: "15%",
      render: (_, record) => <span>{record.documents.length} documents</span>,
    },
    {
      title: "Actions",
      key: "actions",
      width: "30%",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>View Details</a>
        </Space>
      ),
    },
  ];

  // Expandable row render function
  const expandedRowRender = (record) => {
    return (
      <div style={{ margin: "16px 0" }}>
        <h4 style={{ marginBottom: "12px", color: "#1890ff" }}>
          Documents for {record.processerId}
        </h4>
        <Table
          columns={nestedColumns}
          dataSource={record.documents}
          pagination={false}
          size="small"
          bordered
          style={{ backgroundColor: "#fafafa" }}
        />
      </div>
    );
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: 0, color: "#1890ff" }}>
          Document Processing Status
        </h2>
        <Button
          type="default"
          onClick={showUploadModal}
          style={{
            backgroundColor: "#fff",
            borderColor: "#d9d9d9",
            color: "#000",
          }}
        >
          Upload Documents
        </Button>
      </div>

      <Table
        columns={mainColumns}
        dataSource={mainData}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["1"], // Expand first row by default
          expandRowByClick: true,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        bordered
        size="middle"
        scroll={{ x: 800 }}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {/* Modal for DocumentStatus */}
      <Modal
        title="Document Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <DocumentStatus key={modalKey} record={selectedRecord} />
      </Modal>

      {/* Modal for DocumentProcessor */}
      <Modal
        title="Upload Documents"
        open={isUploadModalVisible}
        onCancel={handleUploadModalClose}
        footer={null}
        width={600}
      >
        <DocumentProcessor
          key={uploadModalKey}
          onClose={handleUploadModalClose}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
