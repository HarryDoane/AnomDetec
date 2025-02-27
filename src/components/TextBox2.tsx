import React from "react";
import "./TextBox2.css"; // Import the styles

const TextBox2 = () => {
  return (
    <div className="text-box2">
      <p>
        PktWatch is an anomaly detection tool for packet sizes that allows users
        to upload a csv type dataset, select a column containing packet size
        data, and choose an anomoly detection algorithm. You are then able to
        visualize the detections in graphical form. Try it below...
      </p>
    </div>
  );
};

export default TextBox2;
