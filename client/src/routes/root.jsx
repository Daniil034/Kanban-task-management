import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import BoardAddEdit from "../components/BoardAddEdit";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { ReactComponent as IconShowSidebar } from "../assets/icon-show-sidebar.svg";
import "../UI/root.scss";

const Root = () => {
  const [currentBoard, setCurrentBoard] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAddBoardModal, setShowAddBoardModal] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    const body = document.querySelector("body");
    body.classList.toggle("noscroll");
  };

  return (
    <div className="root">
      <Sidebar
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        setShowAddBoardModal={setShowAddBoardModal}
      />

      <div className="root__content">
        <Header
          currentBoard={currentBoard}
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
        {showAddBoardModal && (
          <BoardAddEdit setShowAddBoardModal={setShowAddBoardModal} />
        )}
        {!showSidebar && (
        <div className="root__show-sidebar" onClick={toggleSidebar}>
          <IconShowSidebar />
        </div>
      )}
        <Outlet context={{ setCurrentBoard,  }} />
      </div>
    </div>
  );
};

export default Root;
