import React, { useState, useEffect } from "react";

const PageChecklist = () => {
    const [itemId, setItemId] = useState("");
    const [checklist, setChecklist] = useState({});
    const [tasks, setTasks] = useState([
        { id: 1, text: "Create Workflow Details", key: "create_workflow_details", completed: false },
        { id: 2, text: "Entered Research Details", key: "entered_research_details", completed: false },
        { id: 3, text: "Set the Workflow item to Approved", key: "item_approved", completed: false },
        { id: 4, text: "Set Calculations for the workflow item.", key: "item_calculated", completed: false },
        { id: 5, text: "Set the Workflow item to In Progress.", key: "item_progress", completed: false },
        { id: 6, text: "Write a detailed ENG spec.", key: "eng_spec", completed: false },
        { id: 7, text: "Write a common Readme", key: "common_readme", completed: false },
        { id: 8, text: "Write a language specific Readme.", key: "write_code", completed: false },
        { id: 9, text: "Write the code in the given language.", key: "write_tests", completed: false },
        { id: 10, text: "Write tests for the code.", key: "peer_view", completed: false },
        { id: 11, text: "Get a peer to execute the code.", key: "community_post", completed: false },
        { id: 12, text: "Create a post on community.aws.", key: "community_post", completed: false },
        { id: 13, text: "Create a social media post.", key: "social_media_post", completed: false },
    ]);

    const handleInputChange = (event) => {
        setItemId(event.target.value);
    };

    const handleFetchChecklist = () => {
        fetch(`http://localhost:8080/api/items/checklist/${itemId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch checklist");
                }
                return response.json();
            })
            .then((data) => {
                setChecklist(data);
            })
            .catch((error) => {
                console.error("Error fetching checklist:", error);
            });
    };

    return (
        <div style={{ width: "800px", margin: "auto" }}>
            <p>
                This section tracks the steps of the Workflow. All steps must be
                completed before you can set the workflow item to <b>Done</b> Enter the 
                id value of the item and click <b>Fetch Checklist</b>.
            </p>
            <div style={{ marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Enter item ID"
                    value={itemId}
                    onChange={handleInputChange}
                    style={{ marginRight: "8px" }}
                />
                <button onClick={handleFetchChecklist}>Fetch Checklist</button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {tasks.map((task) => (
                    <li
                        key={task.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "12px",
                            padding: "12px",
                            border: "1px solid #e0e0e0",
                            borderRadius: "4px",
                            textAlign: "left",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <input
                            type="checkbox"
                            id={`task-${task.id}`}
                            checked={checklist[task.key]}
                            onChange={() => {}}
                            style={{
                                marginRight: "12px",
                                appearance: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                border: "2px solid #4CAF50",
                                backgroundColor: checklist[task.key] ? "#4CAF50" : "transparent",
                            }}
                        />
                        <label htmlFor={`task-${task.id}`} key={task.id}>
                            <span
                                style={{
                                    textDecoration: checklist[task.key] ? "line-through" : "none",
                                    color: checklist[task.key] ? "#888" : "inherit",
                                    flex: 1,
                                    fontSize: "20px",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    opacity: checklist[task.key] ? 0.7 : 1,
                                }}
                            >
                                {task.text}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PageChecklist;
















