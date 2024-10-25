import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="main">
        <div className="home-container">
          <div className="hero">
            <h1>Welcome to <span>TaskMaster</span></h1>
            <p>
              Manage your day efficiently with <span>To Do Task Master</span> – your ultimate tool for organizing and prioritizing tasks!
            </p>
            <button className="get-started-btn">Get Started</button>
          </div>
          <div className="features">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Organize your tasks easily</li>
              <li>Prioritize what matters most</li>
              <li>Track your progress seamlessly</li>
            </ul>
          </div>
        </div>
    </div>
  );
}

export default Home;
