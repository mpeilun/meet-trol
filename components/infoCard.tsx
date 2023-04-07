import React from "react";

interface InfoCardProps {
  title: string;
  message: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, message }) => {
  const cardStyle = {
    minWidth: 275,
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "16px",
    marginBottom: "16px",
  };

  const titleStyle = {
    fontSize: 20,
    fontWeight: "bold",
  };

  const messageStyle = {
    fontSize: 16,
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={messageStyle}>{message}</div>
    </div>
  );
};

export default InfoCard;
