import React, { useState, useEffect } from 'react';
import SideNavigation from "@cloudscape-design/components/side-navigation";
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import PageCal from './PageCal';
import PageDoc from './PageDoc';
import './styles.css'; // Import styles.css here

const App = () => {
  const [activeHref, setActiveHref] = useState("#/page1");
  const [workflowItemCount, setWorkflowItemCount] = useState(0);

  const handleNavigation = (event) => {
    if (!event.detail.external) {
      event.preventDefault();
      setActiveHref(event.detail.href);
    }
  };

  useEffect(() => {
    const fetchWorkflowItemCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/items/count');
        const count = await response.json();
        setWorkflowItemCount(count);
      } catch (error) {
        console.error('Error fetching workflow item count:', error);
      }
    };

    fetchWorkflowItemCount();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <SideNavigation
        activeHref={activeHref}
        header={{ href: "#/", text: "AWS Workflow Candidate App" }}
        onFollow={handleNavigation}
        items={[
          { type: "link", text: "Tool Documentation", href: "#/pageDoc" },
          { type: "link", text: "Create Research Document", href: "#/page1" },
          { type: "link", text: "Draft Candidates", href: "#/page2" },
          { type: "link", text: "Candidate Details", href: "#/page3" },
          { type: "link", text: "Calculate Score", href: "#/PageCal" },
          { type: "link", text: "Visual instructions", href: "#/page4" },
          { type: "divider" },
          {
            type: "link",
            text: `All Workflow items (${workflowItemCount})`,
          },
        ]}
      />
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Render only the content of the active page */}
        {activeHref === "#/page1" && <Page1 />}
        {activeHref === "#/page2" && <Page2 />}
        {activeHref === "#/page3" && <Page3 />}
        {activeHref === "#/PageCal" && <PageCal />}
        {activeHref === "#/page4" && <Page4 />}
        {activeHref === "#/pageDoc" && <PageDoc />}
      </div>
    </div>
  );
};

export default App;





