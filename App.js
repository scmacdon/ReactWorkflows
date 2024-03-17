import React, { useState, useEffect } from 'react';
import SideNavigation from "@cloudscape-design/components/side-navigation";
import PageDetails from './PageDetails';
import PageCandidate from './PageCandidate';
import PageCanDetails from './PageCanDetails';
import Page4 from './Page4';
import PageCal from './PageCal';
import PageDoc from './PageDoc';
import PageUpdate from './PageUpdate';
import PageCards from './PageCards';
import PageResearch from './PageResearch'; 
import PageChecklist from './PageChecklist'; // Check the correct file path
import './styles.css'; // Import styles.css here

const App = () => {
  const [activeHref, setActiveHref] = useState("#/pageDoc"); // Set default to #/pageDoc
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
          { type: "link", text: "Workflow Details", href: "#/pageDetails" },
          { type: "link", text: "Research Details", href: "#/PageResearch" },
          { type: "link", text: "Update Workflow Details", href: "#/pageUpdate" },
          { type: "link", text: "Draft Candidates", href: "#/PageCandidate" },
          { type: "link", text: "Candidate Details", href: "#/PageCanDetails" },
          { type: "link", text: "Calculate Score", href: "#/PageCal" },
          { type: "link", text: "Checklist", href: "#/PageChecklist" },
          { type: "link", text: "Visual instructions", href: "#/page4" },
          { type: "divider" },
          {
            type: "link",
            text: `All Workflow items (${workflowItemCount})`, href: "#/PageCards"
            
          },
        ]}
      />
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Render only the content of the active page */}
        {activeHref === "#/pageDetails" && <PageDetails />}
        {activeHref === "#/PageCandidate" && <PageCandidate />}
        {activeHref === "#/PageCanDetails" && <PageCanDetails />}
        {activeHref === "#/PageCal" && <PageCal />}
        {activeHref === "#/page4" && <Page4 />}
        {activeHref === "#/pageDoc" && <PageDoc />}
        {activeHref === "#/pageUpdate" && <PageUpdate />}
        {activeHref === "#/PageCards" && <PageCards />}
        {activeHref === "#/PageResearch" && <PageResearch />}
        {activeHref === "#/PageChecklist" && <PageChecklist />}
      </div>
    </div>
  );
};

export default App;