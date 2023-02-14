import { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { selectBoardsAllIds, selectBoardsById } from "../features/boardsSlice";
import { ReactComponent as IconBoard } from "../assets/icon-board.svg";
import { ReactComponent as IconHideSidebar } from "../assets/icon-hide-sidebar.svg";
import { ReactComponent as Logo } from "../assets/logo-dark.svg";
import "../UI/sidebar.scss";

const Sidebar = ({ setShowAddBoardModal, showSidebar, toggleSidebar }) => {
  const allBoardsIds = useSelector(selectBoardsAllIds);
  const allBoards = useSelector(selectBoardsById);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const headerButton = document.querySelector(".header__pick-board");
      const boardButton = document.querySelector(".sidebar__hide");
      const shouldClose =
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !boardButton?.contains(e.target) &&
        !headerButton?.contains(e.target);
      if (shouldClose) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  const handleAddBoard = () => {
    setShowAddBoardModal(true);
    toggleSidebar();
  };

  return (
    <>
      <CSSTransition
        in={showSidebar}
        nodeRef={sidebarRef}
        unmountOnExit
        timeout={300}
        classNames="sidebar"
      >
        <div ref={sidebarRef} className="sidebar">
          <div
            className="sidebar__container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar__body">
              <div className="sidebar__logo">
                <Logo />
              </div>
              <p className="sidebar__header">
                All boards ({allBoardsIds.length})
              </p>
              <nav className="sidebar__nav">
                {allBoardsIds.map((board) => (
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "sidebar__link sidebar__link--active"
                        : isPending
                        ? "sidebar__link sidebar__link--pending"
                        : "sidebar__link"
                    }
                    to={`${allBoards[board].name}`}
                    key={allBoards[board].id}
                    onClick={toggleSidebar}
                  >
                    <IconBoard className="sidebar__link-icon" />
                    <span className="sidebar__link-text">
                      {allBoards[board].name}
                    </span>
                  </NavLink>
                ))}
              </nav>
              <button className="sidebar__new-board" onClick={handleAddBoard}>
                <IconBoard className="sidebar__new-board-icon" />+ Create New
                Board
              </button>
            </div>
            <div className="sidebar__hide">
              <button className="sidebar__hide-btn" onClick={toggleSidebar}>
                <IconHideSidebar />
                <div className="sidebar__hide-text">Hide Sidebar</div>
              </button>
            </div>
          </div>
          <div className="sidebar__overlay" onClick={toggleSidebar}></div>
        </div>
      </CSSTransition>
    </>
  );
};

export default Sidebar;
